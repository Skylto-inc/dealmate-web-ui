'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  Gift, 
  Target,
  Zap,
  Medal,
  Award,
  Crown,
  ChevronRight,
  Lock,
  Check,
  Sparkles
} from 'lucide-react';

interface RewardTier {
  level: number;
  name: string;
  pointsRequired: number;
  badge: React.ReactNode;
  color: string;
  rewards: {
    title: string;
    value: string;
    icon: React.ReactNode;
  }[];
  perks: string[];
}

export default function RewardsTiers() {
  const [expandedTier, setExpandedTier] = useState<number | null>(null);
  
  const currentPoints = 2845; // Simulated current points
  const currentLevel = 2; // Silver tier
  
  const rewardTiers: RewardTier[] = [
    {
      level: 1,
      name: 'Bronze',
      pointsRequired: 0,
      badge: <Medal className="h-6 w-6" />,
      color: 'from-orange-600 to-orange-700',
      rewards: [
        { title: 'Base Cashback', value: '2%', icon: <Percent className="h-4 w-4" /> },
        { title: 'Monthly Voucher', value: '₹50', icon: <Gift className="h-4 w-4" /> },
        { title: 'Birthday Bonus', value: '2x Points', icon: <Star className="h-4 w-4" /> }
      ],
      perks: [
        'Access to deals feed',
        'Basic customer support',
        'Transaction tracking'
      ]
    },
    {
      level: 2,
      name: 'Silver',
      pointsRequired: 1000,
      badge: <Award className="h-6 w-6" />,
      color: 'from-gray-400 to-gray-500',
      rewards: [
        { title: 'Enhanced Cashback', value: '3%', icon: <Percent className="h-4 w-4" /> },
        { title: 'Monthly Voucher', value: '₹100', icon: <Gift className="h-4 w-4" /> },
        { title: 'Referral Bonus', value: '₹150', icon: <Users className="h-4 w-4" /> }
      ],
      perks: [
        'Early access to sales',
        'Priority customer support',
        'Exclusive silver deals',
        'Free shipping on orders'
      ]
    },
    {
      level: 3,
      name: 'Gold',
      pointsRequired: 5000,
      badge: <Crown className="h-6 w-6" />,
      color: 'from-yellow-500 to-yellow-600',
      rewards: [
        { title: 'Premium Cashback', value: '5%', icon: <Percent className="h-4 w-4" /> },
        { title: 'Monthly Voucher', value: '₹250', icon: <Gift className="h-4 w-4" /> },
        { title: 'Surprise Rewards', value: 'Monthly', icon: <Sparkles className="h-4 w-4" /> }
      ],
      perks: [
        'VIP sale access',
        'Dedicated account manager',
        'Gold-exclusive brands',
        'Premium support 24/7',
        'Complimentary services'
      ]
    },
    {
      level: 4,
      name: 'Platinum',
      pointsRequired: 10000,
      badge: <Trophy className="h-6 w-6" />,
      color: 'from-purple-600 to-purple-700',
      rewards: [
        { title: 'Max Cashback', value: '7%', icon: <Percent className="h-4 w-4" /> },
        { title: 'Monthly Voucher', value: '₹500', icon: <Gift className="h-4 w-4" /> },
        { title: 'Luxury Perks', value: 'Unlimited', icon: <Diamond className="h-4 w-4" /> }
      ],
      perks: [
        'Concierge service',
        'Exclusive event invites',
        'Premium brand access',
        'Complimentary memberships',
        'Personal shopping assistant',
        'Airport lounge access'
      ]
    }
  ];

  const currentTier = rewardTiers.find(tier => tier.level === currentLevel);
  const nextTier = rewardTiers.find(tier => tier.level === currentLevel + 1);
  const progressToNext = nextTier 
    ? ((currentPoints - (currentTier?.pointsRequired || 0)) / 
       (nextTier.pointsRequired - (currentTier?.pointsRequired || 0))) * 100
    : 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-purple-500" />
          Rewards Tiers
        </CardTitle>
        <CardDescription>
          Earn points with every transaction and unlock exclusive benefits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full bg-gradient-to-r ${currentTier?.color} text-white`}>
                {currentTier?.badge}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{currentTier?.name} Member</h3>
                <p className="text-sm text-muted-foreground">{currentPoints} points earned</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Next tier in</p>
              <p className="font-semibold">
                {nextTier ? `${nextTier.pointsRequired - currentPoints} points` : 'Max tier reached'}
              </p>
            </div>
          </div>
          {nextTier && (
            <div className="space-y-1">
              <Progress value={progressToNext} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {progressToNext.toFixed(0)}% to {nextTier.name}
              </p>
            </div>
          )}
        </div>

        {/* Tiers List */}
        <div className="space-y-3">
          {rewardTiers.map((tier) => {
            const isCurrentTier = tier.level === currentLevel;
            const isUnlocked = tier.level <= currentLevel;
            const isExpanded = expandedTier === tier.level;

            return (
              <div
                key={tier.level}
                className={`border rounded-lg transition-all ${
                  isCurrentTier ? 'border-primary shadow-sm' : ''
                }`}
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedTier(isExpanded ? null : tier.level)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${tier.color} text-white`}>
                        {tier.badge}
                      </div>
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {tier.name}
                          {isCurrentTier && (
                            <Badge variant="secondary" className="text-xs">Current</Badge>
                          )}
                          {!isUnlocked && (
                            <Lock className="h-3 w-3 text-muted-foreground" />
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {tier.pointsRequired.toLocaleString()} points required
                        </p>
                      </div>
                    </div>
                    <ChevronRight 
                      className={`h-5 w-5 text-muted-foreground transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </div>

                  {/* Quick Rewards Preview */}
                  <div className="mt-3 flex gap-4">
                    {tier.rewards.map((reward, index) => (
                      <div key={index} className="flex items-center gap-1 text-sm">
                        {reward.icon}
                        <span className="font-semibold">{reward.value}</span>
                        <span className="text-muted-foreground">{reward.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 space-y-4 border-t">
                    <div>
                      <h5 className="text-sm font-semibold mb-2">Exclusive Perks</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {tier.perks.map((perk, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {!isUnlocked && (
                      <div className="pt-3 border-t">
                        <Button variant="outline" className="w-full" disabled>
                          <Lock className="h-4 w-4 mr-2" />
                          Earn {(tier.pointsRequired - currentPoints).toLocaleString()} more points to unlock
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* How to Earn Points */}
        <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            How to Earn Points Faster
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Target className="h-3 w-3" />
              <span>Complete daily challenges</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3" />
              <span>Shop during 2x point events</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="h-3 w-3" />
              <span>Refer friends for bonus points</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-3 w-3" />
              <span>Leave product reviews</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Add missing imports
import { Percent, Users, Diamond } from 'lucide-react';
