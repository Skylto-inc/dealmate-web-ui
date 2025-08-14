'use client';

import { Auth0Provider } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Auth0ProviderWithHistory({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;

  useEffect(() => {
    console.log('Auth0 Environment Variables Check:');
    console.log('NEXT_PUBLIC_AUTH0_DOMAIN:', domain);
    console.log('NEXT_PUBLIC_AUTH0_CLIENT_ID:', clientId);
    console.log('NEXT_PUBLIC_AUTH0_AUDIENCE:', audience);
    
    if (!domain || !clientId) {
      console.warn('Auth0 configuration missing. Please check your environment variables.');
    }
  }, [domain, clientId, audience]);

  const onRedirectCallback = (appState: any) => {
    // Redirect to the intended destination or home page
    const returnTo = appState?.returnTo || '/home';
    router.push(returnTo);
  };

  if (!domain || !clientId) {
    console.error('Auth0 domain and clientId are required. Falling back to no-auth mode.');
    return <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
      <p className="text-yellow-800">Auth0 configuration missing. Running in development mode without authentication.</p>
      {children}
    </div>;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '',
        audience: audience,
        scope: "openid profile email"
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
      skipRedirectCallback={false}
    >
      {children}
    </Auth0Provider>
  );
}
