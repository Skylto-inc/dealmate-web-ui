import { 
  CardVault, 
  CreateCardRequest, 
  UpdateCardRequest, 
  CardTemplate,
  DealRankingRequest,
  DealRankingResponse 
} from '@/types/card-vault';

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/cards`;

export const cardsApi = {
  // Get all user cards
  async getUserCards(): Promise<CardVault[]> {
    const response = await fetch(API_BASE, {
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch cards');
    }
    
    return response.json();
  },

  // Get a specific card
  async getCard(cardId: string): Promise<CardVault> {
    const response = await fetch(`${API_BASE}/${cardId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch card');
    }
    
    return response.json();
  },

  // Create a new card
  async createCard(data: CreateCardRequest): Promise<CardVault> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create card');
    }
    
    return response.json();
  },

  // Update a card
  async updateCard(cardId: string, data: UpdateCardRequest): Promise<CardVault> {
    const response = await fetch(`${API_BASE}/${cardId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update card');
    }
    
    return response.json();
  },

  // Delete a card
  async deleteCard(cardId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${cardId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete card');
    }
  },

  // Get card templates
  async getCardTemplates(): Promise<CardTemplate[]> {
    const response = await fetch(`${API_BASE}/templates`, {
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch card templates');
    }
    
    return response.json();
  },

  // Calculate deal rankings
  async calculateDealRankings(data: DealRankingRequest): Promise<DealRankingResponse> {
    const response = await fetch(`${API_BASE}/rank-deals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to calculate deal rankings');
    }
    
    return response.json();
  },

  // Set a card as primary
  async setPrimaryCard(cardId: string): Promise<CardVault> {
    return this.updateCard(cardId, { isPrimary: true });
  },

  // Update current points
  async updateCardPoints(cardId: string, currentPoints: number): Promise<CardVault> {
    return this.updateCard(cardId, { currentPoints });
  },
};

// React Query hooks (if using React Query)
export const useCards = () => {
  // Implementation depends on your React Query setup
  // This is just a placeholder
  return {
    data: [],
    isLoading: false,
    error: null,
    refetch: () => {},
  };
};
