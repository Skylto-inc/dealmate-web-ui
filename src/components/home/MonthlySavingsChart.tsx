
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PiggyBank } from 'lucide-react'; // Using a different icon

const mockSavingsData = [
  { month: 'Jan', savings: 450 },
  { month: 'Feb', savings: 620 },
  { month: 'Mar', savings: 300 },
  { month: 'Apr', savings: 780 },
  { month: 'May', savings: 550 }, // Current month (partial or projected)
];

const chartConfig = {
  savings: {
    label: "Savings (₹)",
    color: "hsl(var(--chart-3))", // Using a green color for savings
  },
};

export default function MonthlySavingsChart() {
  return (
    <Card className="shadow-lg neumorphic-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-foreground">
          <PiggyBank className="h-5 w-5 text-primary" />
          Monthly Savings Tracker
        </CardTitle>
        <CardDescription className="text-muted-foreground">Your estimated savings over the past months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={mockSavingsData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={10}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={10}
              tickFormatter={(value) => `₹${value}`}
              stroke="hsl(var(--muted-foreground))"
            />
            <RechartsTooltip
              cursor={{ fill: "hsl(var(--muted)/0.3)" }}
                content={<ChartTooltipContent />}
              wrapperStyle={{ outline: "none", boxShadow: "hsl(var(--shadow-md))", borderRadius: "var(--radius)" }}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{color: "hsl(var(--muted-foreground))"}} />
            <Bar dataKey="savings" fill="var(--color-savings)" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
