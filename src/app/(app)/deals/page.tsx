'use client';

import RealTimeDeals from '@/components/deals/RealTimeDeals';
import { AuthProvider } from '@/lib/auth-context';

export default function DealsPage() {
  return (
    <AuthProvider>
      <div className="container mx-auto py-8">
        <RealTimeDeals />
      </div>
    </AuthProvider>
  );
}
