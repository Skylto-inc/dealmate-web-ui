import { NextRequest, NextResponse } from 'next/server';
import { RecommendationsResponse } from '@/types/recommendations';

export async function GET(request: NextRequest) {
  try {
    // This would fetch trending products for non-authenticated users
    // or users with no history
    
    const trendingRecommendations: RecommendationsResponse = {
      sections: [
        {
          title: 'Trending Now',
          type: 'trending',
          recommendations: [
            {
              id: 't1',
              title: 'Nothing Phone (2)',
              imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=400&fit=crop',
              currentPrice: '₹39,999',
              originalPrice: '₹44,999',
              discount: '11%',
              platform: 'Flipkart',
              category: 'Electronics',
              lastUpdated: new Date(),
              recommendationType: 'trending',
              reason: '#1 in Smartphones today',
              score: 0.97,
            },
            {
              id: 't2',
              title: 'JBL Flip 6',
              imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=400&fit=crop',
              currentPrice: '₹8,999',
              originalPrice: '₹11,999',
              discount: '25%',
              platform: 'Amazon',
              category: 'Electronics',
              lastUpdated: new Date(),
              recommendationType: 'trending',
              reason: 'Hot deal - 500+ bought today',
              score: 0.95,
            },
            {
              id: 't3',
              title: 'Fossil Gen 6 Smartwatch',
              imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=400&fit=crop',
              currentPrice: '₹19,995',
              originalPrice: '₹29,995',
              discount: '33%',
              platform: 'Myntra',
              category: 'Fashion',
              lastUpdated: new Date(),
              recommendationType: 'trending',
              reason: 'Flash sale ending soon',
              score: 0.93,
            },
          ],
          icon: '🔥',
          showViewMore: true,
        },
        {
          title: 'Best Deals Today',
          type: 'price-drop',
          recommendations: [
            {
              id: 'bd1',
              title: 'Mi Robot Vacuum',
              imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
              currentPrice: '₹17,999',
              originalPrice: '₹29,999',
              discount: '40%',
              platform: 'Mi Store',
              category: 'Home',
              lastUpdated: new Date(),
              recommendationType: 'price-drop',
              reason: 'Biggest discount ever',
              score: 0.96,
              metadata: {
                priceDrop: 12000,
                previousPrice: '₹29,999',
              },
            },
            {
              id: 'bd2',
              title: 'OnePlus Buds Pro 2',
              imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=400&fit=crop',
              currentPrice: '₹9,999',
              originalPrice: '₹11,999',
              discount: '17%',
              platform: 'OnePlus Store',
              category: 'Electronics',
              lastUpdated: new Date(),
              recommendationType: 'price-drop',
              reason: 'Limited time offer',
              score: 0.91,
              metadata: {
                priceDrop: 2000,
                previousPrice: '₹11,999',
              },
            },
          ],
          icon: '💰',
          showViewMore: true,
        },
        {
          title: 'Popular in Electronics',
          type: 'category-based',
          recommendations: [
            {
              id: 'c1',
              title: 'Kindle Paperwhite',
              imageUrl: 'https://images.unsplash.com/photo-1592434134753-a70c5c5d1d06?w=600&h=400&fit=crop',
              currentPrice: '₹11,999',
              originalPrice: '₹13,999',
              discount: '14%',
              platform: 'Amazon',
              category: 'Electronics',
              lastUpdated: new Date(),
              recommendationType: 'category-based',
              reason: 'Bestseller in E-readers',
              score: 0.89,
            },
            {
              id: 'c2',
              title: 'GoPro Hero 12',
              imageUrl: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=400&fit=crop',
              currentPrice: '₹35,990',
              originalPrice: '₹44,990',
              discount: '20%',
              platform: 'Flipkart',
              category: 'Electronics',
              lastUpdated: new Date(),
              recommendationType: 'category-based',
              reason: 'Top rated action camera',
              score: 0.88,
            },
          ],
          icon: '📱',
          showViewMore: false,
        },
      ],
      totalCount: 7,
      hasMore: true,
    };

    return NextResponse.json(trendingRecommendations);
  } catch (error) {
    console.error('Error fetching trending recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending recommendations' },
      { status: 500 }
    );
  }
}
