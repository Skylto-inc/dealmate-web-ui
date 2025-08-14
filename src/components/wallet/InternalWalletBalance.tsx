'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Plus, Minus, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { walletAPI, formatCurrency, type InternalWallet } from '@/lib/wallet/api';
import { useToast } from '@/hooks/use-toast';

interface InternalWalletBalanceProps {
  onAddMoney: () => void;
  onWithdrawMoney: () => void;
  refreshTrigger?: number;
}

export default function InternalWalletBalance({
  onAddMoney,
  onWithdrawMoney,
  refreshTrigger = 0,
}: InternalWalletBalanceProps) {
  const [wallet, setWallet] = useState<InternalWallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchWallet = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    setIsLoading(true);
    
    try {
      const response = await walletAPI.getWallet();
      setWallet(response.wallet);
    } catch (error) {
      console.error('Error fetching wallet:', error);
      toast({
        title: 'Error',
        description: 'Failed to load wallet information',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    fetchWallet(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'suspended':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'frozen':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (isLoading && !wallet) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Internal Wallet</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
            <div className="flex gap-2">
              <div className="h-9 bg-muted rounded flex-1"></div>
              <div className="h-9 bg-muted rounded flex-1"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!wallet) {
    return (
      <Card className="shadow-lg border-destructive/50">
        <CardContent className="pt-6">
          <div className="text-center">
            <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Failed to load wallet</p>
            <Button onClick={handleRefresh} variant="outline" size="sm" className="mt-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const balance = parseFloat(wallet.balance);
  const isPositiveBalance = balance > 0;

  return (
    <Card className="shadow-lg bg-gradient-to-br from-slate-900/50 to-purple-900/30 border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">Internal Wallet</CardTitle>
          <Badge className={getStatusColor(wallet.status)}>
            {wallet.status.charAt(0).toUpperCase() + wallet.status.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            variant="ghost"
            size="sm"
            disabled={isRefreshing}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Balance Display */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold tracking-tight">
                {formatCurrency(wallet.balance, wallet.currency)}
              </div>
              {isPositiveBalance ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Available Balance • {wallet.currency}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onAddMoney}
              variant="default"
              size="sm"
              className="flex items-center gap-2"
              disabled={wallet.status !== 'active'}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Money</span>
              <span className="sm:hidden">Add</span>
            </Button>
            <Button
              onClick={onWithdrawMoney}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={wallet.status !== 'active' || balance <= 0}
            >
              <Minus className="h-4 w-4" />
              <span className="hidden sm:inline">Withdraw</span>
              <span className="sm:hidden">Withdraw</span>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-xs text-muted-foreground/60 pt-2 border-t border-border/40">
            <p>Last updated: {new Date(wallet.updated_at).toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
