export interface UserActivity {
  userId: string;
  productId: string;
  action: 'view' | 'click' | 'purchase' | 'wishlist' | 'search';
  timestamp: Date;
  metadata?: {
    searchQuery?: string;
    category?: string;
    price?: number;
    platform?: string;
  };
}

export interface Product {
  id: string;
  title: string;
  imageUrl: string;
  currentPrice: string;
  originalPrice: string;
  discount: string;
  platform: string;
  category: string;
  lastUpdated: Date;
  dealScore?: number;
}

export interface Recommendation extends Product {
  recommendationType: RecommendationType;
  reason: string;
  score: number;
  metadata?: {
    priceDrop?: number;
    previousPrice?: string;
    viewCount?: number;
    lastViewed?: Date;
  };
}

export type RecommendationType = 
  | 'recently-viewed'
  | 'similar-products' 
  | 'price-drop'
  | 'category-based'
  | 'trending'
  | 'personalized'
  | 'wishlist-alert';

export interface RecommendationSection {
  title: string;
  type: RecommendationType;
  recommendations: Recommendation[];
  icon?: string;
  showViewMore?: boolean;
}

export interface RecommendationsResponse {
  sections: RecommendationSection[];
  totalCount: number;
  hasMore: boolean;
}
