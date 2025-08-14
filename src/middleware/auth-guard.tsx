'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AuthLoader } from '@/components/ui/animated-loader';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  fallbackPath?: string;
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  fallbackPath = '/auth' 
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !user) {
      // Redirect to auth page if authentication is required but user is not logged in
      router.replace(fallbackPath);
      return;
    }

    if (!requireAuth && user) {
      // Redirect to home if user is already logged in and trying to access auth pages
      router.replace('/home');
      return;
    }

    setIsAuthorized(true);
  }, [user, loading, requireAuth, router, fallbackPath]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <AuthLoader size="lg" />
      </div>
    );
  }

  // Don't render children until authorization is confirmed
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <AuthLoader size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthGuard;
