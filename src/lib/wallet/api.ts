// Internal Wallet API Integration
export interface InternalWallet {
  id: string;
  user_id: string;
  balance: string; // BigDecimal as string
  currency: string;
  status: 'active' | 'suspended' | 'frozen';
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  transaction_type: 'deposit' | 'withdrawal' | 'purchase' | 'sale' | 'refund' | 'transfer_in' | 'transfer_out';
  amount: string; // BigDecimal as string
  balance_before: string;
  balance_after: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  reference_id?: string;
  reference_type?: string;
  description?: string;
  metadata?: any;
  created_at: string;
  completed_at?: string;
}

export interface AddMoneyRequest {
  amount: string;
  payment_method: {
    type: 'card';
    number: string;
    exp_month: string;
    exp_year: string;
    cvc: string;
  };
  description?: string;
}

export interface WithdrawMoneyRequest {
  amount: string;
  bank_connection_id: string;
  description?: string;
}

export interface WalletResponse {
  wallet: InternalWallet;
}

export interface TransactionResponse {
  transaction: WalletTransaction;
}

export interface TransactionsListResponse {
  transactions: WalletTransaction[];
  total: number;
}

class WalletAPI {
  private baseUrl = '/api/v1';

  private async getAuthHeaders(): Promise<HeadersInit> {
    // Check if login is enabled
    const { isFeatureEnabled } = await import('@/lib/feature-toggles-client');
    const loginEnabled = await isFeatureEnabled('Login');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (!loginEnabled) {
      // Create a demo user session when login is bypassed
      headers['X-Demo-User'] = 'demo';
      return headers;
    }

    // Get auth token from localStorage or auth context
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async getWallet(): Promise<WalletResponse> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}/wallet`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch wallet');
    }

    return response.json();
  }

  async addMoney(request: AddMoneyRequest): Promise<TransactionResponse> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}/wallet/add-money`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add money');
    }

    return response.json();
  }

  async withdrawMoney(request: WithdrawMoneyRequest): Promise<TransactionResponse> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}/wallet/transfer-to-bank`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to withdraw money');
    }

    return response.json();
  }

  async getTransactions(limit = 20, offset = 0): Promise<TransactionsListResponse> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}/wallet/transactions?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    return response.json();
  }

  async purchaseDeal(listingId: string): Promise<{ transaction: WalletTransaction; coupon_code: string }> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}/wallet/purchase-deal`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ listing_id: listingId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to purchase deal');
    }

    return response.json();
  }
}

export const walletAPI = new WalletAPI();

// Utility functions
export function formatCurrency(amount: string, currency = 'USD'): string {
  const num = parseFloat(amount);
  if (currency === 'USD') {
    return `$${num.toFixed(2)}`;
  } else if (currency === 'INR') {
    return `₹${num.toFixed(2)}`;
  }
  return `${num.toFixed(2)} ${currency}`;
}

export function getTransactionIcon(type: WalletTransaction['transaction_type']): string {
  switch (type) {
    case 'deposit':
      return '💰';
    case 'withdrawal':
      return '🏦';
    case 'purchase':
      return '🛒';
    case 'sale':
      return '💸';
    case 'refund':
      return '↩️';
    case 'transfer_in':
      return '📥';
    case 'transfer_out':
      return '📤';
    default:
      return '💳';
  }
}

export function getTransactionColor(type: WalletTransaction['transaction_type']): string {
  switch (type) {
    case 'deposit':
    case 'sale':
    case 'refund':
    case 'transfer_in':
      return 'text-green-500';
    case 'withdrawal':
    case 'purchase':
    case 'transfer_out':
      return 'text-red-500';
    default:
      return 'text-muted-foreground';
  }
}
