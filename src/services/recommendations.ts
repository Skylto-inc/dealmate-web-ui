import { UserActivity, RecommendationsResponse, Recommendation, Product } from '@/types/recommendations';

export class RecommendationsService {
  private static getBaseUrl(): string {
    // Check if we're on the server side
    if (typeof window === 'undefined') {
      // During SSR, we need to use the full URL
      // In production, this would be your actual domain
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      const host = process.env.NEXT_PUBLIC_APP_URL || 'localhost:3000';
      return `${protocol}://${host}`;
    }
    // On client side, we can use relative URLs
    return '';
  }

  static async trackUserActivity(activity: Omit<UserActivity, 'timestamp'>): Promise<void> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/api/activity/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...activity,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.error('Failed to track user activity');
      }
    } catch (error) {
      console.error('Error tracking user activity:', error);
    }
  }

  static async getRecommendations(userId?: string): Promise<RecommendationsResponse> {
    try {
      const baseUrl = this.getBaseUrl();
      const url = userId 
        ? `${baseUrl}/api/recommendations/${userId}`
        : `${baseUrl}/api/recommendations/trending`;
      
      const response = await fetch(url, {
        credentials: 'include',
        cache: 'no-store', // Ensure fresh data
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Return fallback recommendations
      return getFallbackRecommendations();
    }
  }

  static async markNotInterested(userId: string, productId: string): Promise<void> {
    try {
      const baseUrl = this.getBaseUrl();
      await fetch(`${baseUrl}/api/recommendations/not-interested`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId, productId }),
      });
    } catch (error) {
      console.error('Error marking product as not interested:', error);
    }
  }
}

// Fallback recommendations for demo/error scenarios
function getFallbackRecommendations(): RecommendationsResponse {
  const demoProducts: Recommendation[] = [
    {
      id: '1',
      title: 'Samsung Galaxy Buds Pro',
      imageUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=400&fit=crop',
      currentPrice: '₹14,999',
      originalPrice: '₹19,999',
      discount: '25%',
      platform: 'Amazon',
      category: 'Electronics',
      lastUpdated: new Date(),
      recommendationType: 'trending',
      reason: 'Trending in Electronics',
      score: 0.95,
    },
    {
      id: '2',
      title: 'Nike Air Max 270',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
      currentPrice: '₹7,999',
      originalPrice: '₹12,995',
      discount: '38%',
      platform: 'Myntra',
      category: 'Fashion',
      lastUpdated: new Date(),
      recommendationType: 'price-drop',
      reason: 'Price dropped by ₹5,000',
      score: 0.92,
      metadata: {
        priceDrop: 5000,
        previousPrice: '₹12,995',
      },
    },
    {
      id: '3',
      title: 'Apple Watch Series 9',
      imageUrl: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=400&fit=crop',
      currentPrice: '₹39,900',
      originalPrice: '₹44,900',
      discount: '11%',
      platform: 'Flipkart',
      category: 'Electronics',
      lastUpdated: new Date(),
      recommendationType: 'trending',
      reason: 'Popular in Smartwatches',
      score: 0.89,
    },
    {
      id: '4',
      title: 'Sony WH-1000XM5',
      imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=400&fit=crop',
      currentPrice: '₹24,990',
      originalPrice: '₹34,990',
      discount: '29%',
      platform: 'Amazon',
      category: 'Electronics',
      lastUpdated: new Date(),
      recommendationType: 'category-based',
      reason: 'Top rated in Audio',
      score: 0.88,
    },
    {
      id: '5',
      title: 'IKEA Standing Desk',
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop',
      currentPrice: '₹19,999',
      originalPrice: '₹29,999',
      discount: '33%',
      platform: 'IKEA',
      category: 'Furniture',
      lastUpdated: new Date(),
      recommendationType: 'price-drop',
      reason: 'Lowest price in 30 days',
      score: 0.87,
      metadata: {
        priceDrop: 10000,
        previousPrice: '₹29,999',
      },
    },
  ];

  return {
    sections: [
      {
        title: 'Trending Deals',
        type: 'trending',
        recommendations: demoProducts.filter(p => p.recommendationType === 'trending'),
        icon: '🔥',
        showViewMore: true,
      },
      {
        title: 'Price Drops',
        type: 'price-drop',
        recommendations: demoProducts.filter(p => p.recommendationType === 'price-drop'),
        icon: '📉',
        showViewMore: true,
      },
      {
        title: 'Recommended Categories',
        type: 'category-based',
        recommendations: demoProducts.filter(p => p.recommendationType === 'category-based'),
        icon: '🎯',
        showViewMore: false,
      },
    ],
    totalCount: demoProducts.length,
    hasMore: true,
  };
}

export default RecommendationsService;
