'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  History, 
  Download, 
  Filter, 
  CalendarIcon,
  Search,
  ChevronDown,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Smartphone,
  Receipt,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  cashback: number;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  paymentMethod: string;
  transactionId: string;
  icon: React.ReactNode;
}

export default function TransactionHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [selectedTab, setSelectedTab] = useState('all');

  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2025-01-25',
      merchant: 'Amazon',
      category: 'shopping',
      amount: 2499,
      cashback: 125,
      status: 'completed',
      paymentMethod: 'HDFC Credit Card',
      transactionId: 'TXN2025012501',
      icon: <ShoppingBag className="h-4 w-4" />
    },
    {
      id: '2',
      date: '2025-01-24',
      merchant: 'Swiggy',
      category: 'food',
      amount: 389,
      cashback: 75,
      status: 'pending',
      paymentMethod: 'Paytm Wallet',
      transactionId: 'TXN2025012402',
      icon: <Receipt className="h-4 w-4" />
    },
    {
      id: '3',
      date: '2025-01-23',
      merchant: 'Mobile Recharge',
      category: 'recharge',
      amount: 599,
      cashback: 12,
      status: 'completed',
      paymentMethod: 'UPI',
      transactionId: 'TXN2025012303',
      icon: <Smartphone className="h-4 w-4" />
    },
    {
      id: '4',
      date: '2025-01-22',
      merchant: 'Flipkart',
      category: 'shopping',
      amount: 4999,
      cashback: 250,
      status: 'processing',
      paymentMethod: 'Axis Credit Card',
      transactionId: 'TXN2025012204',
      icon: <ShoppingBag className="h-4 w-4" />
    },
    {
      id: '5',
      date: '2025-01-21',
      merchant: 'Uber',
      category: 'travel',
      amount: 245,
      cashback: 0,
      status: 'failed',
      paymentMethod: 'Google Pay',
      transactionId: 'TXN2025012105',
      icon: <CreditCard className="h-4 w-4" />
    }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
    
    let matchesDate = true;
    if (dateRange.from) {
      matchesDate = new Date(transaction.date) >= dateRange.from;
    }
    if (dateRange.to && matchesDate) {
      matchesDate = new Date(transaction.date) <= dateRange.to;
    }
    
    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
  });

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'processing':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      processing: 'outline',
      failed: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status]} className="text-xs">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const totalCashback = filteredTransactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.cashback, 0);

  const pendingCashback = filteredTransactions
    .filter(t => t.status === 'pending' || t.status === 'processing')
    .reduce((sum, t) => sum + t.cashback, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <CardDescription>View and manage all your cashback transactions</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="space-y-4 mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by merchant or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="recharge">Recharge</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, yyyy")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-600 dark:text-green-400">Completed Cashback</p>
              <p className="text-xl font-bold">₹{totalCashback}</p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-orange-600 dark:text-orange-400">Pending Cashback</p>
              <p className="text-xl font-bold">₹{pendingCashback}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400">Total Transactions</p>
              <p className="text-xl font-bold">{filteredTransactions.length}</p>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No transactions found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg mt-0.5">
                      {transaction.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{transaction.merchant}</h4>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <CalendarIcon className="h-3 w-3" />
                          {format(new Date(transaction.date), 'PPP')}
                        </p>
                        <p className="flex items-center gap-2">
                          <CreditCard className="h-3 w-3" />
                          {transaction.paymentMethod}
                        </p>
                        <p className="flex items-center gap-2">
                          <FileText className="h-3 w-3" />
                          {transaction.transactionId}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Transaction Amount</p>
                    <p className="font-semibold">₹{transaction.amount}</p>
                    {transaction.cashback > 0 && (
                      <>
                        <p className="text-sm text-muted-foreground mt-2 mb-1">Cashback</p>
                        <p className="font-semibold text-green-600 flex items-center justify-end gap-1">
                          <TrendingUp className="h-3 w-3" />
                          ₹{transaction.cashback}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                
                {transaction.status === 'failed' && (
                  <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/20 rounded-lg text-sm text-red-600 dark:text-red-400">
                    Cashback failed. Please contact support if this was unexpected.
                  </div>
                )}
                
                {transaction.status === 'pending' && (
                  <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-950/20 rounded-lg text-sm text-orange-600 dark:text-orange-400">
                    Cashback will be credited within 3-7 days after merchant confirmation.
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredTransactions.length > 0 && (
          <div className="mt-6 text-center">
            <Button variant="outline" className="w-full md:w-auto">
              Load More Transactions
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
