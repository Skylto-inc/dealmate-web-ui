"use client";

import { FC, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Coins, Play, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdRequiredPackCardProps {
  pack: {
    id: string;
    name: string;
    type: 'free' | 'premium';
    description: string;
    icon: any;
    color: string;
    price?: number;
    available?: boolean;
    requiresAd?: boolean;
    rewards: {
      min: number;
      max: number;
      possibleTypes: string[];
    };
  };
  onSelect: (pack: any) => void;
  onWatchAd: (pack: any) => void;
  disabled?: boolean;
  cooldownText?: string;
  adWatched?: boolean;
  animationDelay?: number;
}

const AdRequiredPackCard: FC<AdRequiredPackCardProps> = ({ 
  pack, 
  onSelect, 
  onWatchAd,
  disabled = false,
  cooldownText,
  adWatched = false,
  animationDelay = 0
}) => {
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adCompleted, setAdCompleted] = useState(adWatched);
  const Icon = pack.icon;

  const handleAdWatch = () => {
    setIsWatchingAd(true);
    onWatchAd(pack);
    
    // Mock ad completion - in real app this would be handled by ad provider
    setTimeout(() => {
      setIsWatchingAd(false);
      setAdCompleted(true);
    }, 3000);
  };

  const handlePackOpen = () => {
    if (pack.requiresAd && !adCompleted) {
      handleAdWatch();
    } else {
      onSelect(pack);
    }
  };

  const getButtonContent = () => {
    if (cooldownText) {
      return (
        <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-muted">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">{cooldownText}</span>
        </div>
      );
    }

    if (isWatchingAd) {
      return (
        <Button className="w-full" disabled>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Watching Ad...</span>
          </div>
        </Button>
      );
    }

    if (pack.type === 'free') {
      if (pack.requiresAd && !adCompleted) {
        return (
          <Button 
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            disabled={disabled}
          >
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              <span>Watch an Ad</span>
            </div>
          </Button>
        );
      } else {
        return (
          <Button 
            className="w-full"
            variant="default"
            disabled={disabled}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Open Free Pack</span>
            </div>
          </Button>
        );
      }
    } else {
      return (
        <Button 
          className="w-full"
          variant="secondary"
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4" />
            <span>Buy for {pack.price} DealCoins</span>
          </div>
        </Button>
      );
    }
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer",
        disabled && "opacity-60 cursor-not-allowed hover:scale-100",
        pack.requiresAd && !adCompleted && "ring-2 ring-green-500/30",
        "animate-fade-in"
      )}
      style={{ animationDelay: `${animationDelay}s` }}
      onClick={() => !disabled && handlePackOpen()}
    >
      {/* Background Gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-20",
        pack.color
      )} />

      {/* Ad Required Indicator */}
      {pack.requiresAd && !adCompleted && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-green-500/90 text-white border-0">
            <Play className="w-3 h-3 mr-1" />
            Watch an Ad
          </Badge>
        </div>
      )}

      {/* Ad Completed Indicator */}
      {pack.requiresAd && adCompleted && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-green-600/90 text-white border-0">
            <Zap className="w-3 h-3 mr-1" />
            Ready!
          </Badge>
        </div>
      )}

      {/* Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-lg bg-background/50 backdrop-blur-sm">
            <Icon className="w-8 h-8" />
          </div>
          {pack.type === 'premium' && (
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="font-bold">{pack.price}</span>
            </div>
          )}
        </div>

        {/* Pack Info */}
        <h3 className="text-lg font-semibold mb-2">{pack.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{pack.description}</p>

        {/* FREE badge moved down to avoid overlap */}
        {pack.type === 'free' && (
          <div className="mb-3">
            <Badge variant="secondary" className="bg-green-500/20 text-green-500">
              FREE
            </Badge>
          </div>
        )}

        {/* Rewards Info */}
        <div className="text-xs text-muted-foreground mb-4">
          {pack.rewards.min}-{pack.rewards.max} rewards inside
          {pack.requiresAd && !adCompleted && (
            <div className="text-green-600 font-medium mt-1">
              + Bonus rewards for watching ad!
            </div>
          )}
        </div>

        {/* Action Button / Cooldown */}
        <div onClick={(e) => e.stopPropagation()}>
          {getButtonContent()}
        </div>

        {/* Possible Rewards Types */}
        <div className="flex flex-wrap gap-1 mt-3">
          {pack.rewards.possibleTypes.map((type) => (
            <Badge key={type} variant="outline" className="text-xs">
              {type}
            </Badge>
          ))}
        </div>

        {/* Ad Benefits */}
        {pack.requiresAd && (
          <div className="mt-3 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="text-xs text-green-600 dark:text-green-400 font-medium">
              🎁 Watch ad for bonus rewards & extra DealCoins!
            </div>
          </div>
        )}
      </div>

      {/* Sparkle Effects */}
      <div className="absolute top-2 left-2 animate-pulse">
        <div className="w-1 h-1 bg-white rounded-full opacity-60" />
      </div>
      <div className="absolute bottom-4 right-4 animate-pulse" style={{ animationDelay: '0.5s' }}>
        <div className="w-1.5 h-1.5 bg-white rounded-full opacity-40" />
      </div>
    </Card>
  );
};

export default AdRequiredPackCard;
