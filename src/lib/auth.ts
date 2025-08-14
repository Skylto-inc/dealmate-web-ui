const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export interface User {
  id: string;
  auth0_id: string;
  username: string;
  email?: string;
  profile_picture?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  preferences?: any;
  subscription_tier?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  bio?: string;
  location?: string;
  timezone?: string;
  language?: string;
  currency?: string;
  notification_preferences?: any;
  privacy_settings?: any;
  created_at: string;
  updated_at: string;
}

export interface UserWithProfile {
  user: User;
  profile?: UserProfile;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export const authApi = {
  // Auth0 Methods
  async loginWithAuth0(connection?: string): Promise<void> {
    const params = new URLSearchParams();
    if (connection) {
      params.append('connection', connection);
    }
    window.location.href = `${BACKEND_URL}/auth/login?${params.toString()}`;
  },

  async signupWithAuth0(connection?: string): Promise<void> {
    const params = new URLSearchParams();
    if (connection) {
      params.append('connection', connection);
    }
    window.location.href = `${BACKEND_URL}/auth/signup?${params.toString()}`;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
    window.location.href = `${BACKEND_URL}/auth/logout`;
  },

  // Custom Auth Methods (for your existing flows)
  async loginWithCredentials(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message || 'Login failed');
    }

    return await response.json();
  },

  async signupWithCredentials(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Signup failed' }));
      throw new Error(error.message || 'Signup failed');
    }

    return await response.json();
  },

  // User Profile Methods
  async getUser(token: string): Promise<User | null> {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  },

  async getCurrentUserWithProfile(): Promise<UserWithProfile | null> {
    try {
      const response = await this.makeAuthenticatedRequest('/api/v1/users/me');
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  },

  async updateUser(updates: Partial<User>): Promise<User> {
    const response = await this.makeAuthenticatedRequest('/api/v1/users/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Update failed' }));
      throw new Error(error.message || 'Update failed');
    }

    return await response.json();
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const response = await this.makeAuthenticatedRequest('/api/v1/users/me/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Profile update failed' }));
      throw new Error(error.message || 'Profile update failed');
    }

    return await response.json();
  },

  async deleteAccount(): Promise<void> {
    const response = await this.makeAuthenticatedRequest('/api/v1/users/me', {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Account deletion failed' }));
      throw new Error(error.message || 'Account deletion failed');
    }
  },

  // Utility Methods
  async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}) {
    // Only run on client-side
    if (typeof window === 'undefined') {
      throw new Error('Client-side only function');
    }
    
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No auth token found');
    }

    return fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  },

  isAuthenticated(): boolean {
    // Only run on client-side
    if (typeof window === 'undefined') {
      return false;
    }
    return !!localStorage.getItem('auth_token');
  },

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('auth_token');
  },

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },

  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },
};
