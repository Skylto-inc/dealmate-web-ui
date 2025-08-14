import { 
  OfferRankingRequest, 
  OfferRankingResponse, 
  UserPreferences, 
  RankingWeights,
  UserActivity 
} from '@/types/offer-ranking';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class OfferRankingService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async rankOffers(request: OfferRankingRequest): Promise<OfferRankingResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/offers/rank`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to rank offers');
    }

    return response.json();
  }

  async getUserPreferences(userId: string): Promise<UserPreferences> {
    const response = await fetch(`${API_BASE_URL}/api/v1/offers/preferences`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get user preferences');
    }

    return response.json();
  }

  async updateUserPreferences(preferences: UserPreferences): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/offers/preferences`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error('Failed to update user preferences');
    }
  }

  async getRankingWeights(): Promise<RankingWeights> {
    const response = await fetch(`${API_BASE_URL}/api/v1/offers/weights`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get ranking weights');
    }

    return response.json();
  }

  async getUserActivity(userId: string): Promise<UserActivity> {
    const response = await fetch(`${API_BASE_URL}/api/v1/offers/activity`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get user activity');
    }

    return response.json();
  }

  // Helper method to get current user location
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          resolve(null);
        }
      );
    });
  }

  // Format savings for display
  formatSavings(amount: string | number, currency: string = '₹'): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `${currency}${numAmount.toLocaleString('en-IN', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2 
    })}`;
  }

  // Calculate total savings from ranking components
  calculateTotalSavings(
    originalPrice: string, 
    discountedPrice?: string,
    cashbackRate?: string
  ): number {
    const original = parseFloat(originalPrice);
    const discounted = discountedPrice ? parseFloat(discountedPrice) : original;
    const discount = original - discounted;
    
    const cashback = cashbackRate 
      ? (discounted * parseFloat(cashbackRate) / 100)
      : 0;
    
    return discount + cashback;
  }

  // Get score color based on value (0-1)
  getScoreColor(score: number): string {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    if (score >= 0.4) return 'text-orange-600';
    return 'text-red-600';
  }

  // Get score badge color
  getScoreBadgeColor(score: number): string {
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800';
    if (score >= 0.4) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  }

  // Format percentage for display
  formatPercentage(value: number): string {
    return `${Math.round(value * 100)}%`;
  }

  // Get urgency message
  getUrgencyMessage(score: number): string {
    if (score >= 0.8) return 'Expiring Soon!';
    if (score >= 0.6) return 'Limited Time';
    if (score >= 0.4) return 'Few Days Left';
    return '';
  }

  // Get cashback realization message
  getCashbackMessage(score: number): string {
    if (score >= 0.8) return 'Instant Cashback';
    if (score >= 0.6) return 'Quick Cashback';
    if (score >= 0.4) return 'Standard Cashback';
    return 'Delayed Cashback';
  }
}

export const offerRankingService = new OfferRankingService();
