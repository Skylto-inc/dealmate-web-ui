'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Wallet, 
  Smartphone, 
  Building,
  Percent,
  Gift,
  TrendingUp,
  Clock,
  ChevronRight,
  Shield,
  Zap,
  Star,
  AlertCircle,
  Check
} from 'lucide-react';

interface PaymentOffer {
  id: string;
  provider: string;
  type: 'credit_card' | 'debit_card' | 'wallet' | 'upi' | 'netbanking';
  bank?: string;
  offerTitle: string;
  cashbackRate: string;
  maxCashback?: number;
  minTransaction?: number;
  validTill: string;
  categories: string[];
  isInstant: boolean;
  frequency: 'once' | 'monthly' | 'unlimited';
  icon: React.ReactNode;
  color: string;
}

export default function PaymentOffers() {
  const [selectedTab, setSelectedTab] = useState('cards');

  const paymentOffers: PaymentOffer[] = [
    // Credit Card Offers
    {
      id: '1',
      provider: 'HDFC Bank',
      type: 'credit_card',
      bank: 'HDFC',
      offerTitle: 'Millennia Card Weekend Offer',
      cashbackRate: '5%',
      maxCashback: 500,
      minTransaction: 2000,
      validTill: '2025-03-31',
      categories: ['Shopping', 'Dining', 'Travel'],
      isInstant: true,
      frequency: 'monthly',
      icon: <CreditCard className="h-5 w-5" />,
      color: 'from-blue-600 to-blue-700'
    },
    {
      id: '2',
      provider: 'Axis Bank',
      type: 'credit_card',
      bank: 'Axis',
      offerTitle: 'Flipkart Axis Card',
      cashbackRate: '10%',
      maxCashback: 1000,
      minTransaction: 3000,
      validTill: '2025-12-31',
      categories: ['Flipkart', 'Myntra', '2GUD'],
      isInstant: false,
      frequency: 'unlimited',
      icon: <CreditCard className="h-5 w-5" />,
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: '3',
      provider: 'SBI Card',
      type: 'credit_card',
      bank: 'SBI',
      offerTitle: 'SimplyCLICK Amazon Offer',
      cashbackRate: '5%',
      maxCashback: 2000,
      minTransaction: 5000,
      validTill: '2025-02-28',
      categories: ['Amazon', 'Online Shopping'],
      isInstant: true,
      frequency: 'once',
      icon: <CreditCard className="h-5 w-5" />,
      color: 'from-green-600 to-teal-600'
    },
    // Wallet Offers
    {
      id: '4',
      provider: 'Paytm',
      type: 'wallet',
      offerTitle: 'Movie Ticket Cashback',
      cashbackRate: '₹100',
      minTransaction: 500,
      validTill: '2025-02-15',
      categories: ['Movies', 'Entertainment'],
      isInstant: true,
      frequency: 'once',
      icon: <Wallet className="h-5 w-5" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: '5',
      provider: 'PhonePe',
      type: 'wallet',
      offerTitle: 'Recharge & Bill Payments',
      cashbackRate: '₹50',
      minTransaction: 200,
      validTill: '2025-01-31',
      categories: ['Recharge', 'Bills', 'DTH'],
      isInstant: true,
      frequency: 'monthly',
      icon: <Wallet className="h-5 w-5" />,
      color: 'from-purple-500 to-indigo-500'
    },
    // UPI Offers
    {
      id: '6',
      provider: 'Google Pay',
      type: 'upi',
      offerTitle: 'Scratch Card Rewards',
      cashbackRate: 'Up to ₹100',
      minTransaction: 100,
      validTill: '2025-12-31',
      categories: ['All Categories'],
      isInstant: true,
      frequency: 'unlimited',
      icon: <Smartphone className="h-5 w-5" />,
      color: 'from-red-500 to-yellow-500'
    },
    {
      id: '7',
      provider: 'BHIM',
      type: 'upi',
      offerTitle: 'Government Services Cashback',
      cashbackRate: '2%',
      maxCashback: 100,
      minTransaction: 500,
      validTill: '2025-03-31',
      categories: ['Government', 'Utilities'],
      isInstant: false,
      frequency: 'monthly',
      icon: <Smartphone className="h-5 w-5" />,
      color: 'from-orange-500 to-red-500'
    },
    // Netbanking
    {
      id: '8',
      provider: 'ICICI Bank',
      type: 'netbanking',
      bank: 'ICICI',
      offerTitle: 'Net Banking Special',
      cashbackRate: '3%',
      maxCashback: 300,
      minTransaction: 5000,
      validTill: '2025-02-28',
      categories: ['Insurance', 'Investments'],
      isInstant: false,
      frequency: 'once',
      icon: <Building className="h-5 w-5" />,
      color: 'from-red-600 to-orange-600'
    }
  ];

  const cardOffers = paymentOffers.filter(offer => offer.type === 'credit_card' || offer.type === 'debit_card');
  const walletOffers = paymentOffers.filter(offer => offer.type === 'wallet');
  const upiOffers = paymentOffers.filter(offer => offer.type === 'upi');
  const netbankingOffers = paymentOffers.filter(offer => offer.type === 'netbanking');

  const renderOffer = (offer: PaymentOffer) => (
    <div
      key={offer.id}
      className="p-4 border rounded-lg hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${offer.color} text-white`}>
            {offer.icon}
          </div>
          <div>
            <h4 className="font-semibold">{offer.provider}</h4>
            <p className="text-sm text-muted-foreground">{offer.offerTitle}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-green-600">{offer.cashbackRate}</p>
          {offer.maxCashback && (
            <p className="text-xs text-muted-foreground">Max ₹{offer.maxCashback}</p>
          )}
        </div>
      </div>

      {/* Offer Details */}
      <div className="space-y-2 mb-3">
        {offer.minTransaction && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Min. transaction</span>
            <span className="font-medium">₹{offer.minTransaction}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Valid till</span>
          <span className="font-medium">{new Date(offer.validTill).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Frequency</span>
          <Badge variant="secondary" className="text-xs capitalize">
            {offer.frequency}
          </Badge>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-1 mb-3">
        {offer.categories.map((category, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {category}
          </Badge>
        ))}
      </div>

      {/* Features */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs">
          {offer.isInstant && (
            <div className="flex items-center gap-1 text-green-600">
              <Zap className="h-3 w-3" />
              <span>Instant</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Verified</span>
          </div>
        </div>
        <Button size="sm" variant="outline">
          View Details
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-500" />
          Payment Method Offers
        </CardTitle>
        <CardDescription>
          Special cashback offers based on your payment method
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
            <TabsTrigger value="upi">UPI</TabsTrigger>
            <TabsTrigger value="netbanking">Netbanking</TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="space-y-4">
            <div className="space-y-3">
              {cardOffers.map(renderOffer)}
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Card offers are bank-specific. Check your card eligibility before making a purchase.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="wallets" className="space-y-4">
            <div className="space-y-3">
              {walletOffers.map(renderOffer)}
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg flex items-start gap-2">
              <Star className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5" />
              <p className="text-xs text-purple-600 dark:text-purple-400">
                Link your wallet to DealMate for automatic cashback tracking.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="upi" className="space-y-4">
            <div className="space-y-3">
              {upiOffers.map(renderOffer)}
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg flex items-start gap-2">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
              <p className="text-xs text-green-600 dark:text-green-400">
                UPI offers work with any bank account linked to your UPI ID.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="netbanking" className="space-y-4">
            <div className="space-y-3">
              {netbankingOffers.map(renderOffer)}
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg flex items-start gap-2">
              <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5" />
              <p className="text-xs text-orange-600 dark:text-orange-400">
                Netbanking cashback may take 7-10 days to reflect in your account.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Tips */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            Payment Method Tips
          </h4>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Credit cards typically offer higher cashback than debit cards</li>
            <li>• Combine bank offers with merchant discounts for maximum savings</li>
            <li>• Check offer validity and T&C before making large purchases</li>
            <li>• Some offers reset monthly - plan your purchases accordingly</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
