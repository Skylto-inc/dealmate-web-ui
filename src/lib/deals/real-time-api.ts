import { authApi } from '@/lib/auth';

export interface RealTimeDeal {
  id: string;
  product_name: string;
  platform: string;
  current_price: string;
  original_price: string;
  discount_percentage: number;
  price_history: PricePoint[];
  url: string;
  image_url?: string;
  category: string;
  brand?: string;
  rating?: number;
  review_count?: number;
  in_stock: boolean;
  flash_sale: boolean;
  deal_expires_at?: string;
  bank_offers: BankOffer[];
  coupon_codes: CouponCode[];
  cashback_offers: CashbackOffer[];
  total_savings: string;
  final_price: string;
  deal_score: number;
  created_at: string;
  updated_at: string;
}

export interface PricePoint {
  price: string;
  timestamp: string;
}

export interface BankOffer {
  bank_name: string;
  card_type: string;
  discount_type: DiscountType;
  discount_value: string;
  max_discount?: string;
  min_purchase?: string;
  description: string;
  valid_until?: string;
}

export type DiscountType = 
  | { type: 'percentage'; value: number }
  | { type: 'flat_amount'; value: string }
  | { type: 'cashback'; value: number };

export interface CouponCode {
  code: string;
  description: string;
  discount_type: DiscountType;
  min_purchase?: string;
  max_uses?: number;
  valid_until?: string;
}

export interface CashbackOffer {
  provider: string;
  cashback_percentage: number;
  max_cashback?: string;
  payment_method?: string;
  description: string;
}

export interface DealFilter {
  categories?: string[];
  platforms?: string[];
  min_discount?: number;
  max_price?: string;
  brands?: string[];
  include_bank_offers?: boolean;
  include_coupons?: boolean;
  flash_sales_only?: boolean;
}

export interface DealAlert {
  id: string;
  user_id: string;
  product_name: string;
  target_price?: string;
  min_discount?: number;
  platforms: string[];
  alert_type: 'price_drop' | 'back_in_stock' | 'flash_sale' | 'discount_threshold';
  created_at: string;
  last_triggered?: string;
}

export interface GetDealsParams {
  categories?: string;
  platforms?: string;
  min_discount?: number;
  max_price?: number;
  brands?: string;
  include_bank_offers?: boolean;
  include_coupons?: boolean;
  flash_sales_only?: boolean;
  limit?: number;
  offset?: number;
}

export interface GetDealsResponse {
  deals: RealTimeDeal[];
  total: number;
}

export interface CreateAlertRequest {
  user_id: string;
  product_name: string;
  target_price?: number;
  min_discount?: number;
  platforms: string[];
  alert_type: 'price_drop' | 'back_in_stock' | 'flash_sale' | 'discount_threshold';
}

export const realTimeDealsApi = {
  async getDeals(params: GetDealsParams = {}): Promise<GetDealsResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    
    const response = await authApi.makeAuthenticatedRequest(`/api/v1/real-time-deals?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch deals');
    }
    
    return response.json();
  },

  async getTrendingDeals(): Promise<GetDealsResponse> {
    const response = await authApi.makeAuthenticatedRequest('/api/v1/real-time-deals/trending');
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending deals');
    }
    
    return response.json();
  },

  async getFlashSales(): Promise<GetDealsResponse> {
    const response = await authApi.makeAuthenticatedRequest('/api/v1/real-time-deals/flash-sales');
    
    if (!response.ok) {
      throw new Error('Failed to fetch flash sales');
    }
    
    return response.json();
  },

  async createAlert(alert: CreateAlertRequest): Promise<DealAlert> {
    const response = await authApi.makeAuthenticatedRequest('/api/v1/real-time-deals/alerts', {
      method: 'POST',
      body: JSON.stringify(alert),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create alert');
    }
    
    return response.json();
  },

  async getPriceHistory(platform: string, productName: string): Promise<PricePoint[]> {
    const params = new URLSearchParams({
      platform,
      product_name: productName,
    });
    
    const response = await authApi.makeAuthenticatedRequest(`/api/v1/real-time-deals/price-history?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch price history');
    }
    
    return response.json();
  },
};
