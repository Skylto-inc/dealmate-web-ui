import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PriceComparison {
  platform: string;
  price: string;
  link: string;
}

const mockComparisons: PriceComparison[] = [
  { platform: 'Amazon.in', price: '₹1,050', link: '#' },
  { platform: 'Flipkart', price: '₹1,020', link: '#' },
  { platform: 'Myntra', price: '₹1,100', link: '#' },
];

export default function PriceComparisonTable({ comparisons = mockComparisons }: { comparisons?: PriceComparison[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md">Price Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {comparisons.map((item) => (
            <div key={item.platform} className="flex items-center justify-between p-4">
              <div className="flex flex-col">
                <span className="font-medium">{item.platform}</span>
                <span className="text-muted-foreground">{item.price}</span>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <a href={item.link} target="_blank" rel="noopener noreferrer" aria-label={`View on ${item.platform}`}>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
