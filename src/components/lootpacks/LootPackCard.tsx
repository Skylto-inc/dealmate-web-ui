"use client";

import { FC } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LootPackCardProps {
  pack: {
    id: string;
    name: string;
    type: 'free' | 'premium';
    description: string;
    icon: any;
    color: string;
    price?: number;
    available?: boolean;
    rewards: {
      min: number;
      max: number;
      possibleTypes: string[];
    };
  };
  onSelect: (pack: any) => void;
  disabled?: boolean;
  cooldownText?: string;
  animationDelay?: number;
}

const LootPackCard: FC<LootPackCardProps> = ({ 
  pack, 
  onSelect, 
  disabled = false,
  cooldownText,
  animationDelay = 0
}) => {
  const Icon = pack.icon;

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer",
        disabled && "opacity-60 cursor-not-allowed hover:scale-100",
        "animate-fade-in"
      )}
      style={{ animationDelay: `${animationDelay}s` }}
      onClick={() => !disabled && onSelect(pack)}
    >
      {/* Background Gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-20",
        pack.color
      )} />

      {/* Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-lg bg-background/50 backdrop-blur-sm">
            <Icon className="w-8 h-8" />
          </div>
          {pack.type === 'free' ? (
            <Badge variant="secondary" className="bg-green-500/20 text-green-500">
              FREE
            </Badge>
          ) : (
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="font-bold">{pack.price}</span>
            </div>
          )}
        </div>

        {/* Pack Info */}
        <h3 className="text-lg font-semibold mb-2">{pack.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{pack.description}</p>

        {/* Rewards Info */}
        <div className="text-xs text-muted-foreground mb-4">
          {pack.rewards.min}-{pack.rewards.max} rewards inside
        </div>

        {/* Action Button / Cooldown */}
        {cooldownText ? (
          <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-muted">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{cooldownText}</span>
          </div>
        ) : (
          <Button 
            className="w-full"
            variant={pack.type === 'free' ? 'default' : 'secondary'}
            disabled={disabled}
          >
            {pack.type === 'free' ? 'Open Free Pack' : `Buy for ${pack.price} DealCoins`}
          </Button>
        )}

        {/* Possible Rewards Types */}
        <div className="flex flex-wrap gap-1 mt-3">
          {pack.rewards.possibleTypes.map((type) => (
            <Badge key={type} variant="outline" className="text-xs">
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {/* Sparkle Effects */}
      <div className="absolute top-2 right-2 animate-pulse">
        <div className="w-1 h-1 bg-white rounded-full opacity-60" />
      </div>
      <div className="absolute bottom-4 left-4 animate-pulse" style={{ animationDelay: '0.5s' }}>
        <div className="w-1.5 h-1.5 bg-white rounded-full opacity-40" />
      </div>
    </Card>
  );
};

export default LootPackCard;
