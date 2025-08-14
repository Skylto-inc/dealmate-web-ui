'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Loader2, DollarSign, AlertTriangle, Info } from 'lucide-react';
import { walletAPI, type WithdrawMoneyRequest } from '@/lib/wallet/api';
import { useToast } from '@/hooks/use-toast';

interface WithdrawMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentBalance: string;
  currency: string;
}

export default function WithdrawMoneyModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  currentBalance,
  currency 
}: WithdrawMoneyModalProps) {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // For demo purposes, we'll use a dummy bank connection ID
  const dummyBankConnectionId = '00000000-0000-0000-0000-000000000000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const amountNum = parseFloat(amount);
    const balanceNum = parseFloat(currentBalance);
    
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount greater than 0',
        variant: 'destructive',
      });
      return;
    }

    if (amountNum > balanceNum) {
      toast({
        title: 'Insufficient Balance',
        description: `You only have ${currency === 'USD' ? '$' : '₹'}${balanceNum.toFixed(2)} available`,
        variant: 'destructive',
      });
      return;
    }

    if (amountNum < 1) {
      toast({
        title: 'Minimum Withdrawal',
        description: 'Minimum withdrawal amount is $1.00',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const request: WithdrawMoneyRequest = {
        amount: amountNum.toString(),
        bank_connection_id: dummyBankConnectionId,
        description: `Withdraw from wallet - ${currency === 'USD' ? '$' : '₹'}${amountNum.toFixed(2)}`,
      };

      await walletAPI.withdrawMoney(request);
      
      toast({
        title: 'Withdrawal Initiated',
        description: `${currency === 'USD' ? '$' : '₹'}${amountNum.toFixed(2)} withdrawal has been initiated. Funds will be transferred to your bank account within 1-3 business days.`,
      });

      // Reset form
      setAmount('');
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error withdrawing money:', error);
      toast({
        title: 'Withdrawal Failed',
        description: error instanceof Error ? error.message : 'Failed to withdraw money from wallet',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const balance = parseFloat(currentBalance);
  const withdrawAmount = parseFloat(amount) || 0;
  const remainingBalance = balance - withdrawAmount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            Withdraw Money from Wallet
          </DialogTitle>
          <DialogDescription>
            Transfer funds from your internal wallet to your bank account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Balance Display */}
          <Card className="bg-slate-900/50 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-2xl font-bold">
                    {currency === 'USD' ? '$' : '₹'}{balance.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">After Withdrawal</p>
                  <p className={`text-xl font-semibold ${remainingBalance < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {currency === 'USD' ? '$' : '₹'}{Math.max(0, remainingBalance).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amount Section */}
          <div className="space-y-2">
            <Label htmlFor="amount">Withdrawal Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
                min="1"
                max={balance.toString()}
                step="0.01"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Minimum: {currency === 'USD' ? '$' : '₹'}1.00</span>
              <span>Maximum: {currency === 'USD' ? '$' : '₹'}{balance.toFixed(2)}</span>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label>Quick Select</Label>
            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 75, 100].map((percentage) => {
                const quickAmount = (balance * percentage) / 100;
                if (quickAmount < 1) return null;
                return (
                  <Button
                    key={percentage}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(quickAmount.toFixed(2))}
                    className="text-xs"
                  >
                    {percentage}%
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Bank Account Info */}
          <Card className="border-dashed border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Bank Account</span>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>🏦 Demo Bank Account</p>
                <p>Account: ****1234</p>
                <p>Routing: ****5678</p>
              </div>
            </CardContent>
          </Card>

          {/* Processing Info */}
          <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-600/90">
              <p className="font-medium">Processing Time</p>
              <p>Withdrawals typically take 1-3 business days to appear in your bank account.</p>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-600/90">
              <p className="font-medium">Demo Mode</p>
              <p>This is a demo. No real bank transfers will be processed.</p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading || 
                !amount || 
                parseFloat(amount) <= 0 || 
                parseFloat(amount) > balance ||
                parseFloat(amount) < 1
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Building2 className="mr-2 h-4 w-4" />
                  Withdraw {currency === 'USD' ? '$' : '₹'}{amount || '0.00'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
