'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, ShoppingCart, Tag, Gift, MapPin, DollarSign, Award, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import ListingGrid from '@/components/marketplace/listings/ListingGrid';
import CategoryFilter from '@/components/marketplace/shared/CategoryFilter';
import CreateListingModal from '@/components/marketplace/modals/CreateListingModal';
import { ListingWithSeller, ListingFilters } from '@/lib/marketplace/types';
import { marketplaceApi } from '@/lib/marketplace/api';

const listingTypeIcons = {
  discount_code: <Tag className="h-4 w-4" />,
  gift_card: <Gift className="h-4 w-4" />,
  referral_link: <MapPin className="h-4 w-4" />,
  location_deal: <MapPin className="h-4 w-4" />,
  cashback_offer: <DollarSign className="h-4 w-4" />,
  loyalty_points: <Award className="h-4 w-4" />,
};

const categories = [
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'fashion', name: 'Fashion', icon: '👕' },
  { id: 'food', name: 'Food & Dining', icon: '🍔' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'beauty', name: 'Beauty & Health', icon: '💄' },
  { id: 'home', name: 'Home & Living', icon: '🏠' },
  { id: 'sports', name: 'Sports & Fitness', icon: '⚽' },
];

export default function MarketplacePage() {
  const [listings, setListings] = useState<ListingWithSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('created_at');
  const [page, setPage] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [searchQuery, selectedCategory, selectedType, sortBy, page]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const filters: ListingFilters = {
        search_query: searchQuery || undefined,
        category: selectedCategory || undefined,
        listing_type: selectedType || undefined,
        sort_by: sortBy,
        page,
        limit: 20,
        status: 'active',
      };

      const data = await marketplaceApi.getListings(filters);
      setListings(data);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredDeals = listings.slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Deal Marketplace</h1>
          <Button size="lg" onClick={() => setShowCreateModal(true)}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Sell a Deal
          </Button>
        </div>

        {/* Search Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for deals, brands, or categories..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Newest First</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="popularity">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Categories */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Featured Deals */}
      {!searchQuery && !selectedCategory && !selectedType && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Featured Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredDeals.map((listing) => (
                <Link key={listing.id} href={`/marketplace/listing/${listing.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm line-clamp-2">{listing.title}</h3>
                        {listingTypeIcons[listing.listing_type as keyof typeof listingTypeIcons]}
                      </div>
                      <p className="text-2xl font-bold text-primary mb-1">
                        ${listing.selling_price}
                      </p>
                      {listing.original_value && (
                        <p className="text-sm text-gray-500 line-through">
                          ${listing.original_value}
                        </p>
                      )}
                      {listing.discount_percentage && (
                        <Badge variant="secondary" className="mt-2">
                          {listing.discount_percentage}% OFF
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Listing Types Tabs */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all" onClick={() => setSelectedType(null)}>
            All Deals
          </TabsTrigger>
          <TabsTrigger value="discount_code" onClick={() => setSelectedType('discount_code')}>
            <Tag className="mr-1 h-3 w-3" />
            Codes
          </TabsTrigger>
          <TabsTrigger value="gift_card" onClick={() => setSelectedType('gift_card')}>
            <Gift className="mr-1 h-3 w-3" />
            Gift Cards
          </TabsTrigger>
          <TabsTrigger value="referral_link" onClick={() => setSelectedType('referral_link')}>
            <MapPin className="mr-1 h-3 w-3" />
            Referrals
          </TabsTrigger>
          <TabsTrigger value="location_deal" onClick={() => setSelectedType('location_deal')}>
            <MapPin className="mr-1 h-3 w-3" />
            Local
          </TabsTrigger>
          <TabsTrigger value="cashback_offer" onClick={() => setSelectedType('cashback_offer')}>
            <DollarSign className="mr-1 h-3 w-3" />
            Cashback
          </TabsTrigger>
          <TabsTrigger value="loyalty_points" onClick={() => setSelectedType('loyalty_points')}>
            <Award className="mr-1 h-3 w-3" />
            Points
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Main Listings Grid */}
      <ListingGrid 
        listings={listings}
        loading={loading}
        onLoadMore={() => setPage(page + 1)}
      />

      {/* Empty State */}
      {!loading && listings.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500 mb-4">No deals found matching your criteria.</p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory(null);
              setSelectedType(null);
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Listing Modal */}
      <CreateListingModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={() => {
          setShowCreateModal(false);
          fetchListings(); // Refresh listings after successful creation
        }}
      />
    </div>
  );
}
