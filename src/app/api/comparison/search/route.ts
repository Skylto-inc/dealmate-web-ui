import { NextRequest, NextResponse } from 'next/server';
import { Product, ComparisonResult } from '@/types/comparison';

// Mock data for demonstration - Replace with actual API calls
const MOCK_VENDORS = ['Amazon', 'Walmart', 'Target', 'Best Buy', 'eBay', 'Flipkart'];

const MOCK_CATEGORIES = [
  'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Health', 'Automotive'
];

function generateMockProduct(name: string, vendor: string, basePrice: number): Product {
  const discount = Math.random() * 0.4; // 0-40% discount
  const originalPrice = basePrice * (1 + Math.random() * 0.5); // 0-50% markup
  const price = originalPrice * (1 - discount);
  
  return {
    id: `${vendor.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: `${name} - ${vendor}`,
    description: `High-quality ${name.toLowerCase()} from ${vendor}`,
    category: MOCK_CATEGORIES[Math.floor(Math.random() * MOCK_CATEGORIES.length)],
    vendor,
    price: Math.round(price * 100) / 100,
    originalPrice: Math.round(originalPrice * 100) / 100,
    currency: 'USD',
    rating: 3 + Math.random() * 2, // 3-5 rating
    reviewCount: Math.floor(Math.random() * 10000) + 100,
    imageUrl: `https://picsum.photos/300/300?random=${Math.floor(Math.random() * 1000)}`,
    availability: Math.random() > 0.1, // 90% availability
    deliveryTime: `${Math.floor(Math.random() * 7) + 1}-${Math.floor(Math.random() * 5) + 3} days`,
    features: [
      'High Quality',
      'Fast Shipping',
      'Customer Support',
      'Warranty Included'
    ].slice(0, Math.floor(Math.random() * 4) + 1),
    url: `https://${vendor.toLowerCase()}.com/product/${name.toLowerCase().replace(/\s+/g, '-')}`,
    discount: Math.round(discount * 100),
    cashbackRate: Math.random() * 5, // 0-5% cashback
    affiliateLink: `https://affiliate.${vendor.toLowerCase()}.com/product`,
    inStock: Math.random() > 0.15, // 85% in stock
    lastUpdated: new Date()
  };
}

async function fetchFromRealAPIs(query: string, category?: string): Promise<Product[]> {
  // This is where you'd integrate with real APIs
  // For now, we'll return mock data
  
  const basePrice = 50 + Math.random() * 500; // $50-$550 base price
  const products: Product[] = [];
  
  // Generate products from different vendors
  const vendorCount = Math.floor(Math.random() * 4) + 3; // 3-6 vendors
  const selectedVendors = MOCK_VENDORS.sort(() => 0.5 - Math.random()).slice(0, vendorCount);
  
  for (const vendor of selectedVendors) {
    products.push(generateMockProduct(query, vendor, basePrice));
  }
  
  return products;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const vendors = searchParams.get('vendors')?.split(',');
    const minRating = searchParams.get('minRating');
    const inStock = searchParams.get('inStock');
    const sortBy = searchParams.get('sortBy') as 'price' | 'rating' | 'name' | 'discount' | null;
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' | null;

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Fetch products from APIs (mock data for now)
    let products = await fetchFromRealAPIs(query, category || undefined);

    // Apply filters
    if (priceMin) {
      products = products.filter(p => p.price >= parseFloat(priceMin));
    }
    if (priceMax) {
      products = products.filter(p => p.price <= parseFloat(priceMax));
    }
    if (vendors && vendors.length > 0) {
      products = products.filter(p => vendors.includes(p.vendor));
    }
    if (minRating) {
      products = products.filter(p => p.rating >= parseFloat(minRating));
    }
    if (inStock === 'true') {
      products = products.filter(p => p.inStock);
    }

    // Apply sorting
    if (sortBy) {
      products.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (sortBy) {
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'rating':
            aValue = a.rating;
            bValue = b.rating;
            break;
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'discount':
            aValue = a.discount || 0;
            bValue = b.discount || 0;
            break;
          default:
            return 0;
        }
        
        if (sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    const priceRange = {
      min: Math.min(...products.map(p => p.price)),
      max: Math.max(...products.map(p => p.price))
    };

    const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length;

    const result: ComparisonResult = {
      products,
      category: category || 'All',
      searchQuery: query,
      totalResults: products.length,
      priceRange,
      avgRating: Math.round(avgRating * 10) / 10,
      timestamp: new Date()
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in comparison search:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
