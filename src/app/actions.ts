'use server';

import { askDealBot, type AskDealBotInput, type AskDealBotOutput } from '@/ai/flows/ask-deal-bot';
import { explainDealRank } from '@/ai/flows/explain-deal-rank-flow';
import { ExplainDealRankInputSchema, type ExplainDealRankInput, type ExplainDealRankOutput } from '@/ai/flows/explain-deal-rank-flow.schemas';
import { z } from 'zod';
import type { Offer, RankedOffer, UserCard, UserPointsState, LoyaltyProgram, UserRewardGoal } from '@/lib/types';
import { calculateRankedOffers } from '@/lib/offer-ranking';
import { fetchUserCards, fetchLoyaltyPrograms, fetchUserRewardGoals } from '@/lib/api';

// Mock database - in a real app, this would be Firestore or another DB
let mockUserCards: UserCard[] = [
  { id: 'card1', userId: 'mockUserId', name: 'HDFC Infinia', bank: 'HDFC', cardType: 'Infinia', last4Digits: '1234', rewards_per_rupee: 0.165, reward_value_inr: 1, current_points: 25000, next_reward_threshold: 30000, next_reward_value: 2500 }, // Approx 3.3% * 5 RP/100Rs, 1RP=1Rs on smartbuy for some cats
  { id: 'card2', userId: 'mockUserId', name: 'Axis Magnus', bank: 'Axis', cardType: 'Magnus', last4Digits: '5678', rewards_per_rupee: 0.048 , reward_value_inr: 1, current_points: 120000, next_reward_threshold: 100000, next_reward_value: 10000 }, // Approx 12 points per 200, 1 point = 0.2 INR (simplified to 4.8% value)
  { id: 'card3', userId: 'mockUserId', name: 'SBI Cashback', bank: 'SBI', cardType: 'Cashback', last4Digits: '9012', rewards_per_rupee: 0.05, reward_value_inr: 1 }, // Direct 5% cashback
];
const mockLoyaltyPrograms: LoyaltyProgram[] = [
    { id: 'lp1', userId: 'mockUserId', programName: 'Flipkart SuperCoins', currentPoints: 350, pointValueInRupees: 1},
    { id: 'lp2', userId: 'mockUserId', programName: 'Amazon Pay Rewards', currentPoints: 150, pointValueInRupees: 1},
];
let mockUserRewardGoals: UserRewardGoal[] = [
    { id: 'goal1', userId: 'mockUserId', description: 'Maximize HDFC Infinia Flight Vouchers', targetType: 'points_milestone_card', targetValue: 30000, cardIdRef: 'card1', isActive: true },
    { id: 'goal2', userId: 'mockUserId', description: 'Save ₹2000 this month on electronics', targetType: 'monetary_savings_monthly', targetValue: 2000, isActive: true },
];


const AskDealBotActionInputSchema = z.object({
  query: z.string().min(5, "Query must be at least 5 characters long."),
});

export async function handleAskDealBot(formData: FormData): Promise<{ data: AskDealBotOutput | null; error: string | null }> {
  const rawInput = {
    query: formData.get('query'),
  };

  const validationResult = AskDealBotActionInputSchema.safeParse(rawInput);

  if (!validationResult.success) {
    return { data: null, error: validationResult.error.errors.map(e => e.message).join(', ') };
  }

  const input: AskDealBotInput = validationResult.data;

  try {
    const result = await askDealBot(input);
    return { data: result, error: null };
  } catch (e) {
    console.error("Error calling askDealBot:", e);
    const errorMessage = e instanceof Error ? `AI Assistant Error: ${e.message}` : "An unknown error occurred with the AI assistant.";
    return { data: null, error: errorMessage };
  }
}

export async function handleGetRankedOffers(
  offers: Offer[], 
  userPointsState: UserPointsState
): Promise<{ data: RankedOffer[] | null; error: string | null }> {
  try {
    if (!offers || offers.length === 0) {
      return { data: [], error: null }; 
    }
    if (!userPointsState) {
        return { data: null, error: "User financial profile not available." };
    }

    const rankedOffers = calculateRankedOffers(offers, userPointsState);
    return { data: rankedOffers, error: null };
  } catch (e) {
    console.error("Error ranking offers:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred while ranking offers.";
    return { data: null, error: errorMessage };
  }
}

export async function handleGetUserPointsState(): Promise<{ data: UserPointsState | null; error: string | null }> {
    try {
        const userPointsState: UserPointsState = {
            cards: mockUserCards.filter(card => card.userId === 'mockUserId'), 
            loyaltyPrograms: mockLoyaltyPrograms.filter(lp => lp.userId === 'mockUserId'),
            rewardGoals: mockUserRewardGoals.filter(goal => goal.userId === 'mockUserId'),
        };
        return { data: userPointsState, error: null };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Failed to get user financial profile.";
        return { data: null, error: errorMessage };
    }
}

const UserCardActionSchema = z.object({
  userId: z.string(),
  bank: z.string().min(2, "Bank name is too short."),
  cardType: z.string().min(2, "Card type/name is too short."),
  last4Digits: z.string().length(4, "Must be 4 digits.").optional().or(z.literal('')),
  rewards_per_rupee: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  reward_value_inr: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  current_points: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().int("Must be a whole number.").min(0).optional()
  ),
  next_reward_threshold: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().int("Must be a whole number.").min(0).optional()
  ),
  next_reward_value: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
});

export async function handleGetUserCards(): Promise<{ data: UserCard[] | null; error: string | null }> {
  try {
    return { data: mockUserCards.filter(card => card.userId === 'mockUserId'), error: null };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Failed to get user cards.";
    return { data: null, error: errorMessage };
  }
}

export async function handleAddUserCard(formData: FormData): Promise<{ data: UserCard | null; error: string | null }> {
  const rawData = Object.fromEntries(formData.entries());
  const parsedData = {
    ...rawData,
    userId: 'mockUserId', // Replace with actual authenticated user ID
    // Zod preprocessors will handle string to number conversion for optional fields
  };

  const validation = UserCardActionSchema.safeParse(parsedData);

  if (!validation.success) {
    return { data: null, error: validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') };
  }
  try {
    const newCard: UserCard = {
        ...validation.data,
        id: `card${Date.now()}`,
        name: validation.data.cardType,
        last4Digits: validation.data.last4Digits || undefined, // ensure empty string becomes undefined
    };
    mockUserCards.push(newCard);
    return { data: newCard, error: null };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Failed to add card.";
    return { data: null, error: errorMessage };
  }
}

export async function handleRemoveUserCard(formData: FormData): Promise<{ success: boolean; error: string | null }> {
  const cardId = formData.get('cardId') as string;
  if (!cardId) return { success: false, error: "Card ID is required." };

  try {
    const initialLength = mockUserCards.length;
    mockUserCards = mockUserCards.filter(card => card.id !== cardId && card.userId === 'mockUserId');
    if (mockUserCards.length < initialLength) {
        return { success: true, error: null };
    }
    return { success: false, error: "Card not found or not authorized to remove." };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Failed to remove card.";
    return { success: false, error: errorMessage };
  }
}

const ExplainDealRankActionInputSchema = ExplainDealRankInputSchema;

export async function handleExplainDealRank(formData: FormData): Promise<{ data: ExplainDealRankOutput | null; error: string | null }> {
  const rawInput = {
    offerDetails: formData.get('offerDetails'),
    userContext: formData.get('userContext') // Get user context from form data
  };

  const validationResult = ExplainDealRankActionInputSchema.safeParse(rawInput);

  if (!validationResult.success) {
    return { data: null, error: validationResult.error.errors.map(e => e.message).join(', ') };
  }
  
  const input: ExplainDealRankInput = {
    offer: validationResult.data.offer,
    userContext: validationResult.data.userContext,
  };

  try {
    const result = await explainDealRank(input);
    return { data: result, error: null };
  } catch (e) {
    console.error("Error calling explainDealRank:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred with the AI explanation.";
    return { data: null, error: errorMessage };
  }
}


// User Reward Goals Actions
const UserRewardGoalActionSchema = z.object({
    userId: z.string(),
    description: z.string().min(5, "Goal description is too short."),
    targetType: z.enum(['monetary_savings_monthly', 'points_milestone_card', 'points_milestone_program']),
    targetValue: z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? 0 : Number(val)),
        z.number().min(1, "Target value must be positive.")
    ),
    cardIdRef: z.string().optional(),
    loyaltyProgramIdRef: z.string().optional(),
    isActive: z.boolean().default(true),
});

export async function handleAddUserRewardGoal(formData: FormData): Promise<{ data: UserRewardGoal | null; error: string | null }> {
    const rawData = Object.fromEntries(formData.entries());
    const parsedData = {
        ...rawData,
        userId: 'mockUserId', // Replace with actual authenticated user ID
        isActive: rawData.isActive === 'on' || rawData.isActive === 'true',
        targetValue: Number(rawData.targetValue)
    };

    const validation = UserRewardGoalActionSchema.safeParse(parsedData);
    if (!validation.success) {
        return { data: null, error: validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') };
    }

    try {
        const newGoal: UserRewardGoal = { ...validation.data, id: `goal${Date.now()}` };
        mockUserRewardGoals.push(newGoal);
        return { data: newGoal, error: null };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Failed to add reward goal.";
        return { data: null, error: errorMessage };
    }
}

export async function handleUpdateUserRewardGoalActivity(goalId: string, isActive: boolean): Promise<{ success: boolean; error: string | null }> {
    try {
        const goalIndex = mockUserRewardGoals.findIndex(g => g.id === goalId && g.userId === 'mockUserId');
        if (goalIndex === -1) {
            return { success: false, error: "Goal not found or not authorized." };
        }
        mockUserRewardGoals[goalIndex].isActive = isActive;
        return { success: true, error: null };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Failed to update goal activity.";
        return { success: false, error: errorMessage };
    }
}

export async function handleRemoveUserRewardGoal(goalId: string): Promise<{ success: boolean; error: string | null }> {
    try {
        const initialLength = mockUserRewardGoals.length;
        mockUserRewardGoals = mockUserRewardGoals.filter(g => g.id !== goalId && g.userId === 'mockUserId');
        if (mockUserRewardGoals.length < initialLength) {
            return { success: true, error: null };
        }
        return { success: false, error: "Goal not found or not authorized to remove." };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Failed to remove goal.";
        return { success: false, error: errorMessage };
    }
}

// Replace mock data with dynamic data fetching
export async function getUserCards(): Promise<UserCard[]> {
  return await fetchUserCards();
}

export async function getLoyaltyPrograms(): Promise<LoyaltyProgram[]> {
  return await fetchLoyaltyPrograms();
}

export async function getUserRewardGoals(): Promise<UserRewardGoal[]> {
  return await fetchUserRewardGoals();
}
