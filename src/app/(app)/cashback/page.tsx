'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, Gift, Calculator, History, AlertCircle, ArrowRight, Trophy, Target, Zap, Crown, Shield, Star } from 'lucide-react';
import CashbackBalance from '@/components/cashback/CashbackBalance';
import ActiveCashbackOffers from '@/components/cashback/ActiveCashbackOffers';
import TransactionHistory from '@/components/cashback/TransactionHistory';
import CashbackCalculator from '@/components/cashback/CashbackCalculator';
import ClubMemberships from '@/components/cashback/ClubMemberships';
import RewardsTiers from '@/components/cashback/RewardsTiers';
import BrandVouchers from '@/components/cashback/BrandVouchers';
import PaymentOffers from '@/components/cashback/PaymentOffers';
import SuperCoins from '@/components/cashback/SuperCoins';
import ReferAndEarn from '@/components/cashback/ReferAndEarn';

export default function CashbackPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header with Balance Summary */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Cashback Central</h1>
            <p className="text-white/90">Your gateway to maximum savings</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80">Total Cashback Earned</p>
            <p className="text-4xl font-bold">₹12,457</p>
            <p className="text-sm text-white/80 mt-1">+₹2,340 this month</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold">₹3,456</p>
            </div>
            <Coins className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Cashback</p>
              <p className="text-2xl font-bold">₹892</p>
            </div>
            <History className="h-8 w-8 text-orange-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">SuperCoins</p>
              <p className="text-2xl font-bold">2,845</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Club Level</p>
              <p className="text-2xl font-bold">Gold</p>
            </div>
            <Crown className="h-8 w-8 text-yellow-600" />
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="offers">Active Offers</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="clubs">Clubs</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Balance Overview */}
          <CashbackBalance />
          
          {/* Featured Offers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Featured Cashback Offers
              </CardTitle>
              <CardDescription>Limited time offers with maximum returns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-red-500 text-white">HOT</Badge>
                    <span className="text-sm text-muted-foreground">Ends in 2 days</span>
                  </div>
                  <h4 className="font-semibold mb-1">Amazon Pay Later</h4>
                  <p className="text-sm text-muted-foreground mb-2">Get 10% cashback up to ₹150</p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-semibold">10% Cashback</span>
                    <Button size="sm" variant="outline">
                      Activate <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-blue-500 text-white">EXCLUSIVE</Badge>
                    <span className="text-sm text-muted-foreground">Always On</span>
                  </div>
                  <h4 className="font-semibold mb-1">Paytm Wallet</h4>
                  <p className="text-sm text-muted-foreground mb-2">Flat ₹50 on first transaction</p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-semibold">₹50 Cashback</span>
                    <Button size="sm" variant="outline">
                      Activate <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SuperCoins Section */}
          <SuperCoins />

          {/* Reward Tiers */}
          <RewardsTiers />
        </TabsContent>

        <TabsContent value="offers" className="space-y-6">
          <ActiveCashbackOffers />
          <PaymentOffers />
          <BrandVouchers />
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Cashback Calculator
              </CardTitle>
              <CardDescription>
                The calculator is currently being updated. Please check back soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Calculator temporarily unavailable</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clubs" className="space-y-6">
          <ClubMemberships />
          <ReferAndEarn />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <TransactionHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
