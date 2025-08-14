import { Wallet, UserCard, LoyaltyProgram, UserRewardGoal } from './types';
import { authApi } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function getWallet(walletId: string): Promise<Wallet> {
  const response = await authApi.makeAuthenticatedRequest(`/api/wallet/${walletId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch wallet');
  }
  return response.json();
}

export async function fetchUserCards(): Promise<UserCard[]> {
  // Mock data for now
  return [
    { id: '1', userId: '1', name: 'ICICI Amazon Pay', bank: 'ICICI', cardType: 'Credit' },
    { id: '2', userId: '1', name: 'HDFC Millennia', bank: 'HDFC', cardType: 'Credit' },
  ];
}

export async function fetchLoyaltyPrograms(): Promise<LoyaltyProgram[]> {
  // Mock data for now
  return [
    { id: '1', userId: '1', programName: 'Taj InnerCircle', currentPoints: 500, pointValueInRupees: 1 },
    { id: '2', userId: '1', programName: 'Marriott Bonvoy', currentPoints: 2500, pointValueInRupees: 0.5 },
  ];
}

export async function fetchUserRewardGoals(): Promise<UserRewardGoal[]> {
  // Mock data for now
  return [
    { id: '1', userId: '1', description: 'Free Flight Ticket', targetType: 'points_milestone_card', targetValue: 5000, cardIdRef: '1', isActive: true },
    { id: '2', userId: '1', description: 'Hotel Stay', targetType: 'points_milestone_program', targetValue: 7500, loyaltyProgramIdRef: '2', isActive: false },
  ];
}

export async function fetchDeals(productUrl: string) {
  const response = await authApi.makeAuthenticatedRequest(`/api/deals?product_url=${encodeURIComponent(productUrl)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch deals');
  }
  return response.json();
}
