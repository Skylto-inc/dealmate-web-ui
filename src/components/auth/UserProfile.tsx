'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { AuthLoader } from '@/components/ui/animated-loader';
import { isFeatureEnabled } from '@/lib/feature-toggles-client';

export default function UserProfile() {
  const { user, logout, isLoading } = useAuth0();
  const [loginEnabled, setLoginEnabled] = useState(true);

  useEffect(() => {
    const checkLoginFeature = async () => {
      const enabled = await isFeatureEnabled('Login');
      setLoginEnabled(enabled);
    };
    checkLoginFeature();
  }, []);

  // If login is disabled, show a guest user profile
  if (!loginEnabled) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
          <span className="text-white text-sm">G</span>
        </div>
        <span className="text-white">Guest User</span>
      </div>
    );
  }

  if (isLoading) return (
    <div className="flex items-center justify-center p-4">
      <AuthLoader size="sm" />
    </div>
  );
  if (!user) return null;

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <div className="flex items-center gap-3">
      {user.picture && (
        <img 
          src={user.picture} 
          alt={user.name || 'User'} 
          className="w-8 h-8 rounded-full"
        />
      )}
      <span className="text-white">{user.name}</span>
      <button 
        onClick={handleLogout}
        className="text-red-400 hover:text-red-300 text-sm"
      >
        Logout
      </button>
    </div>
  );
}
