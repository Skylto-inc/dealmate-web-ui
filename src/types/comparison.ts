export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  vendor: string;
  price: number;
  originalPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  availability: boolean;
  deliveryTime?: string;
  features: string[];
  url: string;
  discount?: number;
  cashbackRate?: number;
  affiliateLink?: string;
  inStock: boolean;
  lastUpdated: Date;
}

export interface ComparisonResult {
  products: Product[];
  category: string;
  searchQuery: string;
  totalResults: number;
  priceRange: {
    min: number;
    max: number;
  };
  avgRating: number;
  timestamp: Date;
}

export interface ComparisonFilters {
  priceMin?: number;
  priceMax?: number;
  vendor?: string[];
  rating?: number;
  inStock?: boolean;
  category?: string;
  sortBy?: 'price' | 'rating' | 'name' | 'discount';
  sortOrder?: 'asc' | 'desc';
}

export interface ComparisonStats {
  bestPrice: Product;
  highestRated: Product;
  bestValue: Product; // Best price/rating ratio
  biggestDiscount: Product;
  fastestDelivery: Product;
}

export interface VendorInfo {
  id: string;
  name: string;
  logo: string;
  rating: number;
  trustScore: number;
  cashbackRate: number;
  avgDeliveryTime: string;
  returnPolicy: string;
}

export interface ComparisonCategory {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
  popularSearches: string[];
}

export interface SearchSuggestion {
  query: string;
  category: string;
  resultCount: number;
  trending: boolean;
}
