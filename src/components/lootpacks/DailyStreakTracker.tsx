"use client";

import { FC } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Calendar, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DailyStreakTrackerProps {
  streak: number;
}

const DailyStreakTracker: FC<DailyStreakTrackerProps> = ({ streak }) => {
  const milestones = [
    { days: 3, reward: 'Bronze Pack', completed: streak >= 3 },
    { days: 7, reward: 'Silver Pack', completed: streak >= 7 },
    { days: 14, reward: 'Gold Pack', completed: streak >= 14 },
    { days: 30, reward: 'Legendary Pack', completed: streak >= 30 },
  ];

  const nextMilestone = milestones.find(m => !m.completed);
  const daysUntilNext = nextMilestone ? nextMilestone.days - streak : 0;

  return (
    <Card className="p-4 mb-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/20">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              Daily Streak
              {streak >= 7 && <Badge variant="secondary" className="text-xs">On Fire!</Badge>}
            </h3>
            <p className="text-sm text-muted-foreground">
              {streak} day{streak !== 1 ? 's' : ''} in a row
            </p>
          </div>
        </div>

        {/* Milestone Progress */}
        <div className="text-right">
          {nextMilestone ? (
            <>
              <p className="text-sm font-medium">{daysUntilNext} days until</p>
              <p className="text-sm text-muted-foreground">{nextMilestone.reward}</p>
            </>
          ) : (
            <p className="text-sm font-medium text-green-500">All milestones complete!</p>
          )}
        </div>
      </div>

      {/* Streak Calendar */}
      <div className="mt-4 grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }, (_, i) => {
          const dayNum = i + 1;
          const isActive = dayNum <= (streak % 7 || 7) && streak > 0;
          const isPastWeek = streak > 7;
          
          return (
            <div
              key={i}
              className={cn(
                "aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all",
                isActive
                  ? "bg-orange-500 text-white"
                  : isPastWeek && dayNum <= streak - 7
                  ? "bg-orange-500/30 text-orange-200"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {dayNum}
            </div>
          );
        })}
      </div>

      {/* Milestones */}
      <div className="mt-4 space-y-2">
        <p className="text-sm font-medium mb-2">Streak Rewards</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {milestones.map((milestone) => (
            <div
              key={milestone.days}
              className={cn(
                "p-2 rounded-lg text-center transition-all",
                milestone.completed
                  ? "bg-green-500/20 border border-green-500/30"
                  : "bg-muted/50 border border-border"
              )}
            >
              <div className="flex items-center justify-center mb-1">
                {milestone.completed ? (
                  <Gift className="w-4 h-4 text-green-500" />
                ) : (
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <p className="text-xs font-medium">{milestone.days} days</p>
              <p className="text-xs text-muted-foreground">{milestone.reward}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default DailyStreakTracker;
