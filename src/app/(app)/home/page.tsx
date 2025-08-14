"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TicketPercent, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  LazyProductInfoCard,
  LazyPriceComparisonTable,
  LazyOffersList,
  LazySavingsScore,
  LazyPriceHistoryChart,
  LazyMonthlySavingsChart,
  LazyRecommendationSection,
  WithSuspense
} from '@/components/common/LazyComponents';
import { ComponentLoader, CardSkeleton } from '@/components/ui/component-loader';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useNavigationState } from '@/lib/state/navigation-state';
import { useIntersectionObserver, useBatchedUpdates, globalDataCache } from '@/lib/performance/lazy-loader';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Use persistent navigation state
  const { 
    homePageState, 
    setHomePageInitialized, 
    setVisibleSections, 
    resetIfStale 
  } = useNavigationState();
  
  const visibleSections = homePageState.visibleSections;
  const batchUpdate = useBatchedUpdates();

  const { 
    data: recommendations, 
    loading: recommendationsLoading, 
    markNotInterested,
    trackActivity 
  } = useRecommendations({ autoRefresh: true });

  // Intersection observers for progressive loading
  const { targetRef: chartsRef, hasIntersected: chartsVisible } = useIntersectionObserver();
  const { targetRef: comparisonRef, hasIntersected: comparisonVisible } = useIntersectionObserver();
  const { targetRef: offersRef, hasIntersected: offersVisible } = useIntersectionObserver();
  const { targetRef: actionsRef, hasIntersected: actionsVisible } = useIntersectionObserver();

  useEffect(() => {
    // Reset if data is stale
    resetIfStale();
    
    setIsLoaded(true);
    
    // If not initialized, set up progressive loading
    if (!homePageState.isInitialized) {
      setHomePageInitialized(true);
      
      // Progressive loading only on first visit
      const timer1 = setTimeout(() => batchUpdate(() => setVisibleSections({ charts: true })), 300);
      const timer2 = setTimeout(() => batchUpdate(() => setVisibleSections({ comparison: true })), 600);
      const timer3 = setTimeout(() => batchUpdate(() => setVisibleSections({ offers: true })), 900);
      const timer4 = setTimeout(() => batchUpdate(() => setVisibleSections({ actions: true })), 1200);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    } else {
      // Already initialized, show all sections immediately
      setVisibleSections({
        charts: true,
        comparison: true,
        offers: true,
        actions: true
      });
    }
  }, []);

  // Update visibility based on intersection
  useEffect(() => {
    if (chartsVisible && !visibleSections.charts) {
      batchUpdate(() => setVisibleSections({ charts: true }));
    }
  }, [chartsVisible]);

  useEffect(() => {
    if (comparisonVisible && !visibleSections.comparison) {
      batchUpdate(() => setVisibleSections({ comparison: true }));
    }
  }, [comparisonVisible]);

  useEffect(() => {
    if (offersVisible && !visibleSections.offers) {
      batchUpdate(() => setVisibleSections({ offers: true }));
    }
  }, [offersVisible]);

  useEffect(() => {
    if (actionsVisible && !visibleSections.actions) {
      batchUpdate(() => setVisibleSections({ actions: true }));
    }
  }, [actionsVisible]);

  const handleProductClick = (productId: string) => {
    trackActivity(productId, 'click');
    // Navigate to product details or comparison page
    router.push(`/compare?product=${productId}`);
  };

  const handleAddToWishlist = (productId: string) => {
    trackActivity(productId, 'wishlist');
    // Add to wishlist logic
  };

  const handleCompare = (productId: string) => {
    trackActivity(productId, 'click');
    router.push(`/compare?product=${productId}`);
  };

  const handleViewMore = (sectionType: string) => {
    // Navigate to dedicated page for that recommendation type
    router.push(`/smart-deals?type=${sectionType}`);
  };
  return (
    <div className="min-h-screen-safe">
      <div className={cn("space-responsive", isLoaded ? 'animate-fade-in' : 'opacity-0')}>
        
        {/* Welcome Section - Mobile Optimized */}
        <div className="glass-card p-3 xs:p-4 sm:p-6 mb-4 xs:mb-6">
          <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-headline font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Welcome to DealMate
          </h1>
          <p className="text-sm xs:text-base text-muted-foreground/80">
            Your personalized deals dashboard
          </p>
        </div>
        
        {/* Personalized Recommendations */}
        {visibleSections.hero && recommendations?.sections && (
          <div className="space-y-8 xs:space-y-12 mb-8 xs:mb-12">
            {recommendations.sections.map((section, index) => (
              <div
                key={section.type}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="animate-fade-in"
              >
                <WithSuspense fallback={<CardSkeleton />}>
                  <LazyRecommendationSection
                    section={section}
                    onNotInterested={markNotInterested}
                    onAddToWishlist={handleAddToWishlist}
                    onViewDetails={handleProductClick}
                    onCompare={handleCompare}
                    onViewMore={() => handleViewMore(section.type)}
                    loading={recommendationsLoading}
                  />
                </WithSuspense>
              </div>
            ))}
          </div>
        )}

        {/* Fallback for no recommendations */}
        {visibleSections.hero && !recommendationsLoading && !recommendations?.sections?.length && (
          <div className="glass-card p-8 text-center mb-8">
            <p className="text-muted-foreground mb-4">
              No personalized recommendations available yet. Start browsing to get personalized deals!
            </p>
            <button
              onClick={() => router.push('/smart-deals')}
              className="btn-primary"
            >
              Browse All Deals
            </button>
          </div>
        )}
        
        {/* Savings Overview - Mobile First Layout */}
        <div ref={chartsRef}>
          {visibleSections.charts && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 mb-6 xs:mb-8">
              <div className="lg:col-span-1 order-2 lg:order-1 transition-transform duration-200 hover:scale-105">
                <WithSuspense>
                  <LazySavingsScore score="₹300" percentageOff="23%" />
                </WithSuspense>
              </div>
              <div className="lg:col-span-3 order-1 lg:order-2 grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4 sm:gap-6">
                <div className="transition-transform duration-200 hover:scale-105">
                  <WithSuspense>
                    <LazyPriceHistoryChart />
                  </WithSuspense>
                </div>
                <div className="transition-transform duration-200 hover:scale-105">
                  <WithSuspense>
                    <LazyMonthlySavingsChart />
                  </WithSuspense>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Price Comparison - Enhanced Mobile Table */}
        <div ref={comparisonRef}>
          {visibleSections.comparison && (
            <div className="glass-card p-3 xs:p-4 sm:p-6 mb-6 xs:mb-8">
              <div className="overflow-x-auto scrollbar-thin">
                <WithSuspense>
                  <LazyPriceComparisonTable />
                </WithSuspense>
              </div>
            </div>
          )}
        </div>

        {/* Offers Section - Responsive Stack */}
        <div ref={offersRef}>
          {visibleSections.offers && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 xs:gap-4 sm:gap-6 mb-6 xs:mb-8">
              <div>
                <WithSuspense>
                  <LazyOffersList 
                    title="Available Coupons" 
                    icon={TicketPercent} 
                    offers={[
                      { type: 'coupon', description: 'WELCOME50', value: '₹50 OFF' },
                      { type: 'coupon', description: 'GADGET10', value: '10% OFF' },
                    ]}
                  />
                </WithSuspense>
              </div>
              
              <div style={{animationDelay: '0.1s'}}>
                <WithSuspense>
                  <LazyOffersList 
                    title="Cashback Offers" 
                    icon={CreditCard} 
                    offers={[
                      { type: 'cashback', description: 'ICICI Credit Card', value: '5% Back' },
                      { type: 'cashback', description: 'Paytm Wallet', value: '₹25 CB' },
                    ]}
                  />
                </WithSuspense>
              </div>
            </div>
          )}
        </div>
        
        
        <p className="text-xs xs:text-sm text-center text-muted-foreground/60 pt-2 xs:pt-4 pb-safe-bottom">
          Product data for demonstration purposes. Prices and offers may vary.
        </p>
      </div>
    </div>
  );
}
