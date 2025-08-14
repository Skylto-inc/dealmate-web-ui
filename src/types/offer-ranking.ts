export interface RankedOffer {
  // Deal properties
  id: number;
  external_id: string;
  title: string;
  description?: string;
  original_price: string;
  discounted_price?: string;
  discount_percentage?: string;
  currency: string;
  product_url: string;
  image_url?: string;
  merchant: string;
  category?: string;
  deal_type?: string;
  coupon_code?: string;
  cashback_rate?: string;
  minimum_order_value?: string;
  maximum_discount?: string;
  valid_from: string;
  valid_until?: string;
  is_active: boolean;
  is_verified: boolean;
  verification_date?: string;
  usage_count: number;
  success_rate?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  
  // Ranking properties
  ranking_score: number;
  ranking_components: RankingComponents;
  personalization_data: PersonalizationData;
  stacking_opportunities: StackingOpportunity[];
}

export interface RankingComponents {
  net_savings_score: number;
  cashback_realization_score: number;
  reward_points_score: number;
  threshold_proximity_score: number;
  personal_preference_score: number;
  urgency_score: number;
  popularity_score: number;
  stacking_potential_score: number;
}

export interface PersonalizationData {
  user_category_affinity: number;
  merchant_preference_score: number;
  price_range_match: number;
  payment_method_compatibility: number;
  geographic_relevance: number;
}

export interface StackingOpportunity {
  stack_type: StackType;
  additional_savings: string;
  combined_offer_ids: number[];
  description: string;
}

export type StackType = 
  | 'coupon_plus_cashback'
  | 'card_offer_plus_coupon'
  | 'bank_offer_plus_wallet'
  | 'multiple_coupons'
  | 'reward_points_bonus';

export interface OfferRankingRequest {
  user_id: string;
  deals: number[]; // Deal IDs to rank
  user_location?: UserLocation;
  preferred_payment_methods?: string[];
  max_results?: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  postal_code?: string;
}

export interface OfferRankingResponse {
  ranked_offers: RankedOffer[];
  total_count: number;
  personalization_applied: boolean;
  ranking_timestamp: string;
}

export interface UserPreferences {
  user_id: string;
  favorite_categories: string[];
  favorite_merchants: string[];
  typical_spend_range: SpendRange;
  preferred_cashback_types: CashbackType[];
  notification_preferences: NotificationPreferences;
}

export interface SpendRange {
  min_amount: string;
  max_amount: string;
  currency: string;
}

export type CashbackType = 
  | 'instant'
  | 'wallet'
  | 'bank_transfer'
  | 'reward_points'
  | 'vouchers';

export interface NotificationPreferences {
  threshold_alerts: boolean;
  expiry_reminders: boolean;
  new_offer_alerts: boolean;
  price_drop_alerts: boolean;
}

export interface RankingWeights {
  net_savings: number;
  cashback_realization: number;
  reward_points: number;
  threshold_proximity: number;
  personal_preference: number;
  urgency: number;
  popularity: number;
  stacking_potential: number;
}

export interface UserActivity {
  user_id: string;
  recent_purchases: Purchase[];
  browsing_history: BrowsingEvent[];
  saved_offers: number[];
  redeemed_offers: number[];
}

export interface Purchase {
  merchant: string;
  category: string;
  amount: string;
  currency: string;
  timestamp: string;
}

export interface BrowsingEvent {
  category: string;
  merchant?: string;
  price_range: SpendRange;
  timestamp: string;
}

// Helper type for sorting options
export type SortOption = 
  | 'ranking_score'
  | 'net_savings'
  | 'cashback_realization'
  | 'popularity'
  | 'urgency'
  | 'price_low_to_high'
  | 'price_high_to_low';

// Filter options for the UI
export interface OfferFilters {
  categories?: string[];
  merchants?: string[];
  min_savings?: number;
  max_price?: number;
  cashback_types?: CashbackType[];
  expiring_soon?: boolean;
  verified_only?: boolean;
  stackable_only?: boolean;
}
