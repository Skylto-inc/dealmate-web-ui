import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TicketPercent, CreditCard } from 'lucide-react';

interface Offer {
  type: 'coupon' | 'cashback';
  description: string;
  value: string;
}

const mockOffers: Offer[] = [
  { type: 'coupon', description: 'FLAT100', value: '₹100 OFF' },
  { type: 'cashback', description: '5% Cashback HDFC', value: 'Up to ₹50' },
  { type: 'coupon', description: 'SAVVY20', value: '20% OFF' },
];

export default function OffersList({ title, offers = mockOffers, icon: Icon }: { title: string; offers?: Offer[]; icon: React.ElementType }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {offers.map((offer, index) => (
            <li key={index} className="flex justify-between items-center p-2 bg-secondary/30 rounded-md">
              <span className="text-sm text-foreground">{offer.description}</span>
              <Badge variant={offer.type === 'coupon' ? 'default' : 'accent'} className="text-xs">{offer.value}</Badge>
            </li>
          ))}
        </ul>
        {offers.length === 0 && <p className="text-sm text-muted-foreground">No {title.toLowerCase()} available right now.</p>}
      </CardContent>
    </Card>
  );
}
