export interface UserCard {
  id: string;
  userId: string;
  name: string;
  bank: string;
  cardType: string;
  last4Digits?: string;
  rewards_per_rupee?: number;
  reward_value_inr?: number;
  current_points?: number;
  next_reward_threshold?: number;
  next_reward_value?: number;
}

export interface LoyaltyProgram {
  id: string;
  userId: string;
  programName: string;
  currentPoints: number;
  pointValueInRupees: number;
  nextTier?: string;
  pointsToNextTier?: number;
}

export interface UserRewardGoal {
  id: string;
  userId: string;
  description: string;
  targetType: string;
  targetValue: number;
  cardIdRef?: string;
  loyaltyProgramIdRef?: string;
  isActive: boolean;
}

export interface Offer {
  id: string;
  description: string;
  value: string;
  type: 'coupon' | 'cashback' | 'reward';
  productName: string;
  basePrice: number;
  platform: string;
  productUrl: string;
  couponValue?: number;
  cashbackPercentage?: number;
  cardSpecificBonusPercentage?: number;
  requiredCardType?: string;
  productImageUrl: string;
  cashbackFlat?: number;
  cardSpecificBonusFlat?: number;
}

export interface RankedOffer extends Offer {
  rank: number;
  rankingExplanation: string[];
  tags?: string[];
  effectivePrice: number;
  productImageUrl: string;
  productName: string;
  compositeScore: number;
  platform: string;
  basePrice: number;
  finalPrice: number;
  totalCashbackValue: number;
  cardBonusValue: number;
  achievedPerkDescription?: string;
  totalDiscountValue: number;
  potentialPerkValue: number;
  productUrl: string;
}

export interface UserPointsState {
  cards: UserCard[];
  loyaltyPrograms: LoyaltyProgram[];
  rewardGoals: UserRewardGoal[];
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}
