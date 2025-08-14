'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  History, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { 
  walletAPI, 
  formatCurrency, 
  getTransactionIcon, 
  getTransactionColor,
  type WalletTransaction 
} from '@/lib/wallet/api';
import { useToast } from '@/hooks/use-toast';

interface WalletTransactionHistoryProps {
  refreshTrigger?: number;
}

export default function WalletTransactionHistory({ refreshTrigger = 0 }: WalletTransactionHistoryProps) {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [expandedTransactions, setExpandedTransactions] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const limit = 10;

  const fetchTransactions = async (offset = 0, showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    if (offset === 0) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const response = await walletAPI.getTransactions(limit, offset);
      
      if (offset === 0) {
        setTransactions(response.transactions);
      } else {
        setTransactions(prev => [...prev, ...response.transactions]);
      }

      setHasMore(response.transactions.length === limit);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load transaction history',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    fetchTransactions(0, true);
  };

  const handleLoadMore = () => {
    fetchTransactions(transactions.length);
  };

  const toggleTransactionExpanded = (transactionId: string) => {
    const newExpanded = new Set(expandedTransactions);
    if (newExpanded.has(transactionId)) {
      newExpanded.delete(transactionId);
    } else {
      newExpanded.add(transactionId);
    }
    setExpandedTransactions(newExpanded);
  };

  const getStatusColor = (status: WalletTransaction['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'cancelled':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const formatTransactionType = (type: WalletTransaction['transaction_type']) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading && transactions.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-muted rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-1/3 mb-1"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="h-6 bg-muted rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Transaction History
        </CardTitle>
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
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No transactions yet</p>
            <p className="text-sm text-muted-foreground/60">
              Your wallet transactions will appear here
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {transactions.map((transaction) => {
                const isExpanded = expandedTransactions.has(transaction.id);
                const isDebit = ['withdrawal', 'purchase', 'transfer_out'].includes(transaction.transaction_type);
                
                return (
                  <div
                    key={transaction.id}
                    className="border border-border/40 rounded-lg p-4 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {/* Transaction Icon */}
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg">
                            {getTransactionIcon(transaction.transaction_type)}
                          </span>
                        </div>
                      </div>

                      {/* Transaction Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium truncate">
                            {formatTransactionType(transaction.transaction_type)}
                          </h4>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {transaction.description || 'No description'}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(transaction.created_at).toLocaleString()}
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        <div className={`font-semibold ${getTransactionColor(transaction.transaction_type)}`}>
                          {isDebit ? '-' : '+'}
                          {formatCurrency(transaction.amount)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Balance: {formatCurrency(transaction.balance_after)}
                        </div>
                      </div>

                      {/* Expand Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTransactionExpanded(transaction.id)}
                        className="h-8 w-8 p-0"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border/20">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Transaction ID</p>
                            <p className="font-mono text-xs break-all">
                              {transaction.id}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Balance Before</p>
                            <p>{formatCurrency(transaction.balance_before)}</p>
                          </div>
                          {transaction.reference_id && (
                            <div>
                              <p className="text-muted-foreground">Reference</p>
                              <p className="font-mono text-xs break-all">
                                {transaction.reference_id}
                              </p>
                            </div>
                          )}
                          {transaction.completed_at && (
                            <div>
                              <p className="text-muted-foreground">Completed At</p>
                              <p className="text-xs">
                                {new Date(transaction.completed_at).toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-4">
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  disabled={isLoadingMore}
                  className="w-full"
                >
                  {isLoadingMore ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
