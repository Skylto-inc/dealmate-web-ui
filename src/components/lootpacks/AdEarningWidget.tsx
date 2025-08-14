"use client";

import { FC, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Play, Clock, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AdEarningStats {
  todayEarned: number;
  todayLimit: number;
  totalEarned: number;
  nextAdAvailableAt: string | null;
  dealCoins: number;
}

interface AdEarningWidgetProps {
  userId: string;
  onCoinsEarned?: (amount: number) => void;
  className?: string;
}

const AdEarningWidget: FC<AdEarningWidgetProps> = ({ userId, onCoinsEarned, className }) => {
  const [stats, setStats] = useState<AdEarningStats>({
    todayEarned: 0,
    todayLimit: 10,
    totalEarned: 0,
    nextAdAvailableAt: null,
    dealCoins: 500,
  });
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [recentEarning, setRecentEarning] = useState<number | null>(null);

  const COINS_PER_AD = 25;
  const COOLDOWN_MINUTES = 30;

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem(`ad_earning_stats_${userId}`);
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      setStats(parsed);
      
      // Check if it's a new day
      const lastEarnDate = localStorage.getItem(`ad_earning_date_${userId}`);
      const today = new Date().toDateString();
      if (lastEarnDate !== today) {
        setStats(prev => ({ ...prev, todayEarned: 0 }));
        localStorage.setItem(`ad_earning_date_${userId}`, today);
      }
    }

    // Check cooldown
    const lastAdTime = localStorage.getItem(`last_ad_time_${userId}`);
    if (lastAdTime) {
      const timePassed = Date.now() - parseInt(lastAdTime);
      const cooldownTime = COOLDOWN_MINUTES * 60 * 1000;
      if (timePassed < cooldownTime) {
        setCooldownRemaining(Math.ceil((cooldownTime - timePassed) / 1000));
      }
    }
  }, [userId]);

  // Cooldown timer
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setTimeout(() => setCooldownRemaining(cooldownRemaining - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownRemaining]);

  // Ad watching countdown
  useEffect(() => {
    if (isWatchingAd && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isWatchingAd && countdown === 0) {
      handleAdComplete();
    }
  }, [isWatchingAd, countdown]);

  const handleWatchAd = () => {
    if (stats.todayEarned >= stats.todayLimit || cooldownRemaining > 0) {
      return;
    }
    
    setIsWatchingAd(true);
    setCountdown(20); // 20 second mock ad
  };

  const handleAdComplete = () => {
    setIsWatchingAd(false);
    
    const newStats = {
      ...stats,
      todayEarned: stats.todayEarned + 1,
      totalEarned: stats.totalEarned + COINS_PER_AD,
      dealCoins: stats.dealCoins + COINS_PER_AD,
    };

    setStats(newStats);
    setRecentEarning(COINS_PER_AD);
    setCooldownRemaining(COOLDOWN_MINUTES * 60);

    // Save to localStorage
    localStorage.setItem(`ad_earning_stats_${userId}`, JSON.stringify(newStats));
    localStorage.setItem(`last_ad_time_${userId}`, Date.now().toString());
    localStorage.setItem(`ad_earning_date_${userId}`, new Date().toDateString());

    // Notify parent component
    onCoinsEarned?.(COINS_PER_AD);

    // Clear recent earning animation after delay
    setTimeout(() => setRecentEarning(null), 3000);
  };

  const canWatchAd = stats.todayEarned < stats.todayLimit && cooldownRemaining === 0 && !isWatchingAd;
  const dailyProgress = (stats.todayEarned / stats.todayLimit) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBadgeVariant = () => {
    if (stats.todayEarned >= stats.todayLimit) return "secondary";
    if (cooldownRemaining > 0) return "outline";
    return "default";
  };

  const getButtonText = () => {
    if (isWatchingAd) return "Watching Ad...";
    if (stats.todayEarned >= stats.todayLimit) return "Daily Limit Reached";
    if (cooldownRemaining > 0) return `Wait ${formatTime(cooldownRemaining)}`;
    return `Watch Ad (+${COINS_PER_AD} DealCoins)`;
  };

  return (
    <Card className={cn("p-6 relative overflow-hidden", className)}>
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-orange-400/5" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Earn DealCoins</h3>
              <p className="text-sm text-muted-foreground">Watch ads to earn coins</p>
            </div>
          </div>
          <Badge variant={getBadgeVariant()}>
            {stats.todayEarned} / {stats.todayLimit} today
          </Badge>
        </div>

        {/* Current DealCoins Display */}
        <div className="mb-4 p-3 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Your DealCoins</span>
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="text-xl font-bold">{stats.dealCoins.toLocaleString()}</span>
              <AnimatePresence>
                {recentEarning && (
                  <motion.span
                    initial={{ opacity: 0, y: -10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    className="text-green-500 font-bold"
                  >
                    +{recentEarning}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="text-2xl font-bold text-yellow-600">{COINS_PER_AD}</div>
            <div className="text-xs text-muted-foreground">Coins per ad</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="text-2xl font-bold text-green-600">{stats.totalEarned}</div>
            <div className="text-xs text-muted-foreground">Total earned</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Daily Progress</span>
            <span className="text-sm text-muted-foreground">
              {stats.todayEarned * COINS_PER_AD} / {stats.todayLimit * COINS_PER_AD} coins
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${dailyProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Watch Ad Button or Ad Player */}
        {isWatchingAd ? (
          <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <div className="mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center"
              >
                <Play className="w-8 h-8 text-primary" />
              </motion.div>
            </div>
            <h4 className="font-semibold mb-2">Advertisement Playing</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Please wait {countdown} seconds to earn your coins
            </p>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((20 - countdown) / 20) * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        ) : (
          <Button
            onClick={handleWatchAd}
            disabled={!canWatchAd}
            className="w-full"
            size="lg"
          >
            {canWatchAd ? (
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span>{getButtonText()}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {cooldownRemaining > 0 ? (
                  <Clock className="w-5 h-5" />
                ) : (
                  <TrendingUp className="w-5 h-5" />
                )}
                <span>{getButtonText()}</span>
              </div>
            )}
          </Button>
        )}

        {/* Bonus Messages */}
        <AnimatePresence>
          {stats.todayEarned >= stats.todayLimit && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 text-center p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
            >
              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Daily goal achieved! Come back tomorrow for more!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {recentEarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mt-3 text-center p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
          >
            <div className="flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-400">
              <Coins className="w-4 h-4" />
              <span className="font-medium">Great! You earned {recentEarning} DealCoins!</span>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

export default AdEarningWidget;
