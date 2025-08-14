
'use client';

import type { LoyaltyProgram } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, TrendingUp, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LoyaltyProgramListProps {
  programs: LoyaltyProgram[];
}

export default function LoyaltyProgramList({ programs }: LoyaltyProgramListProps) {
  if (programs.length === 0) {
    return (
      <Alert className="bg-card-foreground/5 border-card-foreground/10">
        <Award className="h-5 w-5 text-primary" />
        <AlertTitle className="text-lg text-foreground">No Loyalty Programs Connected</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Connect your loyalty programs (e.g., Flipkart SuperCoins, Myntra Insider) to track points and get relevant deal suggestions. (Feature coming soon!)
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      {programs.map((program) => (
        <Card key={program.id} className="shadow-md bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center text-primary-foreground">
              <Award className="mr-2 h-5 w-5 text-accent" />
              {program.programName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-foreground/90">
            <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                <span>Current Points: {program.currentPoints.toLocaleString()}</span>
            </div>
            {program.pointValueInRupees && (
                 <div className="flex items-center">
                    <span className="font-medium w-6"></span> {/* Spacer */}
                    <span>Approx. Value: ₹{(program.currentPoints * program.pointValueInRupees).toLocaleString('en-IN', {minimumFractionDigits:0, maximumFractionDigits:0})}</span>
                </div>
            )}
            {program.nextTier && program.pointsToNextTier && (
                <div className="flex items-center">
                     <span className="font-medium w-6"></span> {/* Spacer */}
                    <span>Next Tier: {program.nextTier} ({program.pointsToNextTier.toLocaleString()} more points)</span>
                </div>
            )}
            {!program.pointValueInRupees && !program.nextTier && (
                 <div className="flex items-center text-xs text-muted-foreground">
                     <span className="font-medium w-6"></span> {/* Spacer */}
                    <span>General points tracking for this program.</span>
                </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
