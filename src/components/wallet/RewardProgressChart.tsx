
'use client';

import type { UserRewardGoal, UserCard, LoyaltyProgram } from '@/lib/types';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Target } from 'lucide-react';

interface RewardProgressChartProps {
  goals: UserRewardGoal[];
  cards: UserCard[];
  loyaltyPrograms: LoyaltyProgram[];
}

export default function RewardProgressChart({ goals, cards, loyaltyPrograms }: RewardProgressChartProps) {
  if (!goals || goals.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-4">No active reward goals to display progress for.</p>;
  }

  const activeGoals = goals.filter(g => g.isActive);

  if (activeGoals.length === 0) {
     return <p className="text-sm text-muted-foreground text-center py-4">No active reward goals. Activate some to see progress!</p>;
  }

  const chartData = activeGoals.map(goal => {
    let currentProgress = 0;
    let target = goal.targetValue;
    let name = goal.description.substring(0, 20) + (goal.description.length > 20 ? '...' : ''); // Shorten name for chart

    if (goal.targetType === 'monetary_savings_monthly') {
      // This would require tracking actual savings, which is complex for this example.
      // We'll mock some progress or show it as not directly trackable here.
      name = `${name} (Savings Goal)`;
      currentProgress = Math.random() * target * 0.5; // Mock progress
    } else if (goal.targetType === 'points_milestone_card' && goal.cardIdRef) {
      const card = cards.find(c => c.id === goal.cardIdRef);
      if (card && card.current_points !== undefined) {
        currentProgress = card.current_points;
        name = `${name} (${card.bank} ${card.cardType})`;
      }
    } else if (goal.targetType === 'points_milestone_program' && goal.loyaltyProgramIdRef) {
      const program = loyaltyPrograms.find(p => p.id === goal.loyaltyProgramIdRef);
      if (program) {
        currentProgress = program.currentPoints;
        name = `${name} (${program.programName})`;
      }
    }
    
    return {
      name,
      target,
      progress: currentProgress,
      remaining: Math.max(0, target - currentProgress),
    };
  });

  const chartConfig = {
    progress: { label: "Progress", color: "hsl(var(--primary))" },
    target: { label: "Target", color: "hsl(var(--accent))" },
  };

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ right: 20, left: 20 }}>
          <CartesianGrid horizontal={false} stroke="hsl(var(--border)/0.5)" />
          <XAxis 
            type="number" 
            axisLine={false} 
            tickLine={false} 
            fontSize={10} 
            stroke="hsl(var(--muted-foreground))" 
            tickFormatter={(value) => value.toLocaleString()}
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            tickLine={false} 
            axisLine={false} 
            fontSize={10} 
            width={100} 
            stroke="hsl(var(--muted-foreground))"
            interval={0}
          />
          <RechartsTooltip
            cursor={{ fill: "hsl(var(--muted)/0.3)" }}
            content={<ChartTooltipContent />}
            wrapperStyle={{ outline: "none", boxShadow: "hsl(var(--shadow-md))", borderRadius: "var(--radius)" }}
          />
          <Legend content={({ payload }) => (
            <div className="flex justify-center items-center gap-4 mt-2">
              {payload?.map((entry, index) => (
                <div key={`item-${index}`} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.value === 'progress' ? 'Current Progress' : 'Target Value'}
                </div>
              ))}
            </div>
          )} />
          <Bar dataKey="progress" stackId="a" fill="var(--color-progress)" radius={[4, 4, 0, 0]} barSize={15} />
          <Bar dataKey="remaining" stackId="a" fill="var(--color-target)" fillOpacity={0.3} radius={[0,0,4,4]} barSize={15} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
