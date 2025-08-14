'use client';

import { useState } from 'react';
import { ComparisonFilters as FiltersType } from '@/types/comparison';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, RotateCcw } from 'lucide-react';

interface ComparisonFiltersProps {
  onFiltersChange: (filters: FiltersType) => void;
}

const VENDORS = [
  'Amazon', 'Walmart', 'Target', 'Best Buy', 'eBay', 'Flipkart', 'Costco', 'Home Depot'
];

const CATEGORIES = [
  'Electronics', 'Fashion', 'Home & Garden', 'Sports & Fitness', 
  'Health & Beauty', 'Automotive', 'Books & Media', 'Food & Beverages'
];

export function ComparisonFilters({ onFiltersChange }: ComparisonFiltersProps) {
  const [filters, setFilters] = useState<FiltersType>({
    priceMin: 0,
    priceMax: 1000,
    vendor: [],
    rating: 0,
    inStock: undefined,
    category: '',
    sortBy: 'price',
    sortOrder: 'asc'
  });

  const updateFilters = (newFilters: Partial<FiltersType>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FiltersType = {
      priceMin: 0,
      priceMax: 1000,
      vendor: [],
      rating: 0,
      inStock: undefined,
      category: '',
      sortBy: 'price',
      sortOrder: 'asc'
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const handleVendorChange = (vendor: string, checked: boolean) => {
    const newVendors = checked 
      ? [...(filters.vendor || []), vendor]
      : (filters.vendor || []).filter(v => v !== vendor);
    updateFilters({ vendor: newVendors });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <Button variant="outline" size="sm" onClick={resetFilters}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Price Range</Label>
          <div className="px-3">
            <Slider
              value={[filters.priceMin || 0, filters.priceMax || 1000]}
              onValueChange={([min, max]) => updateFilters({ priceMin: min, priceMax: max })}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.priceMin || ''}
              onChange={(e) => updateFilters({ priceMin: parseInt(e.target.value) || 0 })}
              className="w-20"
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.priceMax || ''}
              onChange={(e) => updateFilters({ priceMax: parseInt(e.target.value) || 1000 })}
              className="w-20"
            />
          </div>
        </div>

        {/* Vendors */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Vendors</Label>
          <div className="grid grid-cols-2 gap-2">
            {VENDORS.map((vendor) => (
              <div key={vendor} className="flex items-center space-x-2">
                <Checkbox
                  id={`vendor-${vendor}`}
                  checked={(filters.vendor || []).includes(vendor)}
                  onCheckedChange={(checked) => 
                    handleVendorChange(vendor, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`vendor-${vendor}`}
                  className="text-sm cursor-pointer"
                >
                  {vendor}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Minimum Rating */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Minimum Rating</Label>
          <Select 
            value={filters.rating?.toString() || '0'} 
            onValueChange={(value) => updateFilters({ rating: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any rating</SelectItem>
              <SelectItem value="1">1+ stars</SelectItem>
              <SelectItem value="2">2+ stars</SelectItem>
              <SelectItem value="3">3+ stars</SelectItem>
              <SelectItem value="4">4+ stars</SelectItem>
              <SelectItem value="5">5 stars only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Category</Label>
          <Select 
            value={filters.category || ''} 
            onValueChange={(value) => updateFilters({ category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stock Status */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Availability</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock === true}
                onCheckedChange={(checked) => 
                  updateFilters({ inStock: checked ? true : undefined })
                }
              />
              <Label htmlFor="in-stock" className="text-sm cursor-pointer">
                In stock only
              </Label>
            </div>
          </div>
        </div>

        {/* Sort By */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Sort By</Label>
          <div className="flex gap-2">
            <Select 
              value={filters.sortBy || 'price'} 
              onValueChange={(value) => updateFilters({ sortBy: value as any })}
            >
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="discount">Discount</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.sortOrder || 'asc'} 
              onValueChange={(value) => updateFilters({ sortOrder: value as any })}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">↑</SelectItem>
                <SelectItem value="desc">↓</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(filters.vendor?.length || filters.category || filters.inStock !== undefined) && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Active Filters</Label>
            <div className="flex flex-wrap gap-1">
              {filters.vendor?.map((vendor) => (
                <div key={vendor} className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                  {vendor}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 w-4 h-4"
                    onClick={() => handleVendorChange(vendor, false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              
              {filters.category && (
                <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                  {filters.category}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 w-4 h-4"
                    onClick={() => updateFilters({ category: '' })}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              {filters.inStock && (
                <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                  In Stock
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 w-4 h-4"
                    onClick={() => updateFilters({ inStock: undefined })}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
