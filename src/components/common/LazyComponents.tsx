'use client';

import { lazy, Suspense } from 'react';
import { ComponentLoader, CardSkeleton } from '@/components/ui/component-loader';

// Lazy load home components
export const LazyProductInfoCard = lazy(() => 
  import('@/components/home/ProductInfoCard').then(module => ({ default: module.default }))
);

export const LazyPriceComparisonTable = lazy(() => 
  import('@/components/home/PriceComparisonTable').then(module => ({ default: module.default }))
);

export const LazyOffersList = lazy(() => 
  import('@/components/home/OffersList').then(module => ({ default: module.default }))
);

export const LazySavingsScore = lazy(() => 
  import('@/components/home/SavingsScore').then(module => ({ default: module.default }))
);

export const LazyPriceHistoryChart = lazy(() => 
  import('@/components/home/PriceHistoryChart').then(module => ({ default: module.default }))
);

export const LazyMonthlySavingsChart = lazy(() => 
  import('@/components/home/MonthlySavingsChart').then(module => ({ default: module.default }))
);

// Lazy load wallet components
export const LazyCreditCardList = lazy(() => 
  import('@/components/wallet/CreditCardList').then(module => ({ default: module.default }))
);

export const LazyCardVaultForm = lazy(() => 
  import('@/components/wallet/CardVaultForm').then(module => ({ default: module.default }))
);

export const LazyRewardProgressChart = lazy(() => 
  import('@/components/wallet/RewardProgressChart').then(module => ({ default: module.default }))
);

export const LazyRewardGoalsList = lazy(() => 
  import('@/components/wallet/RewardGoalsList').then(module => ({ default: module.default }))
);

export const LazyLoyaltyProgramList = lazy(() => 
  import('@/components/wallet/LoyaltyProgramList').then(module => ({ default: module.default }))
);

// Lazy load lootpack components
export const LazyRewardsInventory = lazy(() => 
  import('@/components/lootpacks/RewardsInventory').then(module => ({ default: module.default }))
);

export const LazyDailyStreakTracker = lazy(() => 
  import('@/components/lootpacks/DailyStreakTracker').then(module => ({ default: module.default }))
);

export const LazyPackOpeningModal = lazy(() => 
  import('@/components/lootpacks/PackOpeningModal').then(module => ({ default: module.default }))
);

export const LazyLootPackCard = lazy(() => 
  import('@/components/lootpacks/LootPackCard').then(module => ({ default: module.default }))
);

// Lazy load smart deals components
export const LazyRankedOfferCard = lazy(() => 
  import('@/components/smart-deals/RankedOfferCard').then(module => ({ default: module.default }))
);

// Lazy load recommendation components
export const LazyRecommendedProductCard = lazy(() => 
  import('@/components/home/RecommendedProductCard').then(module => ({ default: module.default }))
);

export const LazyRecommendationSection = lazy(() => 
  import('@/components/home/RecommendationSection').then(module => ({ default: module.default }))
);

// Component wrapper with suspense
export function WithSuspense({ 
  children, 
  fallback = null,
  className = ""
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}) {
  return (
    <Suspense fallback={fallback ? <div className={className}>{fallback}</div> : null}>
      {children}
    </Suspense>
  );
}

export default {
  LazyProductInfoCard,
  LazyPriceComparisonTable,
  LazyOffersList,
  LazySavingsScore,
  LazyPriceHistoryChart,
  LazyMonthlySavingsChart,
  LazyCreditCardList,
  LazyCardVaultForm,
  LazyRewardProgressChart,
  LazyRewardGoalsList,
  LazyLoyaltyProgramList,
  LazyRewardsInventory,
  LazyDailyStreakTracker,
  LazyPackOpeningModal,
  LazyLootPackCard,
  LazyRankedOfferCard,
  WithSuspense,
};
