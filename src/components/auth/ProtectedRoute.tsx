'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isFeatureEnabled } from '@/lib/feature-toggles-client';
import { AuthAppLoader } from '@/components/ui/app-loading-screen';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    const checkAuth = async () => {
      const loginEnabled = await isFeatureEnabled('Login');
      
      if (!loginEnabled) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }
      
      const token = localStorage.getItem('auth_token');
      if (token) {
        setIsAuthenticated(true);
      } else {
        router.push('/auth');
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, [router]);

  if (isLoading) {
    return <AuthAppLoader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}