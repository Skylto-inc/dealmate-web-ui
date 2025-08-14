import {
  ListingWithSeller,
  ListingFilters,
  CreateListingRequest,
  UpdateListingRequest,
  MarketplaceListing,
  MarketplaceTransaction,
  CreateTransactionRequest,
  MarketplaceReview,
  CreateReviewRequest,
  MarketplaceProfile,
  MarketplaceNotification,
  NotificationSettings,
  DashboardData,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class MarketplaceApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api`;
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    try {
      const token = localStorage.getItem('auth_token');
      
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      // If backend is not running, return empty data instead of crashing
      console.warn('Marketplace API error:', error);
      
      // Return sensible defaults based on the endpoint
      if (url.includes('/listings')) {
        return [];
      }
      if (url.includes('/profile')) {
        return null;
      }
      if (url.includes('/dashboard')) {
        return {
          profile: null,
          transaction_summary: {
            total_sales: 0,
            total_purchases: 0,
            pending_transactions: 0,
            completed_transactions: 0,
            average_transaction_value: 0,
          },
          recent_listings: [],
          recent_transactions: [],
          unread_notifications: 0,
        };
      }
      
      throw error;
    }
  }

  // Public endpoints
  async getListings(filters: ListingFilters = {}): Promise<ListingWithSeller[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    return this.fetchWithAuth(`${this.baseUrl}/marketplace/listings?${params}`);
  }

  async getListing(id: string): Promise<ListingWithSeller> {
    return this.fetchWithAuth(`${this.baseUrl}/marketplace/listings/${id}`);
  }

  async getCouponCode(listingId: string): Promise<{ coupon_code: string | null; has_access: boolean }> {
    return this.fetchWithAuth(`${this.baseUrl}/v1/marketplace/listings/${listingId}/coupon`);
  }

  async getUserProfile(userId: string): Promise<MarketplaceProfile> {
    return this.fetchWithAuth(`${this.baseUrl}/marketplace/profile/${userId}`);
  }

  // Authenticated endpoints - Listing management
  async createListing(data: CreateListingRequest): Promise<MarketplaceListing> {
    return this.fetchWithAuth(`${this.baseUrl}/v1/marketplace/listings`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateListing(id: string, data: UpdateListingRequest): Promise<MarketplaceListing> {
    return this.fetchWithAuth(`${this.baseUrl}/v1/marketplace/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteListing(id: string): Promise<void> {
    await this.fetchWithAuth(`${this.baseUrl}/v1/marketplace/listings/${id}`, {
      method: 'DELETE',
    });
  }

  async submitForVerification(id: string): Promise<void> {
    await this.fetchWithAuth(`${this.baseUrl}/v1/marketplace/listings/${id}/verify`, {
      method: 'POST',
    });
  }

  // Transaction management
  async createTransaction(data: CreateTransactionRequest): Promise<MarketplaceTransaction> {
    return this.fetchWithAuth(`${this.baseUrl}/v1/marketplace/transactions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserTransactions(): Promise<MarketplaceTransaction[]> {
    return this.fetchWithAuth(`${this.baseUrl}/v1/marketplace/transactions`);
  }

  async getTransaction(id: string): Promise<MarketplaceTransaction> {
    return this.fetchWithAuth(`${this.baseUrl}/v1/marketplace/transactions/${id}`);
  }

  async completeTransaction(id: string): Promise<MarketplaceTransaction> {
    return this.fetchWithAuth(`${this.baseUrl}/v1/marketplace/transactions/${id}/complete`, {
      method: 'PUT',
    });
  }

  async cancelTransaction(id: string, reason: string): Promise<void> {
    await this.fetchWithAuth(`${this.baseUrl}/v1/marketplace/transactions/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  async disputeTransaction(id: string, reason: string, evidence?: string): Promise<void> {
    await this.fetchWithAuth(`${this.baseUrl}/v1/marketplace/transactions/${id}/dispute`, {
      method: 'POST',
      body: JSON.stringify({ reason, evidence }),
    });
  }

  // Review management
  async createReview(data: CreateReviewRequest): Promise<MarketplaceReview> {
    return this.fetchWithAuth(`${this.baseUrl}/v1/marketplace/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserReviews(userId: string): Promise<MarketplaceReview[]> {
    return this.fetchWithAuth(`${this.baseUrl}/v1/marketplace/reviews/user/${userId}`);
  }

  async getListingReviews(listingId: string): Promise<MarketplaceReview[]> {
    return this.fetchWithAuth(`${this.baseUrl}/v1/marketplace/reviews/listing/${listingId}`);
  }

  // Notifications
  async getNotifications(): Promise<MarketplaceNotification[]> {
    return this.fetchWithAuth(`${this.baseUrl}/v1/marketplace/notifications`);
  }

  async markNotificationRead(id: string): Promise<void> {
    await this.fetchWithAuth(`${this.baseUrl}/v1/marketplace/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    return this.fetchWithAuth(`${this.baseUrl}/v1/marketplace/notifications/settings`);
  }

  async updateNotificationSettings(settings: NotificationSettings): Promise<NotificationSettings> {
    return this.fetchWithAuth(`${this.baseUrl}/v1/marketplace/notifications/settings`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Dashboard
  async getDashboardData(): Promise<DashboardData> {
    return this.fetchWithAuth(`${this.baseUrl}/v1/marketplace/dashboard`);
  }

  async getMyListings(filters: ListingFilters = {}): Promise<ListingWithSeller[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    return this.fetchWithAuth(`${this.baseUrl}/v1/marketplace/my-listings?${params}`);
  }

  // Get revealed coupon code after purchase
  async getRevealedCoupon(listingId: string): Promise<string | null> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}/v1/marketplace/listings/${listingId}/coupon`);
      return response.coupon_code || null;
    } catch (error) {
      console.error('Failed to get coupon code:', error);
      return null;
    }
  }

  // Image upload helper
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/v1/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  }
}

export const marketplaceApi = new MarketplaceApi();
