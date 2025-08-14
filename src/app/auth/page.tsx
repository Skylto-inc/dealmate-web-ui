'use client';

import { Suspense } from 'react';
import AuthContainer from '@/components/auth/AuthContainer';
import { AuthLoader } from '@/components/ui/animated-loader';

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <AuthLoader size="lg" />
      </div>
    }>
      <AuthContainer />
    </Suspense>
  );
}
