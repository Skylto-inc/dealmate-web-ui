'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  Percent, 
  CreditCard, 
  ShoppingCart,
  Wallet,
  TrendingUp,
  Info,
  Sparkles,
  AlertCircle,
  Check,
  X,
  Zap,
  Gift,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit_card' | 'debit_card' | 'wallet' | 'upi';
  cashbackRate: number;
  maxCashback?: number;
  minTransaction?: number;
  icon: React.ReactNode;
}

interface MerchantOffer {
  id: string;
  merchant: string;
  offerType: 'percentage' | 'flat';
  offerValue: number;
  maxCashback?: number;
  minTransaction?: number;
  stackable: boolean;
}

export default function CashbackCalculator() {
  const [amount, setAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [selectedMerchantOffer, setSelectedMerchantOffer] = useState('');
  const [includeRewardPoints, setIncludeRewardPoints] = useState(true);
  const [includeClubBenefits, setIncludeClubBenefits] = useState(true);
  const [selectedTab, setSelectedTab] = useState('simple');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'hdfc_cc',
      name: 'HDFC Infinia',
      type: 'credit_card',
      cashbackRate: 3.3,
      maxCashback: 1000,
      icon: <CreditCard className="h-4 w-4" />
    },
    {
      id: 'axis_cc',
      name: 'Axis Magnus',
      type: 'credit_card',
      cashbackRate: 4.8,
      maxCashback: 2000,
      minTransaction: 5000,
      icon: <CreditCard className="h-4 w-4" />
    },
    {
      id: 'paytm_wallet',
      name: 'Paytm Wallet',
      type: 'wallet',
      cashbackRate: 2,
      maxCashback: 100,
      icon: <Wallet className="h-4 w-4" />
    },
    {
      id: 'gpay_upi',
      name: 'Google Pay UPI',
      type: 'upi',
      cashbackRate: 1,
      maxCashback: 50,
      icon: <Wallet className="h-4 w-4" />
    }
  ];

  const merchantOffers: MerchantOffer[] = [
    {
      id: 'amazon_10',
      merchant: 'Amazon',
      offerType: 'percentage',
      offerValue: 10,
      maxCashback: 500,
      minTransaction: 1000,
      stackable: true
    },
    {
      id: 'flipkart_flat',
      merchant: 'Flipkart',
      offerType: 'flat',
      offerValue: 200,
      minTransaction: 2000,
      stackable: false
    },
    {
      id: 'swiggy_15',
      merchant: 'Swiggy',
      offerType: 'percentage',
      offerValue: 15,
      maxCashback: 150,
      minTransaction: 299,
      stackable: true
    }
  ];

  const calculateCashback = () => {
    const transactionAmount = parseFloat(amount) || 0;
    if (transactionAmount === 0) return null;

    const payment = paymentMethods.find(p => p.id === selectedPaymentMethod);
    const merchant = merchantOffers.find(m => m.id === selectedMerchantOffer);

    let paymentCashback = 0;
    let merchantCashback = 0;
    let rewardPoints = 0;
    let clubBenefits = 0;

    // Payment method cashback
    if (payment) {
      if (payment.minTransaction && transactionAmount < payment.minTransaction) {
        paymentCashback = 0;
      } else {
        paymentCashback = (transactionAmount * payment.cashbackRate) / 100;
        if (payment.maxCashback) {
          paymentCashback = Math.min(paymentCashback, payment.maxCashback);
        }
      }
    }

    // Merchant offer cashback
    if (merchant) {
      if (merchant.minTransaction && transactionAmount < merchant.minTransaction) {
        merchantCashback = 0;
      } else {
        if (merchant.offerType === 'percentage') {
          merchantCashback = (transactionAmount * merchant.offerValue) / 100;
          if (merchant.maxCashback) {
            merchantCashback = Math.min(merchantCashback, merchant.maxCashback);
          }
        } else {
          merchantCashback = merchant.offerValue;
        }
      }
    }

    // Reward points (simulated)
    if (includeRewardPoints && payment?.type === 'credit_card') {
      rewardPoints = Math.floor(transactionAmount * 0.02); // 2% as points value
    }

    // Club benefits (simulated)
    if (includeClubBenefits) {
      clubBenefits = Math.floor(transactionAmount * 0.005); // 0.5% club benefits
    }

    // Check if offers are stackable
    let totalCashback = 0;
    if (merchant?.stackable || !merchant) {
      totalCashback = paymentCashback + merchantCashback + rewardPoints + clubBenefits;
    } else {
      totalCashback = Math.max(paymentCashback, merchantCashback) + rewardPoints + clubBenefits;
    }

    return {
      transactionAmount,
      paymentCashback,
      merchantCashback,
      rewardPoints,
      clubBenefits,
      totalCashback,
      effectivePrice: transactionAmount - totalCashback,
      savingsPercentage: (totalCashback / transactionAmount) * 100,
      isStackable: merchant?.stackable !== false
    };
  };

  const result = calculateCashback();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Cashback Calculator
        </CardTitle>
        <CardDescription>
          Calculate your total savings across payment methods and offers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="simple">Simple Calculator</TabsTrigger>
            <TabsTrigger value="comparison">Compare Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="simple" className="space-y-6">
            {/* Transaction Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Transaction Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-xl font-semibold"
              />
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-2">
              <Label htmlFor="payment">Payment Method</Label>
              <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <SelectTrigger id="payment">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map(method => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name} - {method.cashbackRate}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Merchant Offer Selection */}
            <div className="space-y-2">
              <Label htmlFor="merchant">Merchant Offer (Optional)</Label>
              <Select value={selectedMerchantOffer} onValueChange={setSelectedMerchantOffer}>
                <SelectTrigger id="merchant">
                  <SelectValue placeholder="Select merchant offer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No merchant offer</SelectItem>
                  {merchantOffers.map(offer => (
                    <SelectItem key={offer.id} value={offer.id}>
                      {offer.merchant} - {offer.offerType === 'percentage' ? `${offer.offerValue}%` : `₹${offer.offerValue}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Additional Benefits */}
            <div className="space-y-3">
              <Label>Additional Benefits</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="rewards" className="text-sm font-normal cursor-pointer">
                    Include Reward Points Value
                  </Label>
                  <Switch
                    id="rewards"
                    checked={includeRewardPoints}
                    onCheckedChange={setIncludeRewardPoints}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="club" className="text-sm font-normal cursor-pointer">
                    Include Club Benefits
                  </Label>
                  <Switch
                    id="club"
                    checked={includeClubBenefits}
                    onCheckedChange={setIncludeClubBenefits}
                  />
                </div>
              </div>
            </div>

            {/* Calculation Result */}
            {result && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  Cashback Breakdown
                </h3>
                
                <div className="space-y-2">
                  {result.paymentCashback > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <span className="text-sm">Payment Method Cashback</span>
                      <span className="font-semibold text-green-600">₹{result.paymentCashback.toFixed(2)}</span>
                    </div>
                  )}
                  {result.merchantCashback > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <span className="text-sm flex items-center gap-2">
                        Merchant Offer
                        {!result.isStackable && (
                          <Badge variant="outline" className="text-xs">
                            Non-stackable
                          </Badge>
                        )}
                      </span>
                      <span className="font-semibold text-green-600">₹{result.merchantCashback.toFixed(2)}</span>
                    </div>
                  )}
                  {result.rewardPoints > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <span className="text-sm">Reward Points Value</span>
                      <span className="font-semibold text-blue-600">₹{result.rewardPoints.toFixed(2)}</span>
                    </div>
                  )}
                  {result.clubBenefits > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <span className="text-sm">Club Benefits</span>
                      <span className="font-semibold text-purple-600">₹{result.clubBenefits.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Total Cashback</span>
                    <span className="text-2xl font-bold text-green-600">₹{result.totalCashback.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Effective Price</span>
                    <span className="font-semibold">₹{result.effectivePrice.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">You save</span>
                      <Badge className="bg-green-500 text-white">
                        {result.savingsPercentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </div>

                {!result.isStackable && (
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <p className="text-xs text-orange-600 dark:text-orange-400">
                      This merchant offer is non-stackable. Only the higher cashback between payment method and merchant offer is applied.
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            {/* Amount Input for Comparison */}
            <div className="space-y-2">
              <Label htmlFor="compare-amount">Compare cashback for amount (₹)</Label>
              <Input
                id="compare-amount"
                type="number"
                placeholder="Enter amount to compare"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-xl font-semibold"
              />
            </div>

            {/* Payment Methods Comparison */}
            {amount && parseFloat(amount) > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Best Payment Methods
                </h3>
                <div className="space-y-3">
                  {paymentMethods
                    .map(method => {
                      const transactionAmount = parseFloat(amount);
                      let cashback = 0;
                      
                      if (!method.minTransaction || transactionAmount >= method.minTransaction) {
                        cashback = (transactionAmount * method.cashbackRate) / 100;
                        if (method.maxCashback) {
                          cashback = Math.min(cashback, method.maxCashback);
                        }
                      }
                      
                      return {
                        ...method,
                        calculatedCashback: cashback,
                        percentage: (cashback / transactionAmount) * 100
                      };
                    })
                    .sort((a, b) => b.calculatedCashback - a.calculatedCashback)
                    .map((method, index) => (
                      <div
                        key={method.id}
                        className={cn(
                          "p-4 border rounded-lg transition-colors",
                          index === 0 && "border-green-500 bg-green-50/50 dark:bg-green-950/20"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              {method.icon}
                            </div>
                            <div>
                              <p className="font-semibold flex items-center gap-2">
                                {method.name}
                                {index === 0 && (
                                  <Badge className="text-xs bg-green-500 text-white">Best</Badge>
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {method.cashbackRate}% cashback
                                {method.maxCashback && ` (max ₹${method.maxCashback})`}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              ₹{method.calculatedCashback.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {method.percentage.toFixed(1)}% savings
                            </p>
                          </div>
                        </div>
                        {method.minTransaction && parseFloat(amount) < method.minTransaction && (
                          <p className="text-xs text-red-500 mt-2">
                            Min. transaction ₹{method.minTransaction} required
                          </p>
                        )}
                      </div>
                    ))}
                </div>

                {/* Pro Tips */}
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Smart Cashback Tips
                  </h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• Split large purchases to stay within max cashback limits</li>
                    <li>• Use credit cards for high-value transactions (better rewards)</li>
                    <li>• Check for ongoing festival offers for extra savings</li>
                    <li>• Combine with gift card purchases for double benefits</li>
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
