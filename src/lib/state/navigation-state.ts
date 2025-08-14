/**
 * Navigation State Management
 * Persists component visibility and loading states across navigation
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NavigationState {
  // Home page state
  homePageState: {
    isInitialized: boolean;
    visibleSections: {
      hero: boolean;
      charts: boolean;
      comparison: boolean;
      offers: boolean;
      actions: boolean;
    };
    lastVisitTimestamp: number;
  };
  
  // Methods
  setHomePageInitialized: (initialized: boolean) => void;
  setVisibleSections: (sections: Partial<NavigationState['homePageState']['visibleSections']>) => void;
  resetIfStale: () => void;
}

const STALE_THRESHOLD = 30 * 60 * 1000; // 30 minutes

export const useNavigationState = create<NavigationState>()(
  persist(
    (set, get) => ({
      homePageState: {
        isInitialized: false,
        visibleSections: {
          hero: true,
          charts: false,
          comparison: false,
          offers: false,
          actions: false
        },
        lastVisitTimestamp: Date.now()
      },
      
      setHomePageInitialized: (initialized) =>
        set((state) => ({
          homePageState: {
            ...state.homePageState,
            isInitialized: initialized,
            lastVisitTimestamp: Date.now()
          }
        })),
      
      setVisibleSections: (sections) =>
        set((state) => ({
          homePageState: {
            ...state.homePageState,
            visibleSections: {
              ...state.homePageState.visibleSections,
              ...sections
            }
          }
        })),
      
      resetIfStale: () => {
        const state = get();
        const now = Date.now();
        if (now - state.homePageState.lastVisitTimestamp > STALE_THRESHOLD) {
          set({
            homePageState: {
              isInitialized: false,
              visibleSections: {
                hero: true,
                charts: false,
                comparison: false,
                offers: false,
                actions: false
              },
              lastVisitTimestamp: now
            }
          });
        }
      }
    }),
    {
      name: 'dealmate-navigation-state',
      partialize: (state) => ({ homePageState: state.homePageState })
    }
  )
);
