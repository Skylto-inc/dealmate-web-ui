'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { AuthLoader } from '@/components/ui/animated-loader';

function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, isAuthenticated, error, user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    // Handle Auth0 authentication flow
    const handleAuth0Callback = async () => {
      if (isLoading) return; // Still processing

      if (error) {
        console.error('Auth0 error:', error);
        router.push('/auth?error=authentication_failed');
        return;
      }

      if (isAuthenticated && user) {
        try {
          // Get the access token
          const token = await getAccessTokenSilently();
          
          // Store the token for API calls
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_profile', JSON.stringify(user));
          
          // Sync user with backend
          await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/auth/sync-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              sub: user.sub,
              email: user.email,
              name: user.name,
              picture: user.picture,
            }),
          }).catch(console.error);

          // Redirect to home
          router.push('/home');
        } catch (error) {
          console.error('Error getting access token:', error);
          router.push('/auth?error=token_error');
        }
        return;
      }

      // Fallback to the original flow for direct backend authentication
      const code = searchParams?.get('code');
      const token = searchParams?.get('token');
      const state = searchParams?.get('state');
      const authError = searchParams?.get('error');

      if (authError) {
        console.error('Auth error:', authError);
        router.push('/auth?error=' + authError);
        return;
      }

      if (token) {
        // Direct token from Auth0 flow
        localStorage.setItem('auth_token', token);
        router.push('/home');
        return;
      }

      if (code) {
        // Exchange the authorization code for a token
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/auth/callback?code=${code}&state=${state || ''}`)
          .then(async (res) => {
            if (res.ok) {
              // Check if response redirects us
              if (res.redirected) {
                const redirectUrl = new URL(res.url);
                const tokenFromRedirect = redirectUrl.searchParams.get('token');
                if (tokenFromRedirect) {
                  localStorage.setItem('auth_token', tokenFromRedirect);
                  router.push('/home');
                  return;
                }
              }
              
              // Try to parse JSON response
              const data = await res.json().catch(() => null);
              if (data?.access_token) {
                localStorage.setItem('auth_token', data.access_token);
                router.push('/home');
                return;
              }
            }
            throw new Error('Failed to exchange code for token');
          })
          .catch((error) => {
            console.error('Authentication error:', error);
            router.push('/auth?error=authentication_failed');
          });
      } else if (!isAuthenticated) {
        // Handle cases where neither code nor token is present and not authenticated
        router.push('/auth?error=missing_code');
      }
    };

    handleAuth0Callback();
  }, [router, searchParams, isLoading, isAuthenticated, error, user, getAccessTokenSilently]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <AuthLoader size="lg" />
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <AuthLoader size="lg" />
      </div>
    }>
      <AuthCallback />
    </Suspense>
  );
}
