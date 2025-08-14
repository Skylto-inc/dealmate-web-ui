
'use client';

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingDown } from 'lucide-react';

const mockChartData = [
  { date: 'Jan 1', price: 1200, platformA: 1200, platformB: 1220 },
  { date: 'Jan 8', price: 1150, platformA: 1150, platformB: 1170 },
  { date: 'Jan 15', price: 1180, platformA: 1180, platformB: 1160 },
  { date: 'Jan 22', price: 1100, platformA: 1100, platformB: 1100 },
  { date: 'Jan 29', price: 1050, platformA: 1050, platformB: 1080 },
  { date: 'Feb 5', price: 1080, platformA: 1080, platformB: 1070 },
];

const chartConfig = {
  price: { label: "Avg Price (₹)", color: "hsl(var(--primary))" },
  platformA: { label: "Amazon (₹)", color: "hsl(var(--chart-2))" },
  platformB: { label: "Flipkart (₹)", color: "hsl(var(--chart-3))" },
};

export default function PriceHistoryChart() {
  return (
    <Card className="shadow-lg neumorphic-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-foreground">
          <TrendingDown className="h-5 w-5 text-primary" />
          Price History
        </CardTitle>
        <CardDescription className="text-muted-foreground">Mock price trends over the last few weeks.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart data={mockChartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
            <XAxis
              dataKey="date"
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
              cursor={{ stroke: "hsl(var(--accent))", strokeWidth: 1, strokeDasharray: "3 3" }}
              content={<ChartTooltipContent indicator="line" nameKey="name" labelKey="price" />}
              wrapperStyle={{ outline: "none", boxShadow: "hsl(var(--shadow-md))", borderRadius: "var(--radius)" }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{color: "hsl(var(--muted-foreground))"}} />
            <Line dataKey="platformA" name="Amazon" type="monotone" stroke="var(--color-platformA)" strokeWidth={2} dot={{ r: 3, fill: "var(--color-platformA)" }} activeDot={{r: 5}} />
            <Line dataKey="platformB" name="Flipkart" type="monotone" stroke="var(--color-platformB)" strokeWidth={2} dot={{ r: 3, fill: "var(--color-platformB)" }} activeDot={{r: 5}} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
