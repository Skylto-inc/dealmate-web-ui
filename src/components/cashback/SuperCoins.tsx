'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Coins, 
  TrendingUp, 
  Gift, 
  ShoppingCart,
  ArrowRight,
  Clock,
  Sparkles,
  Trophy,
  Zap,
  Info,
  Plus,
  Minus,
  ArrowUpRight,
  Target
} from 'lucide-react';

interface CoinTransaction {
  id: string;
  type: 'earned' | 'spent' | 'expired';
  amount: number;
  description: string;
  date: string;
  icon: React.ReactNode;
}

interface RedeemOption {
  id: string;
  title: string;
  coinsRequired: number;
  value: string;
  category: string;
  stock: 'in_stock' | 'limited' | 'out_of_stock';
  icon: React.ReactNode;
}

export default function SuperCoins() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const coinBalance = 2845;
  const coinsExpiringSoon = 345;
  const totalEarned = 15678;
  const totalRedeemed = 12833;

  const recentTransactions: CoinTransaction[] = [
    {
      id: '1',
      type: 'earned',
      amount: 150,
      description: 'Amazon purchase cashback',
      date: '2025-01-24',
      icon: <Plus className="h-4 w-4" />
    },
    {
      id: '2',
      type: 'spent',
      amount: 500,
      description: 'Redeemed for ₹50 voucher',
      date: '2025-01-23',
      icon: <Minus className="h-4 w-4" />
    },
    {
      id: '3',
      type: 'earned',
      amount: 89,
      description: 'Daily check-in bonus',
      date: '2025-01-22',
      icon: <Plus className="h-4 w-4" />
    },
    {
      id: '4',
      type: 'expired',
      amount: 200,
      description: 'Coins expired (earned Dec 2023)',
      date: '2025-01-20',
      icon: <Clock className="h-4 w-4" />
    }
  ];

  const redeemOptions: RedeemOption[] = [
    {
      id: '1',
      title: '₹50 Amazon Voucher',
      coinsRequired: 500,
      value: '₹50',
      category: 'vouchers',
      stock: 'in_stock',
      icon: <Gift className="h-5 w-5" />
    },
    {
      id: '2',
      title: '₹100 Flipkart Coupon',
      coinsRequired: 1000,
      value: '₹100',
      category: 'vouchers',
      stock: 'limited',
      icon: <ShoppingCart className="h-5 w-5" />
    },
    {
      id: '3',
      title: '1 Month Netflix',
      coinsRequired: 2000,
      value: '₹199',
      category: 'subscriptions',
      stock: 'in_stock',
      icon: <Sparkles className="h-5 w-5" />
    },
    {
      id: '4',
      title: 'Cashback Boost 2x',
      coinsRequired: 1500,
      value: '7 days',
      category: 'boosters',
      stock: 'in_stock',
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: '5',
      title: 'Exclusive Gold Status',
      coinsRequired: 5000,
      value: '30 days',
      category: 'membership',
      stock: 'limited',
      icon: <Trophy className="h-5 w-5" />
    },
    {
      id: '6',
      title: 'Mystery Box',
      coinsRequired: 750,
      value: 'Up to ₹500',
      category: 'special',
      stock: 'limited',
      icon: <Star className="h-5 w-5" />
    }
  ];

  const earnMoreWays = [
    { title: 'Daily Check-in', coins: 10, frequency: 'Daily', icon: <Clock className="h-4 w-4" /> },
    { title: 'Complete Profile', coins: 100, frequency: 'One-time', icon: <Target className="h-4 w-4" /> },
    { title: 'Refer a Friend', coins: 250, frequency: 'Per referral', icon: <Users className="h-4 w-4" /> },
    { title: 'First Purchase', coins: 500, frequency: 'Monthly', icon: <ShoppingCart className="h-4 w-4" /> },
    { title: 'Review Purchase', coins: 50, frequency: 'Per review', icon: <Star className="h-4 w-4" /> },
    { title: 'Birthday Bonus', coins: 200, frequency: 'Yearly', icon: <Gift className="h-4 w-4" /> }
  ];

  const filteredRedeemOptions = redeemOptions.filter(option => 
    selectedCategory === 'all' || option.category === selectedCategory
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          SuperCoins
        </CardTitle>
        <CardDescription>
          Earn coins with every transaction and redeem for exciting rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Available Balance</span>
              <Coins className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold">{coinBalance.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">SuperCoins</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Expiring Soon</span>
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-orange-600">{coinsExpiringSoon}</p>
            <p className="text-xs text-muted-foreground mt-1">In next 30 days</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Lifetime Stats</span>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div>
                <p className="font-semibold text-green-600">+{totalEarned.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Earned</p>
              </div>
              <div>
                <p className="font-semibold text-red-600">-{totalRedeemed.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Spent</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="redeem">Redeem</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Coin Value Indicator */}
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold">Your SuperCoins Value</h4>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                  1 Coin = ₹0.10
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Progress value={75} className="h-3" />
                </div>
                <span className="text-lg font-bold">₹{(coinBalance * 0.10).toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                You can redeem coins for vouchers, subscriptions, and exclusive perks
              </p>
            </div>

            {/* Ways to Earn More */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                Earn More SuperCoins
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {earnMoreWays.map((way, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {way.icon}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{way.title}</p>
                          <p className="text-xs text-muted-foreground">{way.frequency}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-yellow-600">+{way.coins}</p>
                        <p className="text-xs text-muted-foreground">coins</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <Button className="flex-1" variant="outline">
                View All Rewards
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
              <Button className="flex-1">
                Earn More Coins
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="redeem" className="space-y-6">
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['all', 'vouchers', 'subscriptions', 'boosters', 'membership', 'special'].map((category) => (
                <Button
                  key={category}
                  size="sm"
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Redeem Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRedeemOptions.map((option) => (
                <div
                  key={option.id}
                  className={`p-4 border rounded-lg ${
                    coinBalance >= option.coinsRequired 
                      ? 'hover:shadow-md transition-all cursor-pointer' 
                      : 'opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {option.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{option.title}</h4>
                        <p className="text-sm text-muted-foreground">Value: {option.value}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        option.stock === 'in_stock' ? 'default' : 
                        option.stock === 'limited' ? 'secondary' : 'destructive'
                      }
                      className="text-xs"
                    >
                      {option.stock === 'in_stock' ? 'Available' : 
                       option.stock === 'limited' ? 'Limited' : 'Out of Stock'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-yellow-600" />
                      <span className="font-semibold">{option.coinsRequired} coins</span>
                    </div>
                    <Button 
                      size="sm"
                      disabled={coinBalance < option.coinsRequired || option.stock === 'out_of_stock'}
                    >
                      Redeem
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <p className="text-xs text-blue-600 dark:text-blue-400">
                SuperCoins are valid for 365 days from the date of earning. Redeem them before they expire!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {/* Recent Transactions */}
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'earned' ? 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400' :
                        transaction.type === 'spent' ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400' :
                        'bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400'
                      }`}>
                        {transaction.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className={`font-bold ${
                      transaction.type === 'earned' ? 'text-green-600' :
                      transaction.type === 'spent' ? 'text-red-600' :
                      'text-orange-600'
                    }`}>
                      {transaction.type === 'earned' ? '+' : '-'}{transaction.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full">
              View All Transactions
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Add missing import
import { Users } from 'lucide-react';
