'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isFeatureEnabled } from '@/lib/feature-toggles-client';
import LandingPage from '@/components/landing/LandingPage';
import { AuthAppLoader } from '@/components/ui/app-loading-screen';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    const checkAndRedirect = async () => {
      try {
        const loginEnabled = await isFeatureEnabled('Login');
        if (!loginEnabled) {
          router.replace('/home');
          return;
        }
        setShowLanding(true);
        setIsLoading(false);
      } catch (error) {
        setShowLanding(true);
        setIsLoading(false);
      }
    };
    
    checkAndRedirect();
  }, []);

  if (isLoading || (!showLanding && !isLoading)) {
    return <AuthAppLoader />;
  }

  return <LandingPage />;
}
