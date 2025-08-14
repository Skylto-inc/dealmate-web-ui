import { NextRequest, NextResponse } from 'next/server';
import { RecommendationsResponse } from '@/types/recommendations';

// Mock user activity data for demo
const userActivityDatabase = new Map<string, any[]>();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    // In a real implementation, this would:
    // 1. Fetch user's browse history from database
    // 2. Get purchase history
    // 3. Get wishlist items
    // 4. Run recommendation algorithm
    // 5. Return personalized products
    
    const personalizedRecommendations: RecommendationsResponse = {
      sections: [
        {
          title: 'Recently Viewed',
          type: 'recently-viewed',
          recommendations: [
            {
              id: 'rv1',
              title: 'iPhone 15 Pro Max',
              imageUrl: 'https://images.unsplash.com/photo-1696446702983-ac2f67d6aeab?w=600&h=400&fit=crop',
              currentPrice: '₹1,34,900',
              originalPrice: '₹1,59,900',
              discount: '16%',
              platform: 'Amazon',
              category: 'Electronics',
              lastUpdated: new Date(),
              recommendationType: 'recently-viewed',
              reason: 'You viewed this 2 hours ago',
              score: 0.98,
              metadata: {
                lastViewed: new Date(Date.now() - 2 * 60 * 60 * 1000),
                viewCount: 3,
              },
            },
            {
              id: 'rv2',
              title: 'MacBook Air M2',
              imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop',
              currentPrice: '₹99,900',
              originalPrice: '₹1,14,900',
              discount: '13%',
              platform: 'Flipkart',
              category: 'Electronics',
              lastUpdated: new Date(),
              recommendationType: 'recently-viewed',
              reason: 'You viewed this yesterday',
              score: 0.95,
              metadata: {
                lastViewed: new Date(Date.now() - 24 * 60 * 60 * 1000),
                viewCount: 5,
              },
            },
          ],
          icon: '👀',
          showViewMore: true,
        },
        {
          title: 'Based on Your Interests',
          type: 'personalized',
          recommendations: [
            {
              id: 'p1',
              title: 'Samsung Galaxy S24 Ultra',
              imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=400&fit=crop',
              currentPrice: '₹1,09,999',
              originalPrice: '₹1,29,999',
              discount: '15%',
              platform: 'Samsung Store',
              category: 'Electronics',
              lastUpdated: new Date(),
              recommendationType: 'personalized',
              reason: 'Because you like premium smartphones',
              score: 0.94,
            },
            {
              id: 'p2',
              title: 'iPad Pro 12.9"',
              imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop',
              currentPrice: '₹1,12,900',
              originalPrice: '₹1,29,900',
              discount: '13%',
              platform: 'Apple Store',
              category: 'Electronics',
              lastUpdated: new Date(),
              recommendationType: 'personalized',
              reason: 'Popular with MacBook users',
              score: 0.92,
            },
            {
              id: 'p3',
              title: 'AirPods Pro 2',
              imageUrl: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=600&h=400&fit=crop',
              currentPrice: '₹20,990',
              originalPrice: '₹24,900',
              discount: '16%',
              platform: 'Amazon',
              category: 'Electronics',
              lastUpdated: new Date(),
              recommendationType: 'personalized',
              reason: 'Complements your Apple devices',
              score: 0.90,
            },
          ],
          icon: '✨',
          showViewMore: true,
        },
        {
          title: 'Price Drops on Your Wishlist',
          type: 'price-drop',
          recommendations: [
            {
              id: 'pd1',
              title: 'Sony PlayStation 5',
              imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=400&fit=crop',
              currentPrice: '₹44,990',
              originalPrice: '₹54,990',
              discount: '18%',
              platform: 'Flipkart',
              category: 'Gaming',
              lastUpdated: new Date(),
              recommendationType: 'price-drop',
              reason: 'Price dropped by ₹10,000',
              score: 0.96,
              metadata: {
                priceDrop: 10000,
                previousPrice: '₹54,990',
              },
            },
            {
              id: 'pd2',
              title: 'Bose QuietComfort 45',
              imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=400&fit=crop',
              currentPrice: '₹25,900',
              originalPrice: '₹35,900',
              discount: '28%',
              platform: 'Amazon',
              category: 'Electronics',
              lastUpdated: new Date(),
              recommendationType: 'price-drop',
              reason: 'Lowest price in 6 months',
              score: 0.93,
              metadata: {
                priceDrop: 10000,
                previousPrice: '₹35,900',
              },
            },
          ],
          icon: '📉',
          showViewMore: false,
        },
      ],
      totalCount: 7,
      hasMore: true,
    };

    return NextResponse.json(personalizedRecommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
