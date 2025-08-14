/**
 * StackSmart Optimization Engine
 * Advanced algorithms for finding optimal deal combinations
 * Uses dynamic programming and lazy evaluation for performance
 */

import { create } from 'zustand';
import { globalDataCache } from '@/lib/performance/lazy-loader';

// Types
export interface Deal {
  id: string;
  type: 'coupon' | 'cashback' | 'points' | 'discount' | 'gift-card';
  code?: string;
  value: number;
  valueType: 'percentage' | 'fixed';
  minPurchase?: number;
  maxDiscount?: number;
  category?: string[];
  excludes?: string[];
  stackable: boolean;
  stacksWith?: string[]; // Deal types it can stack with
  priority: number; // Higher priority applied first
  expiresAt?: string;
}

export interface StackResult {
  deals: Deal[];
  totalSavings: number;
  finalPrice: number;
  breakdown: StackBreakdown[];
  warnings?: string[];
  alternativeStacks?: StackResult[];
}

export interface StackBreakdown {
  dealId: string;
  dealName: string;
  savings: number;
  priceAfter: number;
  applied: boolean;
  reason?: string;
}

export interface OptimizationConstraints {
  maxDeals?: number;
  preferredTypes?: Deal['type'][];
  excludeTypes?: Deal['type'][];
  minSavings?: number;
  timeLimit?: number; // milliseconds
}

// Optimization algorithms
class StackOptimizer {
  private memoCache = new Map<string, StackResult>();

  /**
   * Main optimization function using dynamic programming
   */
  optimize(
    basePrice: number,
    availableDeals: Deal[],
    constraints: OptimizationConstraints = {}
  ): StackResult {
    const cacheKey = this.getCacheKey(basePrice, availableDeals, constraints);
    const cached = this.memoCache.get(cacheKey);
    if (cached) return cached;

    const startTime = Date.now();
    const timeLimit = constraints.timeLimit || 1000; // 1 second default

    // Sort deals by priority and value
    const sortedDeals = this.sortDeals(availableDeals, basePrice);
    
    // Filter based on constraints
    const filteredDeals = this.applyConstraints(sortedDeals, constraints);
    
    // Use branch and bound for optimal combination
    const result = this.branchAndBound(
      basePrice,
      filteredDeals,
      constraints.maxDeals || 5,
      startTime,
      timeLimit
    );

    // Find alternative stacks
    if (result.totalSavings > 0) {
      result.alternativeStacks = this.findAlternatives(
        basePrice,
        filteredDeals,
        result,
        3 // Max 3 alternatives
      );
    }

    this.memoCache.set(cacheKey, result);
    return result;
  }

  /**
   * Branch and bound algorithm for finding optimal deal combination
   */
  private branchAndBound(
    basePrice: number,
    deals: Deal[],
    maxDeals: number,
    startTime: number,
    timeLimit: number
  ): StackResult {
    let bestResult: StackResult = {
      deals: [],
      totalSavings: 0,
      finalPrice: basePrice,
      breakdown: []
    };

    const stack: Array<{
      index: number;
      currentDeals: Deal[];
      currentPrice: number;
      bound: number;
    }> = [{
      index: 0,
      currentDeals: [],
      currentPrice: basePrice,
      bound: this.calculateBound(basePrice, deals, 0)
    }];

    while (stack.length > 0 && Date.now() - startTime < timeLimit) {
      const node = stack.pop()!;

      // Prune if bound is worse than current best
      if (node.bound <= bestResult.totalSavings) continue;

      // Try including current deal
      if (node.index < deals.length && node.currentDeals.length < maxDeals) {
        const deal = deals[node.index];
        const canStack = this.canStackDeal(deal, node.currentDeals);

        if (canStack) {
          const newPrice = this.applyDeal(node.currentPrice, deal, basePrice);
          const newDeals = [...node.currentDeals, deal];
          const savings = basePrice - newPrice;

          // Update best if better
          if (savings > bestResult.totalSavings) {
            bestResult = {
              deals: newDeals,
              totalSavings: savings,
              finalPrice: newPrice,
              breakdown: this.generateBreakdown(basePrice, newDeals)
            };
          }

          // Add to stack for further exploration
          if (node.index + 1 < deals.length) {
            stack.push({
              index: node.index + 1,
              currentDeals: newDeals,
              currentPrice: newPrice,
              bound: this.calculateBound(newPrice, deals, node.index + 1)
            });
          }
        }
      }

      // Try not including current deal
      if (node.index + 1 < deals.length) {
        stack.push({
          index: node.index + 1,
          currentDeals: node.currentDeals,
          currentPrice: node.currentPrice,
          bound: node.bound
        });
      }
    }

    // Add warnings if time limit reached
    if (Date.now() - startTime >= timeLimit) {
      bestResult.warnings = ['Optimization time limit reached. Result may not be optimal.'];
    }

    return bestResult;
  }

  /**
   * Calculate upper bound for remaining savings
   */
  private calculateBound(currentPrice: number, deals: Deal[], startIndex: number): number {
    let bound = 0;
    let price = currentPrice;

    for (let i = startIndex; i < deals.length; i++) {
      const potential = this.calculateDealValue(price, deals[i], currentPrice);
      bound += potential;
      price -= potential;
      if (price <= 0) break;
    }

    return bound;
  }

  /**
   * Check if a deal can be stacked with existing deals
   */
  private canStackDeal(deal: Deal, existingDeals: Deal[]): boolean {
    if (!deal.stackable && existingDeals.length > 0) return false;

    for (const existing of existingDeals) {
      if (!existing.stackable) return false;

      // Check specific stacking rules
      if (existing.stacksWith && !existing.stacksWith.includes(deal.type)) {
        return false;
      }
      if (deal.stacksWith && !deal.stacksWith.includes(existing.type)) {
        return false;
      }

      // Don't stack same type unless explicitly allowed
      if (existing.type === deal.type && !this.canStackSameType(deal.type)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Apply a deal to the current price
   */
  private applyDeal(currentPrice: number, deal: Deal, basePrice: number): number {
    if (deal.minPurchase && currentPrice < deal.minPurchase) {
      return currentPrice;
    }

    let discount = 0;
    if (deal.valueType === 'percentage') {
      // Percentage discounts apply to current price
      discount = currentPrice * (deal.value / 100);
      if (deal.maxDiscount) {
        discount = Math.min(discount, deal.maxDiscount);
      }
    } else {
      // Fixed discounts
      discount = deal.value;
    }

    return Math.max(0, currentPrice - discount);
  }

  /**
   * Calculate the value of a deal
   */
  private calculateDealValue(currentPrice: number, deal: Deal, basePrice: number): number {
    const newPrice = this.applyDeal(currentPrice, deal, basePrice);
    return currentPrice - newPrice;
  }

  /**
   * Generate breakdown of how deals were applied
   */
  private generateBreakdown(basePrice: number, deals: Deal[]): StackBreakdown[] {
    const breakdown: StackBreakdown[] = [];
    let currentPrice = basePrice;

    for (const deal of deals) {
      const newPrice = this.applyDeal(currentPrice, deal, basePrice);
      const savings = currentPrice - newPrice;

      breakdown.push({
        dealId: deal.id,
        dealName: deal.code || `${deal.type} - ${deal.value}${deal.valueType === 'percentage' ? '%' : ''}`,
        savings,
        priceAfter: newPrice,
        applied: savings > 0,
        reason: savings === 0 ? 'Minimum purchase not met or no additional savings' : undefined
      });

      currentPrice = newPrice;
    }

    return breakdown;
  }

  /**
   * Find alternative stacking combinations
   */
  private findAlternatives(
    basePrice: number,
    deals: Deal[],
    bestResult: StackResult,
    maxAlternatives: number
  ): StackResult[] {
    const alternatives: StackResult[] = [];
    const usedCombinations = new Set<string>();
    usedCombinations.add(this.getDealComboKey(bestResult.deals));

    // Try different starting deals
    for (let i = 0; i < Math.min(deals.length, 5); i++) {
      const reorderedDeals = [...deals.slice(i), ...deals.slice(0, i)];
      const altResult = this.branchAndBound(basePrice, reorderedDeals, 5, Date.now(), 500);

      const comboKey = this.getDealComboKey(altResult.deals);
      if (!usedCombinations.has(comboKey) && altResult.totalSavings > 0) {
        alternatives.push(altResult);
        usedCombinations.add(comboKey);

        if (alternatives.length >= maxAlternatives) break;
      }
    }

    return alternatives.sort((a, b) => b.totalSavings - a.totalSavings);
  }

  /**
   * Sort deals by priority and potential value
   */
  private sortDeals(deals: Deal[], basePrice: number): Deal[] {
    return deals.sort((a, b) => {
      // First by priority
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }

      // Then by potential value
      const aValue = this.calculateDealValue(basePrice, a, basePrice);
      const bValue = this.calculateDealValue(basePrice, b, basePrice);
      return bValue - aValue;
    });
  }

  /**
   * Apply user constraints to filter deals
   */
  private applyConstraints(deals: Deal[], constraints: OptimizationConstraints): Deal[] {
    let filtered = deals;

    if (constraints.preferredTypes?.length) {
      filtered = filtered.filter(d => constraints.preferredTypes!.includes(d.type));
    }

    if (constraints.excludeTypes?.length) {
      filtered = filtered.filter(d => !constraints.excludeTypes!.includes(d.type));
    }

    return filtered;
  }

  /**
   * Check if same type deals can stack
   */
  private canStackSameType(type: Deal['type']): boolean {
    // Generally, only certain types can stack with themselves
    return ['cashback', 'points'].includes(type);
  }

  /**
   * Generate cache key for memoization
   */
  private getCacheKey(
    basePrice: number,
    deals: Deal[],
    constraints: OptimizationConstraints
  ): string {
    const dealIds = deals.map(d => d.id).sort().join(',');
    const constraintKey = JSON.stringify(constraints);
    return `${basePrice}-${dealIds}-${constraintKey}`;
  }

  /**
   * Generate combination key for tracking unique combinations
   */
  private getDealComboKey(deals: Deal[]): string {
    return deals.map(d => d.id).sort().join('-');
  }
}

// Global optimizer instance
const stackOptimizer = new StackOptimizer();

// StackSmart Store
interface StackSmartStore {
  optimizations: Map<string, StackResult>;
  loading: boolean;
  error: Error | null;

  // Actions
  optimizeStack: (
    productId: string,
    basePrice: number,
    availableDeals: Deal[],
    constraints?: OptimizationConstraints
  ) => StackResult;
  clearOptimization: (productId: string) => void;
  clearAll: () => void;
}

export const useStackSmart = create<StackSmartStore>((set, get) => ({
  optimizations: new Map(),
  loading: false,
  error: null,

  optimizeStack: (productId, basePrice, availableDeals, constraints) => {
    // Check cache first
    const cached = globalDataCache.get(`stack-optimization-${productId}`) as StackResult | null;
    if (cached) {
      set((state) => ({
        optimizations: new Map(state.optimizations).set(productId, cached)
      }));
      return cached;
    }

    set({ loading: true, error: null });

    try {
      const result = stackOptimizer.optimize(basePrice, availableDeals, constraints);
      
      // Cache the result
      globalDataCache.set(`stack-optimization-${productId}`, result);
      
      set((state) => ({
        optimizations: new Map(state.optimizations).set(productId, result),
        loading: false
      }));

      return result;
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },

  clearOptimization: (productId) => {
    set((state) => {
      const optimizations = new Map(state.optimizations);
      optimizations.delete(productId);
      return { optimizations };
    });
  },

  clearAll: () => {
    set({ optimizations: new Map(), error: null });
  }
}));

// Utility functions for common use cases
export function findBestCouponStack(
  basePrice: number,
  coupons: Array<{ code: string; discount: number; type: 'percentage' | 'fixed' }>
): StackResult {
  const deals: Deal[] = coupons.map((c, index) => ({
    id: `coupon-${index}`,
    type: 'coupon',
    code: c.code,
    value: c.discount,
    valueType: c.type,
    stackable: true,
    priority: c.type === 'percentage' ? 2 : 1
  }));

  return stackOptimizer.optimize(basePrice, deals);
}

export function combineWithCashback(
  stackResult: StackResult,
  cashbackOffers: Array<{ bank: string; percentage: number; maxCashback?: number }>
): StackResult {
  const cashbackDeals: Deal[] = cashbackOffers.map((cb, index) => ({
    id: `cashback-${index}`,
    type: 'cashback',
    value: cb.percentage,
    valueType: 'percentage',
    maxDiscount: cb.maxCashback,
    stackable: true,
    priority: 3
  }));

  const allDeals = [...stackResult.deals, ...cashbackDeals];
  return stackOptimizer.optimize(stackResult.finalPrice, allDeals);
}
