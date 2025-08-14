export interface MarketplaceListing {
  id: string;
  seller_id: string;
  listing_type: ListingType;
  title: string;
  description?: string;
  category: string;
  brand_name?: string;
  original_value?: number;
  selling_price: number;
  discount_percentage?: number;
  expiration_date?: string;
  proof_image_url?: string;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
  view_count: number;
  purchase_count: number;
  stock_quantity?: number;
  tags: string[];
  is_verified: boolean;
  verification_date?: string;
}

export type ListingType = 
  | 'discount_code'
  | 'gift_card'
  | 'referral_link'
  | 'location_deal'
  | 'cashback_offer'
  | 'loyalty_points';

export type ListingStatus = 'active' | 'sold' | 'expired' | 'suspended';

export type TransactionStatus = 'pending' | 'escrow' | 'completed' | 'cancelled' | 'disputed';

export type PaymentType = 'card' | 'paypal' | 'upi' | 'wallet';

export interface ListingWithSeller extends MarketplaceListing {
  seller: {
    id: string;
    username: string;
    trust_score: number;
    profile_image?: string;
    total_sales?: number;
    average_rating?: number;
  };
}

// Legacy format for backward compatibility
export interface ListingWithSellerLegacy {
  listing: MarketplaceListing;
  seller_username: string;
  seller_trust_score: number;
  seller_profile_image?: string;
}

// Re-export MarketplaceTransaction as Transaction for convenience
export type Transaction = MarketplaceTransaction;

export interface ListingFilters {
  category?: string;
  listing_type?: string;
  min_price?: number;
  max_price?: number;
  seller_id?: string;
  status?: string;
  is_verified?: boolean;
  search_query?: string;
  sort_by?: string;
  page?: number;
  limit?: number;
}

export interface CreateListingRequest {
  listing_type: string;
  title: string;
  description?: string;
  category: string;
  brand_name?: string;
  original_value?: number;
  selling_price: number;
  discount_percentage?: number;
  expiration_date?: string;
  proof_image_url?: string;
  tags: string[];
  coupon_code?: string;
}

export interface UpdateListingRequest {
  title?: string;
  description?: string;
  category?: string;
  brand_name?: string;
  original_value?: number;
  selling_price?: number;
  discount_percentage?: number;
  expiration_date?: string;
  proof_image_url?: string;
  tags?: string[];
}

export interface MarketplaceTransaction {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  status: TransactionStatus;
  payment_method?: string;
  payment_id?: string;
  escrow_release_date?: string;
  created_at: string;
  completed_at?: string;
  cancellation_reason?: string;
  dispute_reason?: string;
}

export interface CreateTransactionRequest {
  listing_id: string;
  payment_method: string;
}

export interface MarketplaceReview {
  id: string;
  transaction_id: string;
  reviewer_id: string;
  reviewed_user_id: string;
  rating: number;
  review_text?: string;
  deal_verified: boolean;
  created_at: string;
  is_buyer_review: boolean;
}

export interface CreateReviewRequest {
  transaction_id: string;
  rating: number;
  review_text?: string;
  deal_verified: boolean;
}

export interface MarketplaceTrustScore {
  user_id: string;
  total_transactions: number;
  successful_transactions: number;
  average_rating: number;
  total_reviews: number;
  verified_seller: boolean;
  trust_score: number;
  last_calculated: string;
}

export interface MarketplaceProfile {
  user_id: string;
  username: string;
  profile_image_url?: string;
  trust_score: MarketplaceTrustScore;
  total_listings: number;
  active_listings: number;
  completed_sales: number;
  member_since: string;
}

export interface TransactionSummary {
  total_sales: number;
  total_purchases: number;
  pending_transactions: number;
  completed_transactions: number;
  average_transaction_value: number;
}

export interface TransactionDetail {
  transaction: MarketplaceTransaction;
  listing: MarketplaceListing;
  buyer_username: string;
  seller_username: string;
  can_review: boolean;
  has_reviewed: boolean;
}

export interface MarketplaceNotification {
  id: string;
  user_id: string;
  notification_type: string;
  title: string;
  message: string;
  related_listing_id?: string;
  related_transaction_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  new_listing_alerts: boolean;
  price_drop_alerts: boolean;
  transaction_updates: boolean;
  review_notifications: boolean;
}

export interface DashboardData {
  profile: MarketplaceProfile;
  transaction_summary: TransactionSummary;
  recent_listings: ListingWithSeller[];
  recent_transactions: TransactionDetail[];
  unread_notifications: number;
}
