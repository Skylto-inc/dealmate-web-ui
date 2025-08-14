export interface CardVault {
  id: string;
  userId: string;
  
  // Card identification
  bankName: string;
  cardType: string;
  cardNetwork?: string;
  lastFourDigits?: string;
  nickname?: string;
  
  // Reward structure
  baseRewardRate: number;
  rewardType: 'points' | 'cashback' | 'miles';
  pointValueInr: number;
  
  // Category-specific rewards
  categoryRewards: Record<string, number>;
  
  // Milestone rewards
  currentPoints: number;
  pointsExpiryDate?: string;
  milestoneConfig: MilestoneConfig[];
  
  // Card features
  features: CardFeatures;
  annualFee: number;
  feeWaiverCriteria?: string;
  
  // Bank-specific offers
  bankOffers: BankOffer[];
  
  // Status
  isActive: boolean;
  isPrimary: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface MilestoneConfig {
  threshold: number;
  rewardValue: number;
  description?: string;
}

export interface CardFeatures {
  loungeAccess?: boolean;
  fuelSurchargeWaiver?: boolean;
  golfAccess?: boolean;
  concierge?: boolean;
  insuranceCover?: boolean;
  noForexMarkup?: boolean;
  [key: string]: boolean | undefined;
}

export interface BankOffer {
  merchant: string;
  discount: number;
  maxDiscount?: number;
  minTransaction?: number;
  validTill: string;
  description?: string;
}

export interface CreateCardRequest {
  bankName: string;
  cardType: string;
  cardNetwork?: string;
  lastFourDigits?: string;
  nickname?: string;
  
  baseRewardRate?: number;
  rewardType?: 'points' | 'cashback' | 'miles';
  pointValueInr?: number;
  
  categoryRewards?: Record<string, number>;
  currentPoints?: number;
  milestoneConfig?: MilestoneConfig[];
  
  features?: CardFeatures;
  annualFee?: number;
  feeWaiverCriteria?: string;
}

export interface UpdateCardRequest {
  nickname?: string;
  currentPoints?: number;
  isPrimary?: boolean;
  isActive?: boolean;
  categoryRewards?: Record<string, number>;
  milestoneConfig?: MilestoneConfig[];
  bankOffers?: BankOffer[];
}

export interface CardTemplate {
  bankName: string;
  cardType: string;
  cardNetwork: string;
  baseRewardRate: number;
  rewardType: 'points' | 'cashback' | 'miles';
  pointValueInr: number;
  categoryRewards: Record<string, number>;
  features: CardFeatures;
  annualFee: number;
  feeWaiverCriteria?: string;
}

export interface CardDealAnalysis {
  cardId: string;
  cardName: string;
  bankName: string;
  
  // Benefits breakdown
  baseReward: number;
  categoryBonus: number;
  bankOfferDiscount: number;
  totalBenefit: number;
  
  // Final calculation
  effectivePrice: number;
  totalSavings: number;
  savingsPercentage: number;
  
  // Additional perks
  pointsEarned: number;
  pointsValueInr: number;
  milestoneProgress?: MilestoneProgress;
  
  // Ranking score
  score: number;
}

export interface MilestoneProgress {
  currentPoints: number;
  pointsAfterPurchase: number;
  nextMilestone: number;
  milestoneValue: number;
  pointsToMilestone: number;
}

export interface DealRankingRequest {
  dealId: string;
  merchantName: string;
  category: string;
  originalPrice: number;
  dealDiscount: number;
}

export interface DealRankingResponse {
  dealId: string;
  rankings: CardDealAnalysis[];
}

// Helper functions
export function calculateEffectiveRewardRate(card: CardVault, category?: string): number {
  if (category && card.categoryRewards[category]) {
    return card.categoryRewards[category];
  }
  return card.baseRewardRate;
}

export function formatCardName(card: CardVault): string {
  return card.nickname || `${card.bankName} ${card.cardType}`;
}

export function getCardDisplayName(card: CardVault): string {
  const suffix = card.lastFourDigits ? ` ••${card.lastFourDigits}` : '';
  return formatCardName(card) + suffix;
}
