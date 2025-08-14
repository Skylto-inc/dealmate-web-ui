import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { RecommendationsResponse, Recommendation } from '@/types/recommendations';
import RecommendationsService from '@/services/recommendations';
import { isFeatureEnabled } from '@/lib/feature-toggles-client';

interface UseRecommendationsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useRecommendations(options: UseRecommendationsOptions = {}) {
  const { user } = useAuth0();
  const [data, setData] = useState<RecommendationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [loginEnabled, setLoginEnabled] = useState(true);

  const { autoRefresh = false, refreshInterval = 300000 } = options; // 5 minutes default

  useEffect(() => {
    const checkLoginFeature = async () => {
      const enabled = await isFeatureEnabled('Login');
      setLoginEnabled(enabled);
    };
    checkLoginFeature();
  }, []);

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use guest user ID if login is disabled
      const userId = !loginEnabled ? 'guest-user' : user?.sub;
      
      const recommendations = await RecommendationsService.getRecommendations(
        userId || undefined
      );
      
      setData(recommendations);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch recommendations'));
    } finally {
      setLoading(false);
    }
  }, [user?.sub, loginEnabled]);

  const markNotInterested = useCallback(async (productId: string) => {
    const userId = !loginEnabled ? 'guest-user' : user?.sub;
    if (!userId) return;
    
    try {
      await RecommendationsService.markNotInterested(userId, productId);
      
      // Remove the product from current recommendations
      setData(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          sections: prev.sections.map(section => ({
            ...section,
            recommendations: section.recommendations.filter(
              rec => rec.id !== productId
            ),
          })),
        };
      });
    } catch (err) {
      console.error('Failed to mark as not interested:', err);
    }
  }, [user?.sub, loginEnabled]);

  const trackActivity = useCallback(async (
    productId: string,
    action: 'view' | 'click' | 'purchase' | 'wishlist' | 'search',
    metadata?: any
  ) => {
    const userId = !loginEnabled ? 'guest-user' : user?.sub;
    if (!userId) return;
    
    try {
      await RecommendationsService.trackUserActivity({
        userId,
        productId,
        action,
        metadata,
      });
    } catch (err) {
      console.error('Failed to track activity:', err);
    }
  }, [user?.sub, loginEnabled]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchRecommendations, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchRecommendations]);

  return {
    data,
    loading,
    error,
    refetch: fetchRecommendations,
    markNotInterested,
    trackActivity,
  };
}

export default useRecommendations;
