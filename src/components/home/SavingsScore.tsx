import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface SavingsScoreProps {
  score: string;
  percentageOff: string;
}

export default function SavingsScore({ score = "₹250", percentageOff = "20%" }: SavingsScoreProps) {
  return (
    <Card className="neumorphic-card bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground h-full">
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-sm sm:text-md flex items-center gap-2">
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">Unified Savings</span>
          <span className="sm:hidden">Savings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center pt-0">
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">{score}</p>
        <p className="text-xs sm:text-sm opacity-90">
          <span className="hidden sm:inline">({percentageOff} potential savings)</span>
          <span className="sm:hidden">{percentageOff} saved</span>
        </p>
      </CardContent>
    </Card>
  );
}
