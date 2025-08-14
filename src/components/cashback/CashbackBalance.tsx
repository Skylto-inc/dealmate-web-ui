'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Gift, 
  Banknote,
  Sparkles,
  Info,
  ChevronRight,
  Clock,
  TrendingUp
} from 'lucide-react';

interface CashbackSource {
  source: string;
  amount: number;
  percentage: number;
  icon: React.ReactNode;
  color: string;
}

export default function CashbackBalance() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const cashbackSources: CashbackSource[] = [
    { source: 'Credit Cards', amount: 5234, percentage: 42, icon: <CreditCard className="h-4 w-4" />, color: 'bg-blue-500' },
    { source: 'UPI Payments', amount: 2156, percentage: 25, icon: <Banknote className="h-4 w-4" />, color: 'bg-purple-500' },
    { source: 'Wallet Recharges', amount: 1876, percentage: 18, icon: <Wallet className="h-4 w-4" />, color: 'bg-green-500' },
    { source: 'Bill Payments', amount: 989, percentage: 10, icon: <ArrowUpRight className="h-4 w-4" />, color: 'bg-orange-500' },
    { source: 'Referrals', amount: 456, percentage: 5, icon: <Gift className="h-4 w-4" />, color: 'bg-pink-500' }
  ];

  const pendingCashbacks = [
    { merchant: 'Amazon', amount: 234, daysLeft: 3, status: 'Processing' },
    { merchant: 'Flipkart', amount: 156, daysLeft: 7, status: 'Confirmed' },
    { merchant: 'Swiggy', amount: 89, daysLeft: 1, status: 'Processing' },
    { merchant: 'Myntra', amount: 413, daysLeft: 15, status: 'Under Review' }
  ];

  const lifetimeStats = {
    totalEarned: 45678,
    totalRedeemed: 32221,
    avgMonthly: 2340,
    bestMonth: 4567,
    currentStreak: 23
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-green-500" />
            Cashback Balance
          </span>
          <Button variant="outline" size="sm">
            Withdraw <ArrowUpRight className="h-4 w-4 ml-1" />
          </Button>
        </CardTitle>
        <CardDescription>Track and manage your cashback earnings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Available Balance</p>
                <p className="text-2xl font-bold mt-1">₹3,456</p>
                <p className="text-xs text-muted-foreground mt-1">Ready to withdraw</p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Processing</p>
                <p className="text-2xl font-bold mt-1">₹892</p>
                <p className="text-xs text-muted-foreground mt-1">3-15 days</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Lifetime Earned</p>
                <p className="text-2xl font-bold mt-1">₹{lifetimeStats.totalEarned.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Since joining</p>
              </div>
            </div>

            {/* Cashback Sources Breakdown */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                Cashback Sources
                <Badge variant="secondary" className="text-xs">Last 30 days</Badge>
              </h4>
              <div className="space-y-3">
                {cashbackSources.map((source, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${source.color} text-white`}>
                      {source.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{source.source}</span>
                        <span className="text-sm font-semibold">₹{source.amount}</span>
                      </div>
                      <Progress value={source.percentage} className="h-2" />
                    </div>
                    <span className="text-xs text-muted-foreground">{source.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="justify-between">
                <span className="flex items-center gap-2">
                  <ArrowDownLeft className="h-4 w-4" />
                  Transfer to Bank
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="justify-between">
                <span className="flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Convert to Vouchers
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Pending Cashbacks</span>
              </div>
              <Badge variant="outline">₹{pendingCashbacks.reduce((acc, cb) => acc + cb.amount, 0)}</Badge>
            </div>
            
            <div className="space-y-3">
              {pendingCashbacks.map((cashback, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">{cashback.merchant}</h5>
                    <Badge 
                      variant={cashback.status === 'Confirmed' ? 'default' : 
                               cashback.status === 'Processing' ? 'secondary' : 'outline'}
                    >
                      {cashback.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {cashback.daysLeft} day{cashback.daysLeft > 1 ? 's' : ''} left
                    </span>
                    <span className="font-semibold text-green-600">₹{cashback.amount}</span>
                  </div>
                  <Progress value={(15 - cashback.daysLeft) / 15 * 100} className="h-1 mt-2" />
                </div>
              ))}
            </div>

            <div className="p-3 bg-muted/50 rounded-lg flex items-start gap-2">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Cashback typically takes 3-15 days to process depending on merchant confirmation.
                Confirmed cashbacks will be automatically added to your available balance.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Average Monthly</span>
                </div>
                <p className="text-2xl font-bold">₹{lifetimeStats.avgMonthly}</p>
                <p className="text-xs text-muted-foreground mt-1">Based on last 6 months</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Best Month</span>
                </div>
                <p className="text-2xl font-bold">₹{lifetimeStats.bestMonth}</p>
                <p className="text-xs text-muted-foreground mt-1">December 2024</p>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Current Earning Streak</span>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                  {lifetimeStats.currentStreak} days
                </Badge>
              </div>
              <Progress value={(lifetimeStats.currentStreak / 30) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Keep earning daily to maintain your streak and unlock bonus rewards!
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Cashback Milestones</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <span className="text-sm">First ₹1,000</span>
                  <Badge variant="secondary">Achieved</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <span className="text-sm">₹10,000 Club</span>
                  <Badge variant="secondary">Achieved</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <span className="text-sm">₹50,000 Elite</span>
                  <div className="flex items-center gap-2">
                    <Progress value={91} className="w-20 h-2" />
                    <span className="text-xs text-muted-foreground">91%</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
