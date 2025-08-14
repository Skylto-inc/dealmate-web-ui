import { z } from 'genkit';

// Zod Schemas for nested types in UserPointsState (if not already global)
const ZodUserCardSchema = z.object({
  id: z.string(),
  userId: z.string(),
  bank: z.string(),
  cardType: z.string(),
  last4Digits: z.string().optional(),
  rewards_per_rupee: z.number().optional(),
  reward_value_inr: z.number().optional(),
  current_points: z.number().optional(),
  next_reward_threshold: z.number().optional(),
  next_reward_value: z.number().optional(),
});

const ZodLoyaltyProgramSchema = z.object({
  id: z.string(),
  userId: z.string(),
  programName: z.string(),
  currentPoints: z.number(),
  pointValueInRupees: z.number().optional(),
  nextTier: z.string().optional(),
  pointsToNextTier: z.number().optional(),
  nextTierBenefits: z.string().optional(),
});

const ZodUserRewardGoalSchema = z.object({
  id: z.string(),
  userId: z.string(),
  description: z.string(),
  targetType: z.enum(['monetary_savings_monthly', 'points_milestone_card', 'points_milestone_program']),
  targetValue: z.number(),
  cardIdRef: z.string().optional(),
  loyaltyProgramIdRef: z.string().optional(),
  isActive: z.boolean(),
});


const ZodUserPointsStateSchema = z.object({
    cards: z.array(ZodUserCardSchema).optional(),
    loyaltyPrograms: z.array(ZodLoyaltyProgramSchema).optional(),
    rewardGoals: z.array(ZodUserRewardGoalSchema).optional(),
}).optional();


const ZodRankedOfferSchema = z.object({
  id: z.string(),
  productName: z.string(),
  platform: z.string(),
  basePrice: z.number(),
  finalPrice: z.number(), 
  effectivePrice: z.number(), 
  totalDiscountValue: z.number(),
  totalCashbackValue: z.number(),
  cardBonusValue: z.number(),
  potentialPerkValue: z.number(),
  goalContributionScore: z.number(),
  compositeScore: z.number(),
  rankingExplanation: z.array(z.string()),
  achievedPerkDescription: z.string().optional(),
  productUrl: z.string(),
  couponValue: z.number().optional(),
  cashbackPercentage: z.number().optional(),
  cashbackFlat: z.number().optional(),
  tags: z.array(z.string()).optional(),
});


export const ExplainDealRankInputSchema = z.object({
  offer: ZodRankedOfferSchema.describe("The ranked offer details for which an explanation is sought."),
  userContext: ZodUserPointsStateSchema.describe("Optional: The user's current financial context like cards, loyalty points, and goals which influenced the ranking."),
});
export type ExplainDealRankInput = z.infer<typeof ExplainDealRankInputSchema>;

export const ExplainDealRankOutputSchema = z.object({
  explanation: z.string().describe('The AI-generated explanation for the deal ranking.'),
});
export type ExplainDealRankOutput = z.infer<typeof ExplainDealRankOutputSchema>;
