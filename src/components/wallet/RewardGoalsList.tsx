
'use client';

import type { UserRewardGoal } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Target, CheckCircle, XCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface RewardGoalsListProps {
  goals: UserRewardGoal[];
  onToggleActivity: (goalId: string, isActive: boolean) => void;
  onRemoveGoal: (goalId: string) => void;
}

export default function RewardGoalsList({ goals, onToggleActivity, onRemoveGoal }: RewardGoalsListProps) {
  if (goals.length === 0) {
    return (
      <Alert className="bg-card-foreground/5 border-card-foreground/10">
        <Target className="h-5 w-5 text-primary" />
        <AlertTitle className="text-lg text-foreground">No Reward Goals Yet!</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Set some financial or points goals to help ShopSavvy personalize your deals.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      {goals.map((goal) => (
        <Card key={goal.id} className={`shadow-md transition-all ${goal.isActive ? 'ring-1 ring-primary/70 bg-card' : 'bg-card/70 opacity-80'}`}>
          <CardHeader className="pb-2 pt-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-md flex items-center">
                  {goal.isActive ? <CheckCircle className="mr-2 h-5 w-5 text-green-500" /> : <XCircle className="mr-2 h-5 w-5 text-muted-foreground" />}
                  {goal.description}
                </CardTitle>
                <CardDescription className="text-xs ml-7">
                  Target: {goal.targetValue.toLocaleString()} 
                  {goal.targetType === 'monetary_savings_monthly' ? ' INR savings/month' : ' points'}
                  {goal.cardIdRef && ` on card ending ... (Card Name)`} {/* TODO: Fetch card name */}
                  {goal.loyaltyProgramIdRef && ` in program ... (Program Name)`} {/* TODO: Fetch program name */}
                </CardDescription>
              </div>
               <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onRemoveGoal(goal.id)} 
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transform transition-transform duration-150 ease-in-out hover:scale-110 active:scale-95"
                    aria-label={`Remove goal: ${goal.description}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-between pt-1 pb-3 px-4">
            <span className={`text-xs font-medium ${goal.isActive ? 'text-green-400' : 'text-muted-foreground'}`}>
              {goal.isActive ? 'Active' : 'Inactive'}
            </span>
            <Switch
              checked={goal.isActive}
              onCheckedChange={(checked) => onToggleActivity(goal.id, checked)}
              aria-label={goal.isActive ? 'Deactivate goal' : 'Activate goal'}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
