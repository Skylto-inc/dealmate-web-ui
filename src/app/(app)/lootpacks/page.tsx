"use client";

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Package2, Sparkles, Gift, Clock, Zap, Crown, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AuthLoader } from '@/components/ui/animated-loader';
import { useLazyLoading, useProgressiveLoading } from '@/hooks/useLazyLoading';
import { cn } from '@/lib/utils';

// Lazy load heavy components
const LootPackCard = dynamic(() => import('@/components/lootpacks/LootPackCard'), {
  loading: () => <AuthLoader size="sm" />,
  ssr: false
});

const AdRequiredPackCard = dynamic(() => import('@/components/lootpacks/AdRequiredPackCard'), {
  loading: () => <AuthLoader size="sm" />,
  ssr: false
});

const PuzzleSystem = dynamic(() => import('@/components/lootpacks/PuzzleSystem'), {
  loading: () => <AuthLoader size="sm" />,
  ssr: false
});

const AdEarningWidget = dynamic(() => import('@/components/lootpacks/AdEarningWidget'), {
  loading: () => <AuthLoader size="sm" />,
  ssr: false
});

const PackOpeningModal = dynamic(() => import('@/components/lootpacks/PackOpeningModal'), {
  loading: () => <AuthLoader size="sm" />,
  ssr: false
});

const RewardsInventory = dynamic(() => import('@/components/lootpacks/RewardsInventory'), {
  loading: () => <AuthLoader size="sm" />,
  ssr: false
});

const DailyStreakTracker = dynamic(() => import('@/components/lootpacks/DailyStreakTracker'), {
  loading: () => <AuthLoader size="sm" />,
  ssr: false
});

// Mock data for available packs
const availablePacks = [
  {
    id: '1',
    name: 'Daily Free Pack',
    type: 'free' as const,
    description: 'Your daily dose of rewards!',
    icon: Gift,
    color: 'from-green-400 to-emerald-600',
    available: true,
    requiresAd: true, // Now requires ad to open
    cooldown: 24 * 60 * 60 * 1000, // 24 hours
    rewards: {
      min: 1,
      max: 3,
      possibleTypes: ['coupon', 'cashback', 'points']
    }
  },
  {
    id: '2',
    name: 'Bronze Pack',
    type: 'premium' as const,
    description: 'Basic rewards with guaranteed value',
    icon: Package2,
    color: 'from-orange-400 to-amber-600',
    price: 99,
    rewards: {
      min: 3,
      max: 5,
      possibleTypes: ['coupon', 'cashback', 'points', 'voucher']
    }
  },
  {
    id: '3',
    name: 'Silver Pack',
    type: 'premium' as const,
    description: 'Enhanced rewards with rare items',
    icon: Sparkles,
    color: 'from-gray-400 to-slate-600',
    price: 299,
    rewards: {
      min: 5,
      max: 8,
      possibleTypes: ['coupon', 'cashback', 'points', 'voucher', 'exclusive']
    }
  },
  {
    id: '4',
    name: 'Gold Pack',
    type: 'premium' as const,
    description: 'Premium rewards with exclusive deals',
    icon: Crown,
    color: 'from-yellow-400 to-yellow-600',
    price: 599,
    rewards: {
      min: 8,
      max: 12,
      possibleTypes: ['coupon', 'cashback', 'points', 'voucher', 'exclusive', 'jackpot']
    }
  }
];

// User data interface
interface UserStats {
  dealCoins: number;
  dailyStreak: number;
  totalPacksOpened: number;
  level: number;
  levelProgress: number;
  nextLevelReward: string;
  lastLoginDate: string;
  lastFreePackDate: string | null;
}

// Dynamic user data with localStorage persistence
const getInitialUserData = (): UserStats => {
  if (typeof window !== 'undefined') {
    const savedData = localStorage.getItem('dealmate_user_stats');
    if (savedData) {
      return JSON.parse(savedData);
    }
  }
  
  // Default data for new users
  return {
    dealCoins: 500, // Start with fewer coins
    dailyStreak: 1,
    totalPacksOpened: 0,
    level: 1,
    levelProgress: 0,
    nextLevelReward: 'Bronze Pack',
    lastLoginDate: new Date().toDateString(),
    lastFreePackDate: null
  };
};

export default function LootPacksPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPack, setSelectedPack] = useState<any>(null);
  const [isOpeningPack, setIsOpeningPack] = useState(false);
  const [userStats, setUserStats] = useState(getInitialUserData());
  const [lastFreePackTime, setLastFreePackTime] = useState<number | null>(null);
  const [timeUntilFree, setTimeUntilFree] = useState<string>('');
  const [adWatchedForDailyPack, setAdWatchedForDailyPack] = useState(false);
  
  // Progressive loading states
  const [visibleSections, setVisibleSections] = useState({
    hero: true,
    packs: false,
    inventory: false,
    streak: false,
    puzzle: false,
    adEarning: false
  });

  // Use progressive loading hook
  const shouldLoadHeavyComponents = useProgressiveLoading(500);
  const { isVisible: inventoryVisible } = useLazyLoading();

  useEffect(() => {
    setIsLoaded(true);
    // Load last free pack time from localStorage
    const savedTime = localStorage.getItem('lastFreePackTime');
    if (savedTime) {
      setLastFreePackTime(parseInt(savedTime));
    }
    
    // Progressive section loading
    const timer1 = setTimeout(() => setVisibleSections(prev => ({ ...prev, packs: true })), 200);
    const timer2 = setTimeout(() => setVisibleSections(prev => ({ ...prev, streak: true })), 400);
    const timer3 = setTimeout(() => setVisibleSections(prev => ({ ...prev, puzzle: true })), 600);
    const timer4 = setTimeout(() => setVisibleSections(prev => ({ ...prev, adEarning: true })), 800);
    const timer5 = setTimeout(() => setVisibleSections(prev => ({ ...prev, inventory: true })), 1000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  useEffect(() => {
    // Update countdown timer
    const interval = setInterval(() => {
      if (lastFreePackTime) {
        const timePassed = Date.now() - lastFreePackTime;
        const timeRemaining = 24 * 60 * 60 * 1000 - timePassed;
        
        if (timeRemaining > 0) {
          const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
          const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
          const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);
          setTimeUntilFree(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeUntilFree('');
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastFreePackTime]);

  const handlePackSelect = (pack: any) => {
    // Check if free pack is on cooldown
    if (pack.type === 'free' && lastFreePackTime) {
      const timePassed = Date.now() - lastFreePackTime;
      if (timePassed < pack.cooldown) {
        return; // Pack is on cooldown
      }
    }

    setSelectedPack(pack);
    setIsOpeningPack(true);
  };

  const handleWatchAd = (pack: any) => {
    console.log('Watching ad for pack:', pack.name);
    // In real implementation, this would integrate with ad providers
    // For now, just mark as watched after a delay
    setTimeout(() => {
      if (pack.id === '1') { // Daily free pack
        setAdWatchedForDailyPack(true);
      }
    }, 3000);
  };

  const handleCoinsEarned = (amount: number) => {
    setUserStats(prev => ({
      ...prev,
      dealCoins: prev.dealCoins + amount
    }));
  };

  const handlePackOpened = (rewards: any[]) => {
    // Calculate bonus DealCoins from rewards
    const bonusCoins = rewards.reduce((total, reward) => {
      if (reward.type === 'points') {
        const coinValue = parseInt(reward.value.replace('+', '')) || 0;
        return total + coinValue;
      }
      return total + 10; // Base reward for other types
    }, 0);

    // Update user stats
    const newStats = {
      ...userStats,
      totalPacksOpened: userStats.totalPacksOpened + 1,
      dealCoins: userStats.dealCoins + bonusCoins,
      levelProgress: Math.min(userStats.levelProgress + 10, 100)
    };

    // Check for level up
    if (newStats.levelProgress >= 100) {
      newStats.level += 1;
      newStats.levelProgress = 0;
      newStats.dealCoins += 100; // Level up bonus
    }

    setUserStats(newStats);
    
    // Save to localStorage
    localStorage.setItem('dealmate_user_stats', JSON.stringify(newStats));

    // Add rewards to inventory
    const existingInventory = JSON.parse(localStorage.getItem('dealmate_rewards_inventory') || '[]');
    const newRewards = rewards
      .filter(reward => reward.type !== 'points') // Points are added to DealCoins, not inventory
      .map(reward => ({
        id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: reward.type,
        title: reward.title,
        value: reward.value,
        description: reward.description,
        code: generateCouponCode(reward.type),
        expiresAt: reward.type === 'points' ? undefined : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isUsed: false,
        source: selectedPack?.name || 'Unknown Pack',
        rarity: reward.rarity,
        earnedAt: new Date()
      }));

    const updatedInventory = [...existingInventory, ...newRewards];
    localStorage.setItem('dealmate_rewards_inventory', JSON.stringify(updatedInventory));

    // If it was a free pack, save the timestamp
    if (selectedPack?.type === 'free') {
      const now = Date.now();
      setLastFreePackTime(now);
      localStorage.setItem('lastFreePackTime', now.toString());
    }

    // Close modal after a delay
    setTimeout(() => {
      setIsOpeningPack(false);
      setSelectedPack(null);
    }, 3000);
  };

  // Helper function to generate realistic coupon codes
  const generateCouponCode = (type: string): string | undefined => {
    if (type === 'coupon' || type === 'voucher') {
      const prefixes = {
        coupon: ['DEAL', 'SAVE', 'SHOP', 'MEGA', 'SUPER'],
        voucher: ['GIFT', 'FREE', 'ENJOY', 'TREAT', 'BONUS']
      };
      const prefix = prefixes[type as keyof typeof prefixes] || ['DEAL'];
      const randomPrefix = prefix[Math.floor(Math.random() * prefix.length)];
      const randomNum = Math.floor(Math.random() * 999) + 100;
      return `${randomPrefix}${randomNum}`;
    }
    return undefined;
  };

  const canOpenFreePack = !lastFreePackTime || (Date.now() - lastFreePackTime) >= (24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen-safe">
      <div className={cn("space-responsive", isLoaded ? 'animate-fade-in' : 'opacity-0')}>
        
        {/* Header Section */}
        <div className="glass-card p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-headline font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                LootPacks
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Open packs to discover amazing deals and rewards!
              </p>
            </div>
            
            {/* User Stats */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="text-xl font-bold">{userStats.dealCoins}</span>
                </div>
                <p className="text-xs text-muted-foreground">DealCoins</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold mb-1">Lv. {userStats.level}</div>
                <Progress value={userStats.levelProgress} className="w-20 h-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Daily Streak Tracker */}
        {visibleSections.streak && (
          <Suspense fallback={<AuthLoader size="sm" />}>
            <DailyStreakTracker streak={userStats.dailyStreak} />
          </Suspense>
        )}

        {/* Special Events Banner */}
        <div className="glass-card p-4 mb-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-yellow-500" />
            <div>
              <h3 className="font-semibold">Double Rewards Weekend!</h3>
              <p className="text-sm text-muted-foreground">All packs contain 2x rewards until Sunday</p>
            </div>
          </div>
        </div>

        {/* Available Packs Grid */}
        {visibleSections.packs && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Available Packs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {availablePacks.map((pack, index) => (
                <Suspense key={pack.id} fallback={<AuthLoader size="sm" />}>
                  {pack.requiresAd ? (
                    <AdRequiredPackCard
                      pack={pack}
                      onSelect={handlePackSelect}
                      onWatchAd={handleWatchAd}
                      disabled={pack.type === 'free' && !canOpenFreePack}
                      cooldownText={pack.type === 'free' && !canOpenFreePack ? timeUntilFree : undefined}
                      adWatched={pack.id === '1' ? adWatchedForDailyPack : false}
                      animationDelay={index * 0.1}
                    />
                  ) : (
                    <LootPackCard
                      pack={pack}
                      onSelect={handlePackSelect}
                      disabled={pack.type === 'free' && !canOpenFreePack}
                      cooldownText={pack.type === 'free' && !canOpenFreePack ? timeUntilFree : undefined}
                      animationDelay={index * 0.1}
                    />
                  )}
                </Suspense>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-4 text-center">
            <Package2 className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{userStats.totalPacksOpened}</div>
            <p className="text-sm text-muted-foreground">Packs Opened</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Gift className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{userStats.dailyStreak}</div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">₹2,450</div>
            <p className="text-sm text-muted-foreground">Total Saved</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Crown className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">Elite</div>
            <p className="text-sm text-muted-foreground">Member Status</p>
          </div>
        </div>

        {/* Ad-based Earning Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Puzzle System */}
          {visibleSections.puzzle && (
            <Suspense fallback={<AuthLoader size="md" />}>
              <PuzzleSystem userId="user123" />
            </Suspense>
          )}

          {/* DealCoin Earning Widget */}
          {visibleSections.adEarning && (
            <Suspense fallback={<AuthLoader size="md" />}>
              <AdEarningWidget 
                userId="user123" 
                onCoinsEarned={handleCoinsEarned}
              />
            </Suspense>
          )}
        </div>

        {/* Rewards Inventory */}
        {visibleSections.inventory && shouldLoadHeavyComponents && (
          <Suspense fallback={<AuthLoader size="md" />}>
            <RewardsInventory />
          </Suspense>
        )}

        {/* Pack Opening Modal */}
        {isOpeningPack && selectedPack && (
          <Suspense fallback={<AuthLoader size="lg" />}>
            <PackOpeningModal
              pack={selectedPack}
              isOpen={isOpeningPack}
              onClose={() => {
                setIsOpeningPack(false);
                setSelectedPack(null);
              }}
              onRewardsRevealed={handlePackOpened}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
