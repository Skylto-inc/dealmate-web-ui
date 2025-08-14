import { NextRequest, NextResponse } from 'next/server';
import { SearchSuggestion } from '@/types/comparison';

const POPULAR_SEARCHES = [
  { query: 'iPhone 15', category: 'Electronics', resultCount: 45, trending: true },
  { query: 'MacBook Pro', category: 'Electronics', resultCount: 32, trending: true },
  { query: 'Air Fryer', category: 'Home & Garden', resultCount: 78, trending: false },
  { query: 'Nike Sneakers', category: 'Fashion', resultCount: 156, trending: true },
  { query: 'Coffee Machine', category: 'Home & Garden', resultCount: 89, trending: false },
  { query: 'Gaming Chair', category: 'Home & Garden', resultCount: 43, trending: true },
  { query: 'Wireless Headphones', category: 'Electronics', resultCount: 167, trending: false },
  { query: 'Yoga Mat', category: 'Sports & Fitness', resultCount: 234, trending: false },
  { query: 'Smartwatch', category: 'Electronics', resultCount: 67, trending: true },
  { query: 'Protein Powder', category: 'Health & Beauty', resultCount: 123, trending: false }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      // Return popular searches if no query provided
      return NextResponse.json(POPULAR_SEARCHES.slice(0, 5));
    }

    // Filter suggestions based on query
    const filteredSuggestions = POPULAR_SEARCHES.filter(suggestion =>
      suggestion.query.toLowerCase().includes(query.toLowerCase())
    );

    // If no matches, generate some mock suggestions based on the query
    if (filteredSuggestions.length === 0) {
      const mockSuggestions: SearchSuggestion[] = [
        {
          query: `${query} deals`,
          category: 'All',
          resultCount: Math.floor(Math.random() * 100) + 10,
          trending: false
        },
        {
          query: `best ${query}`,
          category: 'All',
          resultCount: Math.floor(Math.random() * 50) + 5,
          trending: Math.random() > 0.7
        },
        {
          query: `${query} reviews`,
          category: 'All',
          resultCount: Math.floor(Math.random() * 75) + 15,
          trending: false
        }
      ];
      return NextResponse.json(mockSuggestions);
    }

    return NextResponse.json(filteredSuggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
}
