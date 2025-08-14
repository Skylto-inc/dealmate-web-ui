/**
 * Card-Linked Offer Integration Engine
 * Manages bank offers, automatic enrollment, and reward tracking
 * Implements secure data handling and lazy evaluation
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { globalDataCache } from '@/lib/performance/lazy-loader';

// Types
export interface CardDetails {
  id: string;
  lastFourDigits: string;
  bank: string;
  network: 'visa' | 'mastercard' | 'amex' | 'discover';
  type: 'credit' | 'debit';
  nickname?: string;
  isActive: boolean;
  addedAt: string;
}

export interface LinkedOffer {
  id: string;
  cardId: string;
  merchantName: string;
  merchantCategory: string;
  offerType: 'cashback' | 'points' | 'discount' | 'bonus';
  value: number;
  valueType: 'percentage' | 'fixed' | 'multiplier';
  minSpend?: number;
  maxBenefit?: number;
  validFrom: string;
  validUntil: string;
  isActivated: boolean;
  activationDate?: string;
  termsAndConditions: string;
  logo?: string;
}

export interface RewardBalance {
  cardId: string;
  points: number;
  cashback: number;
  tier: string;
  tierProgress: number;
  nextTierThreshold: number;
  expiringPoints?: {
    amount: number;
    expiryDate: string;
  };
}

export interface OfferRecommendation {
  offerId: string;
  reason: string;
  potentialSavings: number;
  requiredSpend?: number;
  confidence: number;
}

// Secure Card Storage (using encryption in production)
class SecureCardStorage {
  private static STORAGE_KEY = 'dealmate-secure-cards';

  static saveCard(card: CardDetails): void {
    const cards = this.getCards();
    cards.push(card);
    // In production, encrypt before storing
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cards));
  }

  static getCards(): CardDetails[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    // In production, decrypt after retrieving
    return JSON.parse(stored);
  }

  static deleteCard(cardId: string): void {
    const cards = this.getCards().filter(c => c.id !== cardId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cards));
  }

  static updateCard(cardId: string, updates: Partial<CardDetails>): void {
    const cards = this.getCards();
    const index = cards.findIndex(c => c.id === cardId);
    if (index >= 0) {
      cards[index] = { ...cards[index], ...updates };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cards));
    }
  }
}

// Offer Activation Engine
class OfferActivationEngine {
  private static activationQueue: Map<string, Promise<boolean>> = new Map();

  static async activateOffer(offerId: string, cardId: string): Promise<boolean> {
    const key = `${offerId}-${cardId}`;
    
    // Check if already activating
    if (this.activationQueue.has(key)) {
      return this.activationQueue.get(key)!;
    }

    const activationPromise = this.performActivation(offerId, cardId);
    this.activationQueue.set(key, activationPromise);

    try {
      const result = await activationPromise;
      return result;
    } finally {
      this.activationQueue.delete(key);
    }
  }

  private static async performActivation(offerId: string, cardId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/card-offers/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId, cardId })
      });

      if (!response.ok) throw new Error('Activation failed');
      
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Offer activation error:', error);
      return false;
    }
  }

  static async activateMultiple(offers: Array<{ offerId: string; cardId: string }>): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();
    
    // Batch activation for efficiency
    const batches = this.createBatches(offers, 5); // 5 parallel activations
    
    for (const batch of batches) {
      const promises = batch.map(({ offerId, cardId }) => 
        this.activateOffer(offerId, cardId).then(success => ({ offerId, success }))
      );
      
      const batchResults = await Promise.all(promises);
      batchResults.forEach(({ offerId, success }) => {
        results.set(offerId, success);
      });
    }
    
    return results;
  }

  private static createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }
}

// Reward Intelligence
class RewardIntelligence {
  static calculateOptimalCard(
    purchaseAmount: number,
    merchant: string,
    category: string,
    cards: CardDetails[],
    offers: LinkedOffer[]
  ): { cardId: string; totalReward: number; breakdown: string[] } | null {
    let bestCard = null;
    let maxReward = 0;
    let bestBreakdown: string[] = [];

    for (const card of cards) {
      if (!card.isActive) continue;

      const cardOffers = offers.filter(o => 
        o.cardId === card.id && 
        o.isActivated &&
        new Date(o.validFrom) <= new Date() &&
        new Date(o.validUntil) >= new Date() &&
        (!o.minSpend || purchaseAmount >= o.minSpend)
      );

      let totalReward = 0;
      const breakdown: string[] = [];

      // Calculate base rewards (assumed 1% default)
      const baseReward = purchaseAmount * 0.01;
      totalReward += baseReward;
      breakdown.push(`Base reward: ${baseReward.toFixed(2)}`);

      // Apply offers
      for (const offer of cardOffers) {
        if (offer.merchantName === merchant || offer.merchantCategory === category) {
          let offerReward = 0;
          
          if (offer.valueType === 'percentage') {
            offerReward = purchaseAmount * (offer.value / 100);
            if (offer.maxBenefit) {
              offerReward = Math.min(offerReward, offer.maxBenefit);
            }
          } else if (offer.valueType === 'fixed') {
            offerReward = offer.value;
          } else if (offer.valueType === 'multiplier') {
            offerReward = baseReward * (offer.value - 1); // Additional reward
          }

          totalReward += offerReward;
          breakdown.push(`${offer.merchantName} offer: ${offerReward.toFixed(2)}`);
        }
      }

      if (totalReward > maxReward) {
        maxReward = totalReward;
        bestCard = card;
        bestBreakdown = breakdown;
      }
    }

    return bestCard ? {
      cardId: bestCard.id,
      totalReward: maxReward,
      breakdown: bestBreakdown
    } : null;
  }

  static predictNextTierBenefit(
    balance: RewardBalance,
    monthlySpend: number
  ): { monthsToNextTier: number; additionalBenefits: string[] } {
    const pointsNeeded = balance.nextTierThreshold - balance.tierProgress;
    const monthlyPoints = monthlySpend * 0.01; // Assuming 1 point per dollar
    const monthsToNextTier = Math.ceil(pointsNeeded / monthlyPoints);

    // Simulated tier benefits
    const tierBenefits: Record<string, string[]> = {
      'silver': ['2x points on dining', '1.5x points on gas'],
      'gold': ['3x points on dining', '2x points on gas', 'Free airport lounge access'],
      'platinum': ['4x points on dining', '3x points on gas', 'Free hotel night annually']
    };

    const nextTier = this.getNextTier(balance.tier);
    const additionalBenefits = tierBenefits[nextTier] || [];

    return { monthsToNextTier, additionalBenefits };
  }

  private static getNextTier(currentTier: string): string {
    const tiers = ['bronze', 'silver', 'gold', 'platinum'];
    const currentIndex = tiers.indexOf(currentTier.toLowerCase());
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : 'platinum';
  }
}

// Card-Linked Offer Store
interface CardLinkedStore {
  cards: CardDetails[];
  offers: Map<string, LinkedOffer[]>;
  rewards: Map<string, RewardBalance>;
  recommendations: OfferRecommendation[];
  loading: boolean;
  error: Error | null;

  // Actions
  addCard: (card: Omit<CardDetails, 'id' | 'addedAt'>) => void;
  removeCard: (cardId: string) => void;
  fetchOffers: (cardId: string) => Promise<void>;
  activateOffer: (offerId: string, cardId: string) => Promise<boolean>;
  fetchRewardBalance: (cardId: string) => Promise<void>;
  calculateBestCard: (amount: number, merchant: string, category: string) => any;
  syncAllOffers: () => Promise<void>;
  generateRecommendations: (offers: LinkedOffer[]) => OfferRecommendation[];
}

export const useCardLinkedOffers = create<CardLinkedStore>()(
  persist(
    (set, get) => ({
      cards: SecureCardStorage.getCards(),
      offers: new Map(),
      rewards: new Map(),
      recommendations: [],
      loading: false,
      error: null,

      addCard: (cardData) => {
        const card: CardDetails = {
          ...cardData,
          id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          addedAt: new Date().toISOString()
        };
        
        SecureCardStorage.saveCard(card);
        set((state) => ({ cards: [...state.cards, card] }));
        
        // Fetch offers for new card
        get().fetchOffers(card.id);
      },

      removeCard: (cardId) => {
        SecureCardStorage.deleteCard(cardId);
        set((state) => ({
          cards: state.cards.filter(c => c.id !== cardId),
          offers: new Map(Array.from(state.offers.entries()).filter(([id]) => id !== cardId)),
          rewards: new Map(Array.from(state.rewards.entries()).filter(([id]) => id !== cardId))
        }));
      },

      fetchOffers: async (cardId) => {
        const cached = globalDataCache.get(`card-offers-${cardId}`) as LinkedOffer[] | null;
        if (cached) {
          set((state) => ({
            offers: new Map(state.offers).set(cardId, cached)
          }));
          return;
        }

        set({ loading: true, error: null });

        try {
          const response = await fetch(`/api/card-offers/${cardId}`);
          if (!response.ok) throw new Error('Failed to fetch offers');
          
          const offers: LinkedOffer[] = await response.json();
          
          globalDataCache.set(`card-offers-${cardId}`, offers);
          
          set((state) => ({
            offers: new Map(state.offers).set(cardId, offers),
            loading: false
          }));

          // Generate recommendations
          const recommendations = get().generateRecommendations(offers);
          set({ recommendations });
        } catch (error) {
          set({ error: error as Error, loading: false });
        }
      },

      activateOffer: async (offerId, cardId) => {
        const success = await OfferActivationEngine.activateOffer(offerId, cardId);
        
        if (success) {
          set((state) => {
            const offers = state.offers.get(cardId) || [];
            const updatedOffers = offers.map(o => 
              o.id === offerId 
                ? { ...o, isActivated: true, activationDate: new Date().toISOString() }
                : o
            );
            
            return {
              offers: new Map(state.offers).set(cardId, updatedOffers)
            };
          });
        }
        
        return success;
      },

      fetchRewardBalance: async (cardId) => {
        set({ loading: true });

        try {
          const response = await fetch(`/api/rewards/balance/${cardId}`);
          if (!response.ok) throw new Error('Failed to fetch reward balance');
          
          const balance: RewardBalance = await response.json();
          
          set((state) => ({
            rewards: new Map(state.rewards).set(cardId, balance),
            loading: false
          }));
        } catch (error) {
          set({ error: error as Error, loading: false });
        }
      },

      calculateBestCard: (amount, merchant, category) => {
        const { cards, offers } = get();
        const allOffers = Array.from(offers.values()).flat();
        
        return RewardIntelligence.calculateOptimalCard(
          amount,
          merchant,
          category,
          cards,
          allOffers
        );
      },

      syncAllOffers: async () => {
        const { cards } = get();
        set({ loading: true });

        try {
          await Promise.all(cards.map(card => get().fetchOffers(card.id)));
          set({ loading: false });
        } catch (error) {
          set({ error: error as Error, loading: false });
        }
      },

      generateRecommendations: (newOffers: LinkedOffer[]) => {
        const recommendations: OfferRecommendation[] = [];
        
        // High-value offers
        const highValueOffers = newOffers.filter(o => 
          !o.isActivated && 
          ((o.valueType === 'percentage' && o.value >= 10) ||
           (o.valueType === 'fixed' && o.value >= 50))
        );

        highValueOffers.forEach(offer => {
          recommendations.push({
            offerId: offer.id,
            reason: `High value ${offer.offerType}: ${offer.value}${offer.valueType === 'percentage' ? '%' : ''}`,
            potentialSavings: offer.valueType === 'percentage' ? 100 * (offer.value / 100) : offer.value,
            requiredSpend: offer.minSpend,
            confidence: 0.9
          });
        });

        // Expiring soon
        const expiringOffers = newOffers.filter(o => {
          const daysUntilExpiry = Math.ceil(
            (new Date(o.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );
          return !o.isActivated && daysUntilExpiry <= 7;
        });

        expiringOffers.forEach(offer => {
          recommendations.push({
            offerId: offer.id,
            reason: 'Expiring soon - activate before it\'s too late',
            potentialSavings: offer.valueType === 'percentage' ? 50 * (offer.value / 100) : offer.value,
            requiredSpend: offer.minSpend,
            confidence: 0.8
          });
        });

        return recommendations.slice(0, 5); // Top 5 recommendations
      }
    }),
    {
      name: 'dealmate-card-linked-offers',
      partialize: (state) => ({ cards: state.cards })
    }
  )
);

// Utility functions
export function maskCardNumber(lastFour: string): string {
  return `•••• •••• •••• ${lastFour}`;
}

export function getCardNetworkIcon(network: string): string {
  const icons: Record<string, string> = {
    visa: '💳',
    mastercard: '💳',
    amex: '💳',
    discover: '💳'
  };
  return icons[network] || '💳';
}

export function formatRewardValue(value: number, type: string): string {
  if (type === 'points') {
    return `${value.toLocaleString()} points`;
  } else if (type === 'cashback') {
    return `₹${value.toFixed(2)}`;
  }
  return value.toString();
}
