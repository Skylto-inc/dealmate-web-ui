'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentLoader } from '@/components/ui/animated-loader';
import { 
  Star, 
  Trophy, 
  Zap, 
  Gift, 
  Plus, 
  ExternalLink,
  TrendingUp,
  Coffee,
  Plane,
  ShoppingBag,
  CreditCard,
  Sparkles
} from 'lucide-react';

interface RewardProgram {
  id: string;
  name: string;
  type: string;
  pointsName: string;
  balance: {
    points: number;
    dollarValue: number;
    tier: string;
  };
  icon: any;
  color: string;
  benefits: string[];
  nextTierProgress?: {
    current: number;
    required: number;
    nextTier: string;
  };
}

interface RewardOpportunity {
  programId: string;
  programName: string;
  merchant: string;
  potentialReward: number;
  potentialPoints: number;
  multiplier: number;
  validUntil: string;
}

export default function RewardsDashboard() {
  const [connectedPrograms, setConnectedPrograms] = useState<RewardProgram[]>([]);
  const [availablePrograms, setAvailablePrograms] = useState<RewardProgram[]>([]);
  const [opportunities, setOpportunities] = useState<RewardOpportunity[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);

  const programIcons = {
    coffee: Coffee,
    airline: Plane,
    retail: ShoppingBag,
    ecommerce: ShoppingBag,
    credit: CreditCard,
    hotel: Trophy,
    beauty: Sparkles,
    sports: Trophy
  };

  useEffect(() => {
    loadRewardsData();
  }, []);

  const loadRewardsData = async () => {
    setLoading(true);
    
    // Mock data - in real app, fetch from API
    const mockConnectedPrograms: RewardProgram[] = [
      {
        id: 'starbucks',
        name: 'Starbucks Rewards',
        type: 'coffee',
        pointsName: 'Stars',
        balance: { points: 1250, dollarValue: 50, tier: 'Gold Star' },
        icon: Coffee,
        color: 'from-green-600 to-green-700',
        benefits: ['Free drinks', 'Birthday rewards', 'Mobile ordering'],
        nextTierProgress: { current: 1250, required: 2000, nextTier: 'Platinum' }
      },
      {
        id: 'delta',
        name: 'Delta SkyMiles',
        type: 'airline',
        pointsName: 'Miles',
        balance: { points: 25000, dollarValue: 300, tier: 'Silver Medallion' },
        icon: Plane,
        color: 'from-blue-600 to-blue-700',
        benefits: ['Priority boarding', 'Free checked bags', 'Upgrades'],
        nextTierProgress: { current: 25000, required: 50000, nextTier: 'Gold Medallion' }
      },
      {
        id: 'amazon',
        name: 'Amazon Prime',
        type: 'ecommerce',
        pointsName: 'Prime Points',
        balance: { points: 5000, dollarValue: 50, tier: 'Prime' },
        icon: ShoppingBag,
        color: 'from-orange-600 to-orange-700',
        benefits: ['Free shipping', 'Prime Video', 'Exclusive deals']
      },
      {
        id: 'chase',
        name: 'Chase Ultimate Rewards',
        type: 'credit',
        pointsName: 'Points',
        balance: { points: 75000, dollarValue: 937.50, tier: 'Sapphire' },
        icon: CreditCard,
        color: 'from-purple-600 to-purple-700',
        benefits: ['Transfer partners', 'Travel portal', 'Purchase protection']
      }
    ];

    const mockAvailablePrograms: RewardProgram[] = [
      {
        id: 'marriott',
        name: 'Marriott Bonvoy',
        type: 'hotel',
        pointsName: 'Points',
        balance: { points: 0, dollarValue: 0, tier: 'Member' },
        icon: Trophy,
        color: 'from-red-600 to-red-700',
        benefits: ['Room upgrades', 'Late checkout', 'Free WiFi']
      },
      {
        id: 'sephora',
        name: 'Sephora Beauty Insider',
        type: 'beauty',
        pointsName: 'Beauty Points',
        balance: { points: 0, dollarValue: 0, tier: 'Insider' },
        icon: Sparkles,
        color: 'from-pink-600 to-pink-700',
        benefits: ['Product samples', 'Birthday gifts', 'Exclusive events']
      }
    ];

    const mockOpportunities: RewardOpportunity[] = [
      {
        programId: 'starbucks',
        programName: 'Starbucks',
        merchant: 'Starbucks',
        potentialReward: 8.0,
        potentialPoints: 200,
        multiplier: 2,
        validUntil: '2024-07-31'
      },
      {
        programId: 'delta',
        programName: 'Delta SkyMiles',
        merchant: 'Hotels.com',
        potentialReward: 15.0,
        potentialPoints: 1250,
        multiplier: 3,
        validUntil: '2024-08-15'
      }
    ];

    setConnectedPrograms(mockConnectedPrograms);
    setAvailablePrograms(mockAvailablePrograms);
    setOpportunities(mockOpportunities);
    
    const total = mockConnectedPrograms.reduce((sum, program) => 
      sum + program.balance.dollarValue, 0
    );
    setTotalValue(total);
    
    setLoading(false);
  };

  const connectProgram = async (programId: string) => {
    // Mock connection process
    const programToConnect = availablePrograms.find(p => p.id === programId);
    if (programToConnect) {
      setConnectedPrograms(prev => [...prev, programToConnect]);
      setAvailablePrograms(prev => prev.filter(p => p.id !== programId));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPoints = (points: number) => {
    return new Intl.NumberFormat('en-US').format(points);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center space-y-8">
        <PaymentLoader size="lg" />
        <div className="space-y-6 animate-pulse opacity-30 w-full max-w-7xl px-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rewards Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your loyalty programs and maximize rewards
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totalValue)}
          </div>
          <div className="text-sm text-muted-foreground">Total Value</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{connectedPrograms.length}</div>
                <div className="text-sm text-muted-foreground">Connected Programs</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">
                  {formatPoints(connectedPrograms.reduce((sum, p) => sum + p.balance.points, 0))}
                </div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{opportunities.length}</div>
                <div className="text-sm text-muted-foreground">Active Opportunities</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {formatCurrency(opportunities.reduce((sum, o) => sum + o.potentialReward, 0))}
                </div>
                <div className="text-sm text-muted-foreground">Potential Rewards</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="programs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="programs">My Programs</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="available">Connect New</TabsTrigger>
        </TabsList>

        {/* Connected Programs */}
        <TabsContent value="programs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {connectedPrograms.map((program) => {
              const IconComponent = program.icon;
              return (
                <Card key={program.id} className="overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${program.color}`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${program.color}`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{program.name}</CardTitle>
                          <Badge variant="secondary">{program.balance.tier}</Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold">
                          {formatPoints(program.balance.points)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {program.pointsName} • {formatCurrency(program.balance.dollarValue)}
                        </div>
                      </div>
                    </div>

                    {program.nextTierProgress && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress to {program.nextTierProgress.nextTier}</span>
                          <span>
                            {formatPoints(program.nextTierProgress.current)} / {formatPoints(program.nextTierProgress.required)}
                          </span>
                        </div>
                        <Progress 
                          value={(program.nextTierProgress.current / program.nextTierProgress.required) * 100}
                          className="h-2"
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="text-sm font-medium">Benefits:</div>
                      <div className="flex flex-wrap gap-1">
                        {program.benefits.map((benefit, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Opportunities */}
        <TabsContent value="opportunities" className="space-y-4">
          {opportunities.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No opportunities right now</h3>
                <p className="text-muted-foreground">
                  Keep shopping with DealMate to discover new reward opportunities!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opportunity, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                          <Zap className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{opportunity.programName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {opportunity.merchant} • {opportunity.multiplier}x multiplier
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          +{formatPoints(opportunity.potentialPoints)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(opportunity.potentialReward)} value
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <Badge variant="outline">
                        Valid until {new Date(opportunity.validUntil).toLocaleDateString()}
                      </Badge>
                      <Button size="sm">
                        Activate Offer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Available Programs */}
        <TabsContent value="available">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePrograms.map((program) => {
              const IconComponent = program.icon;
              return (
                <Card key={program.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${program.color}`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{program.name}</CardTitle>
                        <CardDescription className="capitalize">{program.type}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Benefits:</div>
                      <div className="space-y-1">
                        {program.benefits.map((benefit, index) => (
                          <div key={index} className="text-sm text-muted-foreground">
                            • {benefit}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={() => connectProgram(program.id)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Connect Program
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
