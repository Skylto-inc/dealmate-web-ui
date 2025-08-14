import { 
  Product, 
  ComparisonResult, 
  ComparisonFilters, 
  ComparisonStats,
  VendorInfo,
  ComparisonCategory,
  SearchSuggestion 
} from '@/types/comparison';

class ComparisonService {
  private apiBase = '/api/comparison';

  async searchProducts(
    query: string, 
    category?: string, 
    filters?: ComparisonFilters
  ): Promise<ComparisonResult> {
    const params = new URLSearchParams({
      q: query,
      ...(category && { category }),
      ...(filters?.priceMin && { priceMin: filters.priceMin.toString() }),
      ...(filters?.priceMax && { priceMax: filters.priceMax.toString() }),
      ...(filters?.vendor && { vendors: filters.vendor.join(',') }),
      ...(filters?.rating && { minRating: filters.rating.toString() }),
      ...(filters?.inStock !== undefined && { inStock: filters.inStock.toString() }),
      ...(filters?.sortBy && { sortBy: filters.sortBy }),
      ...(filters?.sortOrder && { sortOrder: filters.sortOrder }),
    });

    const response = await fetch(`${this.apiBase}/search?${params}`);
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    return response.json();
  }

  async compareProducts(productIds: string[]): Promise<Product[]> {
    const response = await fetch(`${this.apiBase}/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds })
    });
    
    if (!response.ok) {
      throw new Error('Failed to compare products');
    }
    return response.json();
  }

  async getVendorPrices(productName: string): Promise<Product[]> {
    const response = await fetch(
      `${this.apiBase}/vendors?product=${encodeURIComponent(productName)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to get vendor prices');
    }
    return response.json();
  }

  async getComparisonStats(products: Product[]): Promise<ComparisonStats> {
    const bestPrice = products.reduce((min, product) => 
      product.price < min.price ? product : min
    );
    
    const highestRated = products.reduce((max, product) => 
      product.rating > max.rating ? product : max
    );
    
    const bestValue = products.reduce((best, product) => {
      const valueScore = product.rating / product.price;
      const bestScore = best.rating / best.price;
      return valueScore > bestScore ? product : best;
    });
    
    const biggestDiscount = products.reduce((max, product) => 
      (product.discount || 0) > (max.discount || 0) ? product : max
    );
    
    const fastestDelivery = products.reduce((fastest, product) => {
      if (!product.deliveryTime || !fastest.deliveryTime) return fastest;
      const productDays = this.parseDeliveryDays(product.deliveryTime);
      const fastestDays = this.parseDeliveryDays(fastest.deliveryTime);
      return productDays < fastestDays ? product : fastest;
    });

    return {
      bestPrice,
      highestRated,
      bestValue,
      biggestDiscount,
      fastestDelivery
    };
  }

  async getCategories(): Promise<ComparisonCategory[]> {
    const response = await fetch(`${this.apiBase}/categories`);
    if (!response.ok) {
      throw new Error('Failed to get categories');
    }
    return response.json();
  }

  async getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
    const response = await fetch(
      `${this.apiBase}/suggestions?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error('Failed to get search suggestions');
    }
    return response.json();
  }

  async getVendorInfo(vendorId: string): Promise<VendorInfo> {
    const response = await fetch(`${this.apiBase}/vendors/${vendorId}`);
    if (!response.ok) {
      throw new Error('Failed to get vendor info');
    }
    return response.json();
  }

  private parseDeliveryDays(deliveryTime: string): number {
    const match = deliveryTime.match(/(\d+)/);
    return match ? parseInt(match[1]) : 999;
  }

  // Cache results for better performance
  private cache = new Map<string, { data: any; timestamp: number }>();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(method: string, params: any): string {
    return `${method}_${JSON.stringify(params)}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
}

export const comparisonService = new ComparisonService();
