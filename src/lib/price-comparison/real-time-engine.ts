/**
 * Real-Time Price Comparison Engine
 * Implements high-performance price monitoring with lazy evaluation
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { globalDataCache } from '@/lib/performance/lazy-loader';

// Types
export interface PriceData {
  productId: string;
  vendor: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  shipping?: number;
  tax?: number;
  totalPrice: number;
  currency: string;
  availability: 'in-stock' | 'out-of-stock' | 'limited';
  lastUpdated: string;
  priceHistory?: PricePoint[];
}

export interface PricePoint {
  timestamp: string;
  price: number;
  event?: string; // sale, price-drop, price-increase
}

export interface PriceComparison {
  productId: string;
  productName: string;
  lowestPrice: PriceData;
  highestPrice: PriceData;
  averagePrice: number;
  priceVariance: number;
  vendors: PriceData[];
  recommendation: PriceRecommendation;
}

export interface PriceRecommendation {
  action: 'buy-now' | 'wait' | 'monitor';
  reason: string;
  confidence: number;
  predictedDrop?: number;
  nextSalePrediction?: string;
}

// WebSocket connection for real-time updates
class PriceWebSocket {
  private ws: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private subscribers = new Map<string, Set<(data: PriceData) => void>>();

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    try {
      this.ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8001/ws/prices');
      
      this.ws.onopen = () => {
        console.log('Price WebSocket connected');
        this.subscribeToAllProducts();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'price-update') {
            this.notifySubscribers(data.productId, data.priceData);
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('Price WebSocket disconnected');
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) return;
    
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
    }, 5000);
  }

  private subscribeToAllProducts() {
    const productIds = Array.from(this.subscribers.keys());
    if (productIds.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        productIds
      }));
    }
  }

  subscribe(productId: string, callback: (data: PriceData) => void) {
    if (!this.subscribers.has(productId)) {
      this.subscribers.set(productId, new Set());
    }
    this.subscribers.get(productId)!.add(callback);

    // Subscribe to real-time updates if connected
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        productIds: [productId]
      }));
    }
  }

  unsubscribe(productId: string, callback: (data: PriceData) => void) {
    const callbacks = this.subscribers.get(productId);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.subscribers.delete(productId);
        
        // Unsubscribe from real-time updates
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
            type: 'unsubscribe',
            productIds: [productId]
          }));
        }
      }
    }
  }

  private notifySubscribers(productId: string, priceData: PriceData) {
    const callbacks = this.subscribers.get(productId);
    if (callbacks) {
      callbacks.forEach(callback => callback(priceData));
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Global WebSocket instance
const priceWebSocket = new PriceWebSocket();

// Price Comparison Store
interface PriceComparisonStore {
  comparisons: Map<string, PriceComparison>;
  loading: Map<string, boolean>;
  errors: Map<string, Error>;
  
  // Actions
  fetchComparison: (productId: string) => Promise<void>;
  updatePrice: (productId: string, priceData: PriceData) => void;
  clearComparison: (productId: string) => void;
  subscribeToPrice: (productId: string, callback: (data: PriceData) => void) => void;
  unsubscribeFromPrice: (productId: string, callback: (data: PriceData) => void) => void;
}

export const usePriceComparison = create<PriceComparisonStore>((set, get) => ({
  comparisons: new Map(),
  loading: new Map(),
  errors: new Map(),

  fetchComparison: async (productId: string) => {
    // Check cache first
    const cached = globalDataCache.get(`price-comparison-${productId}`) as PriceComparison | null;
    if (cached) {
      set((state) => ({
        comparisons: new Map(state.comparisons).set(productId, cached)
      }));
      return;
    }

    // Set loading state
    set((state) => {
      const newLoading = new Map(state.loading);
      const newErrors = new Map(state.errors);
      newLoading.set(productId, true);
      newErrors.delete(productId);
      return { loading: newLoading, errors: newErrors };
    });

    try {
      const response = await fetch(`/api/comparison/prices/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch price comparison');
      
      const data: PriceComparison = await response.json();
      
      // Cache the result
      globalDataCache.set(`price-comparison-${productId}`, data);
      
      set((state) => ({
        comparisons: new Map(state.comparisons).set(productId, data),
        loading: new Map(state.loading).set(productId, false)
      }));
    } catch (error) {
      set((state) => ({
        errors: new Map(state.errors).set(productId, error as Error),
        loading: new Map(state.loading).set(productId, false)
      }));
    }
  },

  updatePrice: (productId: string, priceData: PriceData) => {
    set((state) => {
      const comparison = state.comparisons.get(productId);
      if (!comparison) return state;

      // Update vendor data
      const vendorIndex = comparison.vendors.findIndex(v => v.vendor === priceData.vendor);
      if (vendorIndex >= 0) {
        comparison.vendors[vendorIndex] = priceData;
      } else {
        comparison.vendors.push(priceData);
      }

      // Recalculate statistics
      const prices = comparison.vendors.map(v => v.totalPrice);
      comparison.lowestPrice = comparison.vendors.reduce((min, v) => 
        v.totalPrice < min.totalPrice ? v : min
      );
      comparison.highestPrice = comparison.vendors.reduce((max, v) => 
        v.totalPrice > max.totalPrice ? v : max
      );
      comparison.averagePrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
      comparison.priceVariance = Math.sqrt(
        prices.reduce((sum, p) => sum + Math.pow(p - comparison.averagePrice, 2), 0) / prices.length
      );

      // Update recommendation based on new data
      comparison.recommendation = calculateRecommendation(comparison);

      return {
        comparisons: new Map(state.comparisons).set(productId, { ...comparison })
      };
    });
  },

  clearComparison: (productId: string) => {
    set((state) => {
      const comparisons = new Map(state.comparisons);
      const loading = new Map(state.loading);
      const errors = new Map(state.errors);
      
      comparisons.delete(productId);
      loading.delete(productId);
      errors.delete(productId);
      
      return { comparisons, loading, errors };
    });
  },

  subscribeToPrice: (productId: string, callback: (data: PriceData) => void) => {
    priceWebSocket.subscribe(productId, callback);
  },

  unsubscribeFromPrice: (productId: string, callback: (data: PriceData) => void) => {
    priceWebSocket.unsubscribe(productId, callback);
  }
}));

// Helper function to calculate price recommendation
function calculateRecommendation(comparison: PriceComparison): PriceRecommendation {
  const { lowestPrice, averagePrice, priceVariance, vendors } = comparison;
  
  // Analyze price history if available
  const priceHistory = lowestPrice.priceHistory || [];
  const recentPrices = priceHistory.slice(-30); // Last 30 days
  
  // Calculate trend
  const trend = calculatePriceTrend(recentPrices);
  
  // Check for seasonal patterns
  const seasonalPattern = detectSeasonalPattern(priceHistory);
  
  // Make recommendation
  if (lowestPrice.totalPrice < averagePrice * 0.8) {
    return {
      action: 'buy-now',
      reason: 'Price is significantly below average',
      confidence: 0.9
    };
  }
  
  if (trend < -0.05 && priceVariance > averagePrice * 0.1) {
    return {
      action: 'wait',
      reason: 'Price is trending downward with high variance',
      confidence: 0.7,
      predictedDrop: averagePrice * 0.1
    };
  }
  
  if (seasonalPattern && seasonalPattern.nextSaleDate) {
    const daysUntilSale = Math.ceil(
      (new Date(seasonalPattern.nextSaleDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysUntilSale < 30) {
      return {
        action: 'wait',
        reason: `Sale expected in ${daysUntilSale} days`,
        confidence: seasonalPattern.confidence,
        nextSalePrediction: seasonalPattern.nextSaleDate
      };
    }
  }
  
  return {
    action: 'monitor',
    reason: 'Price is stable, continue monitoring for better deals',
    confidence: 0.6
  };
}

function calculatePriceTrend(priceHistory: PricePoint[]): number {
  if (priceHistory.length < 2) return 0;
  
  const firstPrice = priceHistory[0].price;
  const lastPrice = priceHistory[priceHistory.length - 1].price;
  
  return (lastPrice - firstPrice) / firstPrice;
}

function detectSeasonalPattern(priceHistory: PricePoint[]): { nextSaleDate: string; confidence: number } | null {
  // Simplified seasonal detection - in production, use more sophisticated algorithms
  const sales = priceHistory.filter(p => p.event === 'sale');
  
  if (sales.length < 3) return null;
  
  // Calculate average time between sales
  const intervals: number[] = [];
  for (let i = 1; i < sales.length; i++) {
    const interval = new Date(sales[i].timestamp).getTime() - new Date(sales[i-1].timestamp).getTime();
    intervals.push(interval);
  }
  
  const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
  const lastSaleDate = new Date(sales[sales.length - 1].timestamp);
  const nextSaleDate = new Date(lastSaleDate.getTime() + avgInterval);
  
  // Calculate confidence based on interval consistency
  const variance = intervals.reduce((sum, i) => sum + Math.pow(i - avgInterval, 2), 0) / intervals.length;
  const stdDev = Math.sqrt(variance);
  const confidence = Math.max(0.5, 1 - (stdDev / avgInterval));
  
  return {
    nextSaleDate: nextSaleDate.toISOString(),
    confidence
  };
}

// Initialize WebSocket connection
if (typeof window !== 'undefined') {
  priceWebSocket.connect();
}

// Cleanup on unmount
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    priceWebSocket.disconnect();
  });
}
