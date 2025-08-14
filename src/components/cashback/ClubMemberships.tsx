'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Star, 
  Zap, 
  Shield, 
  Trophy,
  Gift,
  TrendingUp,
  Lock,
  Check,
  ArrowRight,
  Sparkles,
  Diamond,
  Award,
  Users,
  Percent,
  ShoppingBag,
  CreditCard,
  Info
} from 'lucide-react';

interface ClubTier {
  id: string;
  name: string;
  requiredSpend: number;
  cashbackBoost: number;
  color: string;
  icon: React.ReactNode;
  benefits: string[];
  exclusiveOffers: number;
}

interface ClubMembership {
  id: string;
  name: string;
  type: 'premium' | 'free';
  monthlyFee?: number;
  yearlyFee?: number;
  icon: React.ReactNode;
  color: string;
  benefits: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  stats: {
    members: string;
    avgSavings: number;
    satisfaction: number;
  };
}

export default function ClubMemberships() {
  const [selectedTab, setSelectedTab] = useState('current');
  const [selectedMembership, setSelectedMembership] = useState<string | null>(null);

  const currentTier = 'gold'; // Simulated current tier
  const currentSpend = 45000;
  const nextTierSpend = 50000;

  const tiers: ClubTier[] = [
    {
      id: 'bronze',
      name: 'Bronze',
      requiredSpend: 0,
      cashbackBoost: 1,
      color: 'bg-orange-600',
      icon: <Shield className="h-5 w-5" />,
      benefits: [
        'Base cashback rates',
        'Monthly cashback offers',
        'Transaction history',
        'Basic support'
      ],
      exclusiveOffers: 10
    },
    {
      id: 'silver',
      name: 'Silver',
      requiredSpend: 10000,
      cashbackBoost: 1.25,
      color: 'bg-gray-400',
      icon: <Star className="h-5 w-5" />,
      benefits: [
        '25% cashback boost',
        'Early access to sales',
        'Silver-only offers',
        'Priority support',
        'Quarterly bonus rewards'
      ],
      exclusiveOffers: 25
    },
    {
      id: 'gold',
      name: 'Gold',
      requiredSpend: 25000,
      cashbackBoost: 1.5,
      color: 'bg-yellow-500',
      icon: <Crown className="h-5 w-5" />,
      benefits: [
        '50% cashback boost',
        'Exclusive gold offers',
        'Free premium features',
        'Dedicated support',
        'Monthly surprise rewards',
        'Airport lounge access'
      ],
      exclusiveOffers: 50
    },
    {
      id: 'platinum',
      name: 'Platinum',
      requiredSpend: 50000,
      cashbackBoost: 2,
      color: 'bg-purple-600',
      icon: <Diamond className="h-5 w-5" />,
      benefits: [
        '2x cashback on all spends',
        'Platinum concierge',
        'Exclusive brand partnerships',
        'VIP customer support',
        'Complimentary subscriptions',
        'Special event invites',
        'Personalized offers'
      ],
      exclusiveOffers: 100
    }
  ];

  const clubMemberships: ClubMembership[] = [
    {
      id: 'dealmate_club',
      name: 'DealMate Club',
      type: 'free',
      icon: <Trophy className="h-6 w-6" />,
      color: 'from-blue-500 to-purple-600',
      benefits: [
        {
          title: 'Tier-based Rewards',
          description: 'Unlock higher cashback as you spend more',
          icon: <TrendingUp className="h-4 w-4" />
        },
        {
          title: 'Exclusive Offers',
          description: 'Access to members-only deals',
          icon: <Gift className="h-4 w-4" />
        },
        {
          title: 'Priority Support',
          description: '24/7 dedicated customer service',
          icon: <Shield className="h-4 w-4" />
        }
      ],
      stats: {
        members: '2.5M+',
        avgSavings: 3500,
        satisfaction: 94
      }
    },
    {
      id: 'elite_plus',
      name: 'Elite Plus',
      type: 'premium',
      monthlyFee: 299,
      yearlyFee: 2999,
      icon: <Diamond className="h-6 w-6" />,
      color: 'from-purple-600 to-pink-600',
      benefits: [
        {
          title: '5X Cashback',
          description: 'On all categories, no limits',
          icon: <Percent className="h-4 w-4" />
        },
        {
          title: 'Complimentary Services',
          description: 'Free Netflix, Prime, and more',
          icon: <Sparkles className="h-4 w-4" />
        },
        {
          title: 'Luxury Benefits',
          description: 'Golf, spa, fine dining privileges',
          icon: <Award className="h-4 w-4" />
        },
        {
          title: 'Travel Perks',
          description: 'Lounge access, hotel upgrades',
          icon: <Zap className="h-4 w-4" />
        }
      ],
      stats: {
        members: '150K+',
        avgSavings: 12000,
        satisfaction: 98
      }
    },
    {
      id: 'savings_circle',
      name: 'Savings Circle',
      type: 'premium',
      monthlyFee: 99,
      yearlyFee: 999,
      icon: <Users className="h-6 w-6" />,
      color: 'from-green-500 to-teal-600',
      benefits: [
        {
          title: 'Group Buying Power',
          description: 'Better deals with community purchases',
          icon: <Users className="h-4 w-4" />
        },
        {
          title: '3X Base Cashback',
          description: 'Triple rewards on all spends',
          icon: <TrendingUp className="h-4 w-4" />
        },
        {
          title: 'Flash Deals',
          description: 'Hourly exclusive offers',
          icon: <Zap className="h-4 w-4" />
        }
      ],
      stats: {
        members: '500K+',
        avgSavings: 5500,
        satisfaction: 92
      }
    }
  ];

  const currentTierData = tiers.find(t => t.id === currentTier);
  const progressToNextTier = ((currentSpend - (currentTierData?.requiredSpend || 0)) / 
    (nextTierSpend - (currentTierData?.requiredSpend || 0))) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Club Memberships & Tiers
        </CardTitle>
        <CardDescription>
          Unlock exclusive benefits and maximize your cashback rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Your Status</TabsTrigger>
            <TabsTrigger value="tiers">Tier Benefits</TabsTrigger>
            <TabsTrigger value="clubs">Premium Clubs</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            {/* Current Tier Status */}
            <div className="p-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${currentTierData?.color} text-white`}>
                    {currentTierData?.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{currentTierData?.name} Member</h3>
                    <p className="text-sm text-muted-foreground">
                      {currentTierData?.cashbackBoost}x cashback multiplier active
                    </p>
                  </div>
                </div>
                <Badge className="text-lg px-4 py-2" variant="secondary">
                  ₹{currentSpend.toLocaleString()} spent
                </Badge>
              </div>

              {/* Progress to Next Tier */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress to Platinum</span>
                  <span className="font-semibold">₹{(nextTierSpend - currentSpend).toLocaleString()} to go</span>
                </div>
                <Progress value={progressToNextTier} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  Spend ₹{(nextTierSpend - currentSpend).toLocaleString()} more to unlock Platinum benefits
                </p>
              </div>
            </div>

            {/* Current Benefits */}
            <div>
              <h4 className="font-semibold mb-3">Your Current Benefits</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentTierData?.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Percent className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{currentTierData?.cashbackBoost}x</p>
                <p className="text-xs text-muted-foreground">Cashback Multiplier</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Gift className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">{currentTierData?.exclusiveOffers}</p>
                <p className="text-xs text-muted-foreground">Exclusive Offers</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">₹2,340</p>
                <p className="text-xs text-muted-foreground">This Month's Boost</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tiers" className="space-y-4">
            {/* Tiers Comparison */}
            <div className="space-y-4">
              {tiers.map((tier, index) => (
                <div
                  key={tier.id}
                  className={`p-4 border rounded-lg ${
                    tier.id === currentTier ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${tier.color} text-white`}>
                        {tier.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {tier.name}
                          {tier.id === currentTier && (
                            <Badge variant="secondary" className="text-xs">Current</Badge>
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {tier.requiredSpend > 0 
                            ? `Spend ₹${tier.requiredSpend.toLocaleString()}+ per year`
                            : 'Entry level'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{tier.cashbackBoost}x</p>
                      <p className="text-xs text-muted-foreground">Cashback Boost</p>
                    </div>
                  </div>

                  {/* Benefits List */}
                  <div className="space-y-1">
                    {tier.benefits.slice(0, 3).map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-3 w-3 text-green-500" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                    {tier.benefits.length > 3 && (
                      <p className="text-xs text-muted-foreground ml-5">
                        +{tier.benefits.length - 3} more benefits
                      </p>
                    )}
                  </div>

                  {tier.id !== currentTier && tier.requiredSpend > currentSpend && (
                    <div className="mt-3 pt-3 border-t">
                      <Button size="sm" variant="outline" className="w-full">
                        <Lock className="h-3 w-3 mr-1" />
                        Spend ₹{(tier.requiredSpend - currentSpend).toLocaleString()} more to unlock
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Tier Comparison Chart */}
            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border">
              <h4 className="text-sm font-semibold mb-2">Why Upgrade Your Tier?</h4>
              <p className="text-xs text-muted-foreground mb-3">
                See how much more you could save with higher tiers
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>On ₹10,000 spend:</span>
                  <div className="flex gap-4">
                    <span className="text-muted-foreground">Bronze: ₹300</span>
                    <span className="font-semibold text-green-600">Platinum: ₹600</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>On ₹50,000 spend:</span>
                  <div className="flex gap-4">
                    <span className="text-muted-foreground">Bronze: ₹1,500</span>
                    <span className="font-semibold text-green-600">Platinum: ₹3,000</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="clubs" className="space-y-4">
            {/* Premium Club Memberships */}
            <div className="space-y-4">
              {clubMemberships.map((club) => (
                <div
                  key={club.id}
                  className={`p-6 border rounded-lg ${
                    selectedMembership === club.id ? 'border-primary' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${club.color} text-white`}>
                        {club.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                          {club.name}
                          {club.type === 'premium' && (
                            <Badge className="text-xs">Premium</Badge>
                          )}
                        </h4>
                        {club.monthlyFee && (
                          <p className="text-sm text-muted-foreground">
                            ₹{club.monthlyFee}/month or ₹{club.yearlyFee}/year
                          </p>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant={selectedMembership === club.id ? "default" : "outline"}
                      onClick={() => setSelectedMembership(club.id)}
                    >
                      {club.type === 'free' ? 'Enrolled' : 'Join Now'}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>

                  {/* Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {club.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="p-1.5 bg-primary/10 rounded">
                          {benefit.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{benefit.title}</p>
                          <p className="text-xs text-muted-foreground">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{club.stats.members} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span>Avg. ₹{club.stats.avgSavings}/month saved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span>{club.stats.satisfaction}% satisfaction</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  <p className="font-semibold mb-1">Premium Club Benefits</p>
                  <p className="text-xs">
                    Premium memberships offer enhanced cashback rates, exclusive perks, and 
                    complimentary services that often exceed the membership cost in value.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
