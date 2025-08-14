
'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import type { UserCard, UserRewardGoal, LoyaltyProgram, UserPointsState } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2, Target, Award as LoyaltyIcon } from 'lucide-react';
import { handleAddUserRewardGoal, handleGetUserPointsState, handleUpdateUserRewardGoalActivity, handleRemoveUserRewardGoal } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { AuthLoader } from '@/components/ui/animated-loader';
import { useLazyLoading } from '@/hooks/useLazyLoading';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Lazy load heavy components
const CardVaultManager = dynamic(() => import('@/components/wallet/CardVaultManager'), {
  loading: () => <AuthLoader size="sm" />,
  ssr: false
});

const RewardGoalsList = dynamic(() => import('@/components/wallet/RewardGoalsList'), {
  loading: () => <AuthLoader size="sm" />,
  ssr: false
});

const RewardGoalForm = dynamic(() => import('@/components/wallet/RewardGoalForm'), {
  loading: () => <AuthLoader size="sm" />,
  ssr: false
});

const LoyaltyProgramList = dynamic(() => import('@/components/wallet/LoyaltyProgramList'), {
  loading: () => <AuthLoader size="sm" />,
  ssr: false
});

const RewardProgressChart = dynamic(() => import('@/components/wallet/RewardProgressChart'), {
  loading: () => <AuthLoader size="sm" />,
  ssr: false
});

// Internal Wallet Components
const InternalWalletBalance = dynamic(() => import('@/components/wallet/InternalWalletBalance'), {
  loading: () => <AuthLoader size="sm" />,
  ssr: false
});

const AddMoneyModal = dynamic(() => import('@/components/wallet/AddMoneyModal'), {
  loading: () => <AuthLoader size="sm" />,
  ssr: false
});

const WithdrawMoneyModal = dynamic(() => import('@/components/wallet/WithdrawMoneyModal'), {
  loading: () => <AuthLoader size="sm" />,
  ssr: false
});

const WalletTransactionHistory = dynamic(() => import('@/components/wallet/WalletTransactionHistory'), {
  loading: () => <AuthLoader size="sm" />,
  ssr: false
});

export default function WalletPage() {
  const [userPointsState, setUserPointsState] = useState<UserPointsState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCardFormOpen, setIsCardFormOpen] = useState(false);
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('wallet');
  
  // Internal wallet state
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [isWithdrawMoneyModalOpen, setIsWithdrawMoneyModalOpen] = useState(false);
  const [walletRefreshTrigger, setWalletRefreshTrigger] = useState(0);
  const [currentWalletBalance, setCurrentWalletBalance] = useState('0');
  const [currentWalletCurrency, setCurrentWalletCurrency] = useState('USD');
  
  const { toast } = useToast();
  
  // Use lazy loading hooks for progressive loading
  const { isVisible: shouldLoadCharts } = useLazyLoading(0.1, '100px');
  const { isVisible: shouldLoadGoals } = useLazyLoading(0.1, '150px');
  const { isVisible: shouldLoadLoyalty } = useLazyLoading(0.1, '200px');

  const fetchData = async () => {
    setIsLoading(true);
    const result = await handleGetUserPointsState(); 
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
      setUserPointsState({ cards: [], loyaltyPrograms: [], rewardGoals: [] }); // Ensure state is not null
    } else if (result.data) {
      setUserPointsState(result.data);
    } else {
       setUserPointsState({ cards: [], loyaltyPrograms: [], rewardGoals: [] });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleAddGoal = async (goalData: Omit<UserRewardGoal, 'id' | 'userId'>) => {
    const formData = new FormData();
     Object.entries(goalData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
             formData.append(key, String(value));
        }
    });
    formData.append('isActive', String(goalData.isActive)); // Ensure boolean is stringified

    const result = await handleAddUserRewardGoal(formData);
    if (result.error) {
      toast({ title: "Error adding goal", description: result.error, variant: "destructive" });
    } else if (result.data) {
      toast({ title: "Goal Added", description: `Goal "${result.data.description}" added.`});
      setUserPointsState(prev => ({
        ...prev!,
        rewardGoals: [...(prev?.rewardGoals || []), result.data!],
      }));
      setIsGoalFormOpen(false);
    }
  };

  const handleToggleGoalActivity = async (goalId: string, isActive: boolean) => {
    const result = await handleUpdateUserRewardGoalActivity(goalId, isActive);
     if (result.error || !result.success) {
      toast({ title: "Error updating goal", description: result.error || "Failed to update goal.", variant: "destructive" });
    } else {
      toast({ title: "Goal Updated", description: `Goal activity changed.` });
      setUserPointsState(prev => ({
        ...prev!,
        rewardGoals: (prev?.rewardGoals || []).map(g => g.id === goalId ? {...g, isActive} : g),
      }));
    }
  };
  
  const handleRemoveGoal = async (goalId: string) => {
    const result = await handleRemoveUserRewardGoal(goalId);
    if (result.error || !result.success) {
      toast({ title: "Error removing goal", description: result.error || "Failed to remove goal.", variant: "destructive" });
    } else {
      toast({ title: "Goal Removed", description: "Goal removed successfully." });
      setUserPointsState(prev => ({
        ...prev!,
        rewardGoals: (prev?.rewardGoals || []).filter(g => g.id !== goalId),
      }));
    }
  };

  // Internal wallet handlers
  const handleWalletRefresh = () => {
    setWalletRefreshTrigger(prev => prev + 1);
  };

  const handleAddMoney = () => {
    setIsAddMoneyModalOpen(true);
  };

  const handleWithdrawMoney = () => {
    setIsWithdrawMoneyModalOpen(true);
  };

  const handleAddMoneySuccess = () => {
    handleWalletRefresh();
  };

  const handleWithdrawMoneySuccess = () => {
    handleWalletRefresh();
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!userPointsState) {
    return <p>Error loading wallet data.</p>; // Should be handled by error state from fetchData
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-6xl">
        <div className="space-y-6">
          <div className="glass-card p-4 sm:p-6">
            <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              💳 My Wallet & Rewards
            </h2>
            <p className="text-sm sm:text-md text-muted-foreground/80 mt-2">
              Manage cards, track loyalty points, and set reward goals.
            </p>
          </div>

      <Tabs defaultValue="wallet" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="wallet" className="transform transition-transform duration-150 ease-in-out hover:scale-105 active:translate-y-px data-[state=active]:shadow-md data-[state=active]:shadow-primary/30 text-xs sm:text-sm px-2 py-2">
            <span className="hidden sm:inline">Internal Wallet</span>
            <span className="sm:hidden">Wallet</span>
          </TabsTrigger>
          <TabsTrigger value="cards" className="transform transition-transform duration-150 ease-in-out hover:scale-105 active:translate-y-px data-[state=active]:shadow-md data-[state=active]:shadow-primary/30 text-xs sm:text-sm px-2 py-2">
            <span className="hidden sm:inline">My Cards</span>
            <span className="sm:hidden">Cards</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="transform transition-transform duration-150 ease-in-out hover:scale-105 active:translate-y-px data-[state=active]:shadow-md data-[state=active]:shadow-primary/30 text-xs sm:text-sm px-2 py-2">
            <span className="hidden sm:inline">Reward Goals</span>
            <span className="sm:hidden">Goals</span>
          </TabsTrigger>
          <TabsTrigger value="loyalty" className="transform transition-transform duration-150 ease-in-out hover:scale-105 active:translate-y-px data-[state=active]:shadow-md data-[state=active]:shadow-primary/30 text-xs sm:text-sm px-2 py-2">
            <span className="hidden sm:inline">Loyalty Programs</span>
            <span className="sm:hidden">Loyalty</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="wallet" className="mt-4">
          <Suspense fallback={<AuthLoader size="md" />}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Internal Wallet Balance */}
              <InternalWalletBalance
                onAddMoney={handleAddMoney}
                onWithdrawMoney={handleWithdrawMoney}
                refreshTrigger={walletRefreshTrigger}
              />
              
              {/* Quick Stats */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={handleAddMoney}
                      variant="default"
                      className="h-20 flex flex-col gap-2"
                    >
                      <span className="text-2xl">💰</span>
                      <span>Add Money</span>
                    </Button>
                    <Button
                      onClick={handleWithdrawMoney}
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                    >
                      <span className="text-2xl">🏦</span>
                      <span>Withdraw</span>
                    </Button>
                  </div>
                  <div className="mt-4 p-4 bg-slate-900/50 rounded-lg">
                    <h4 className="font-medium mb-2">Use your wallet to:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Purchase deals from the marketplace</li>
                      <li>• Pay for premium features</li>
                      <li>• Send money to other users</li>
                      <li>• Earn cashback on purchases</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Transaction History */}
            <div className="mt-6">
              <WalletTransactionHistory refreshTrigger={walletRefreshTrigger} />
            </div>
          </Suspense>
        </TabsContent>
        
        <TabsContent value="cards" className="mt-4">
          <Suspense fallback={<AuthLoader size="md" />}>
            <CardVaultManager />
          </Suspense>
        </TabsContent>

        <TabsContent value="goals" className="mt-4">
          {(activeTab === 'goals' || shouldLoadGoals) && (
            <Suspense fallback={<AuthLoader size="md" />}>
              <>
                <Card className="shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl">Your Reward Goals</CardTitle>
                    <Dialog open={isGoalFormOpen} onOpenChange={setIsGoalFormOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="transform transition-transform duration-150 ease-in-out hover:scale-105 active:translate-y-px">
                          <Target className="mr-2 h-4 w-4" /> Add Goal
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[480px] bg-card border-border shadow-2xl">
                        <DialogHeader>
                          <DialogTitle>Set a New Reward Goal</DialogTitle>
                          <DialogDescription>Define what you're aiming for with your rewards.</DialogDescription>
                        </DialogHeader>
                        <RewardGoalForm 
                          onSubmit={handleAddGoal} 
                          cards={userPointsState.cards} 
                          loyaltyPrograms={userPointsState.loyaltyPrograms}
                          onCancel={() => setIsGoalFormOpen(false)}
                        />
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <RewardGoalsList 
                      goals={userPointsState.rewardGoals || []} 
                      onToggleActivity={handleToggleGoalActivity}
                      onRemoveGoal={handleRemoveGoal}
                    />
                  </CardContent>
                </Card>
                {userPointsState.rewardGoals && userPointsState.rewardGoals.length > 0 && userPointsState.cards.length > 0 && (
                  <Card className="mt-4 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl">Goal Progress Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px]">
                      <RewardProgressChart goals={userPointsState.rewardGoals} cards={userPointsState.cards} loyaltyPrograms={userPointsState.loyaltyPrograms} />
                    </CardContent>
                  </Card>
                )}
              </>
            </Suspense>
          )}
        </TabsContent>

        <TabsContent value="loyalty" className="mt-4">
          {(activeTab === 'loyalty' || shouldLoadLoyalty) && (
            <Suspense fallback={<AuthLoader size="md" />}>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Connected Loyalty Programs</CardTitle>
                  {/* Placeholder for Add Loyalty Program button - complex due to potential OAuth/CSV */}
                  <Button size="sm" variant="outline" disabled className="transform transition-transform duration-150 ease-in-out hover:scale-105 active:translate-y-px">
                    <LoyaltyIcon className="mr-2 h-4 w-4" /> Add Program (Soon)
                  </Button>
                </CardHeader>
                <CardContent>
                  <LoyaltyProgramList programs={userPointsState.loyaltyPrograms} />
                </CardContent>
              </Card>
            </Suspense>
          )}
        </TabsContent>
      </Tabs>
      
      <p className="text-xs text-center text-muted-foreground/60 pt-4">
        DealMate securely stores only card metadata (like bank and type) to personalize deals. Full card numbers are never stored.
      </p>
        </div>
      </div>

      {/* Internal Wallet Modals */}
      <AddMoneyModal
        isOpen={isAddMoneyModalOpen}
        onClose={() => setIsAddMoneyModalOpen(false)}
        onSuccess={handleAddMoneySuccess}
      />
      
      <WithdrawMoneyModal
        isOpen={isWithdrawMoneyModalOpen}
        onClose={() => setIsWithdrawMoneyModalOpen(false)}
        onSuccess={handleWithdrawMoneySuccess}
        currentBalance={currentWalletBalance}
        currency={currentWalletCurrency}
      />
    </div>
  );
}
