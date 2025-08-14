import { NextRequest, NextResponse } from 'next/server';
import { ComparisonCategory } from '@/types/comparison';

const COMPARISON_CATEGORIES: ComparisonCategory[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: '📱',
    subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Headphones', 'Cameras'],
    popularSearches: ['iPhone 15', 'MacBook Pro', 'AirPods', 'Samsung Galaxy', 'Dell XPS']
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: '👕',
    subcategories: ['Clothing', 'Shoes', 'Accessories', 'Watches', 'Bags'],
    popularSearches: ['Nike Sneakers', 'Levi\'s Jeans', 'Ray-Ban Sunglasses', 'Coach Bag']
  },
  {
    id: 'home',
    name: 'Home & Garden',
    icon: '🏠',
    subcategories: ['Furniture', 'Kitchen', 'Decor', 'Tools', 'Garden'],
    popularSearches: ['Office Chair', 'Coffee Machine', 'Vacuum Cleaner', 'Air Fryer']
  },
  {
    id: 'sports',
    name: 'Sports & Fitness',
    icon: '⚽',
    subcategories: ['Exercise Equipment', 'Sports Gear', 'Outdoor', 'Fitness Accessories'],
    popularSearches: ['Yoga Mat', 'Dumbbells', 'Running Shoes', 'Protein Powder']
  },
  {
    id: 'health',
    name: 'Health & Beauty',
    icon: '💄',
    subcategories: ['Skincare', 'Makeup', 'Supplements', 'Personal Care'],
    popularSearches: ['Vitamin D', 'Moisturizer', 'Electric Toothbrush', 'Sunscreen']
  },
  {
    id: 'automotive',
    name: 'Automotive',
    icon: '🚗',
    subcategories: ['Car Parts', 'Accessories', 'Tools', 'Electronics'],
    popularSearches: ['Car Phone Mount', 'Dash Cam', 'Car Charger', 'Floor Mats']
  },
  {
    id: 'books',
    name: 'Books & Media',
    icon: '📚',
    subcategories: ['Books', 'E-readers', 'Audiobooks', 'Movies', 'Games'],
    popularSearches: ['Kindle', 'Best Sellers', 'Textbooks', 'Gaming Headset']
  },
  {
    id: 'food',
    name: 'Food & Beverages',
    icon: '🍕',
    subcategories: ['Grocery', 'Snacks', 'Beverages', 'Organic', 'Supplements'],
    popularSearches: ['Protein Bars', 'Coffee Beans', 'Organic Honey', 'Green Tea']
  }
];

export async function GET() {
  try {
    return NextResponse.json(COMPARISON_CATEGORIES);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
