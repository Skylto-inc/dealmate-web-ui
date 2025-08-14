'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ComparisonResult, ComparisonCategory, SearchSuggestion, ComparisonFilters as FiltersType } from '@/types/comparison';
import { comparisonService } from '@/services/comparison';
import { 
  ProductGrid, 
  ProductList, 
  ComparisonFilters, 
  ComparisonStats, 
  CategoryGrid, 
  SearchSuggestions 
} from '@/components/comparison';

export default function ComparePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [categories, setCategories] = useState<ComparisonCategory[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    loadCategories();
    loadPopularSuggestions();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await comparisonService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadPopularSuggestions = async () => {
    try {
      const suggestionsData = await comparisonService.getSearchSuggestions('');
      setSuggestions(suggestionsData);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const handleSearch = async (query: string, category?: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const result = await comparisonService.searchProducts(query, category);
      setComparisonResult(result);
      setSearchQuery(query);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: ComparisonCategory) => {
    setSelectedCategory(category.id);
    if (searchQuery) {
      handleSearch(searchQuery, category.id);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery, selectedCategory);
    }
  };

  return (
    <div className="min-h-screen-safe space-y-6">
      {/* Hero Section */}
      <div className="glass-card p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Compare Products & Prices
          </h1>
          <p className="text-muted-foreground text-lg">
            Find the best deals across multiple vendors instantly
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 max-w-2xl mx-auto mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for products to compare..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 h-12"
            />
          </div>
          <Button 
            onClick={() => handleSearch(searchQuery, selectedCategory)}
            size="lg"
            className="px-8"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Compare'}
          </Button>
        </div>

        {/* Quick Categories */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.slice(0, 6).map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => handleCategoryClick(category)}
            >
              {category.icon} {category.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {comparisonResult ? (
        <div className="space-y-6">
          {/* Comparison Stats */}
          <ComparisonStats products={comparisonResult.products} />

          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {comparisonResult.totalResults} results for "{comparisonResult.searchQuery}"
              </h2>
              {comparisonResult.category && comparisonResult.category !== 'All' && (
                <Badge variant="secondary">{comparisonResult.category}</Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <ComparisonFilters
              onFiltersChange={(filters: FiltersType) => {
                // Apply filters to current results
                console.log('Applying filters:', filters);
              }}
            />
          )}

          {/* Products Display */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list')}>
            <TabsContent value="grid">
              <ProductGrid products={comparisonResult.products} />
            </TabsContent>
            <TabsContent value="list">
              <ProductList products={comparisonResult.products} />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid className="h-5 w-5" />
                Browse Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryGrid 
                categories={categories} 
                onCategoryClick={handleCategoryClick}
              />
            </CardContent>
          </Card>

          {/* Popular Searches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SearchSuggestions 
                suggestions={suggestions}
                onSuggestionClick={handleSuggestionClick}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-32 w-full mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-6 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
