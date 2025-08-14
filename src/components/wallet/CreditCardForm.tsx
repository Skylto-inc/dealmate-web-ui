
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { UserCard } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Save } from 'lucide-react';
import { PaymentLoader } from '@/components/ui/animated-loader';

const cardFormSchema = z.object({
  bank: z.string().min(2, { message: "Bank name must be at least 2 characters." }),
  cardType: z.string().min(2, { message: "Card type/name must be at least 2 characters." }),
  last4Digits: z.string().length(4, { message: "Must be last 4 digits."}).optional().or(z.literal('')),
  
  rewards_per_rupee: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(String(val).trim())),
    z.number().min(0).optional()
  ),
  reward_value_inr: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(String(val).trim())),
    z.number().min(0).optional()
  ),
  current_points: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(String(val).trim())),
    z.number().int("Must be a whole number.").min(0).optional()
  ),
  next_reward_threshold: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(String(val).trim())),
    z.number().int("Must be a whole number.").min(0).optional()
  ),
  next_reward_value: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(String(val).trim())),
    z.number().min(0).optional()
  ),
});

type CardFormValues = Omit<UserCard, 'id' | 'userId'>;

interface CreditCardFormProps {
  onSubmit: (data: CardFormValues) => Promise<void>;
  initialData?: Partial<UserCard>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export default function CreditCardForm({ onSubmit, initialData, isLoading, onCancel }: CreditCardFormProps) {
  const form = useForm<z.infer<typeof cardFormSchema>>({ // Use inferred schema type for form
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      bank: initialData?.bank || "",
      cardType: initialData?.cardType || "",
      last4Digits: initialData?.last4Digits || "",
      rewards_per_rupee: initialData?.rewards_per_rupee || undefined,
      reward_value_inr: initialData?.reward_value_inr || undefined,
      current_points: initialData?.current_points || undefined,
      next_reward_threshold: initialData?.next_reward_threshold || undefined,
      next_reward_value: initialData?.next_reward_value || undefined,
    },
  });

  const processSubmit = async (values: z.infer<typeof cardFormSchema>) => {
    const submitValues: CardFormValues = {
        ...values,
        name: `${values.bank} ${values.cardType}`,
        last4Digits: values.last4Digits || undefined, // Ensure empty string becomes undefined
    };
    await onSubmit(submitValues);
    form.reset(); 
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(processSubmit)} className="space-y-4 p-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="bank"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., HDFC, ICICI" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="cardType"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Card Type/Name</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Infinia, Millennia" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="last4Digits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last 4 Digits (Optional)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="1234" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <p className="text-md font-semibold text-foreground pt-3 border-t border-border">Reward Details</p>
        <FormDescription>
          Enter how your card earns rewards. For points, enter points/₹ and value/point. For direct cashback cards (e.g. 5% on everything), enter 0.05 in "Value/₹ Spent" and leave point fields blank.
        </FormDescription>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="rewards_per_rupee"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Points or Value / ₹ Spent</FormLabel>
                <FormControl>
                    <Input type="number" step="any" placeholder="e.g., 3 (for 3 pts) or 0.05 (for 5%)" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="reward_value_inr"
            render={({ field }) => (
                <FormItem>
                <FormLabel>1 Point Value (₹) (If applicable)</FormLabel>
                <FormControl>
                    <Input type="number" step="any" placeholder="e.g., 0.25" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <p className="text-md font-semibold text-foreground pt-3 border-t border-border">Milestone Perks (Optional)</p>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="current_points"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Current Points Balance</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g., 5000" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="next_reward_threshold"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Next Perk Threshold (Points)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g., 10000" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
         <FormField
            control={form.control}
            name="next_reward_value"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Next Perk Value (₹)</FormLabel>
                <FormControl>
                    <Input type="number" step="any" placeholder="e.g., 500" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        <div className="flex gap-2 pt-4">
            {onCancel && <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">Cancel</Button>}
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto flex-grow transform transition-transform duration-150 ease-in-out hover:scale-105 active:translate-y-px">
            <Save className="mr-2 h-4 w-4" /> {isLoading ? "Saving..." : "Save Card"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
