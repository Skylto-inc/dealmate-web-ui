
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { UserRewardGoal, UserCard, LoyaltyProgram } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Target } from 'lucide-react';
import { useState } from 'react';

const rewardGoalFormSchema = z.object({
  description: z.string().min(5, { message: "Goal description must be at least 5 characters." }).max(100, { message: "Description too long."}),
  targetType: z.enum(['monetary_savings_monthly', 'points_milestone_card', 'points_milestone_program'], { required_error: "Goal type is required."}),
  targetValue: z.preprocess(
    (val) => (val === "" ? undefined : Number(String(val).trim())),
    z.number({required_error: "Target value is required."}).min(1, { message: "Target value must be positive." })
  ),
  cardIdRef: z.string().optional(),
  loyaltyProgramIdRef: z.string().optional(),
  isActive: z.boolean().default(true),
}).superRefine((data, ctx) => {
    if (data.targetType === 'points_milestone_card' && !data.cardIdRef) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select a card for this goal type.",
            path: ['cardIdRef'],
        });
    }
    if (data.targetType === 'points_milestone_program' && !data.loyaltyProgramIdRef) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select a loyalty program for this goal type.",
            path: ['loyaltyProgramIdRef'],
        });
    }
});


type RewardGoalFormValues = Omit<UserRewardGoal, 'id' | 'userId'>;

interface RewardGoalFormProps {
  onSubmit: (data: RewardGoalFormValues) => Promise<void>;
  cards: UserCard[];
  loyaltyPrograms: LoyaltyProgram[];
  isLoading?: boolean;
  onCancel?: () => void;
}

export default function RewardGoalForm({ onSubmit, cards, loyaltyPrograms, isLoading, onCancel }: RewardGoalFormProps) {
  const form = useForm<z.infer<typeof rewardGoalFormSchema>>({
    resolver: zodResolver(rewardGoalFormSchema),
    defaultValues: {
      description: "",
      targetType: undefined,
      targetValue: undefined,
      cardIdRef: undefined,
      loyaltyProgramIdRef: undefined,
      isActive: true,
    },
  });

  const selectedTargetType = form.watch('targetType');

  const processSubmit = async (values: z.infer<typeof rewardGoalFormSchema>) => {
    await onSubmit(values as RewardGoalFormValues);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(processSubmit)} className="space-y-4 p-1">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Save for new headphones, Maximize HDFC points" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="targetType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select goal type" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="monetary_savings_monthly">Monthly Monetary Savings</SelectItem>
                  <SelectItem value="points_milestone_card">Card Points Milestone</SelectItem>
                  <SelectItem value="points_milestone_program">Loyalty Program Milestone</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedTargetType === 'points_milestone_card' && (
          <FormField
            control={form.control}
            name="cardIdRef"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Card</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Choose a card" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cards.map(card => (
                      <SelectItem key={card.id} value={card.id}>{card.bank} - {card.cardType}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedTargetType === 'points_milestone_program' && (
           <FormField
            control={form.control}
            name="loyaltyProgramIdRef"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Loyalty Program</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Choose a program" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {loyaltyPrograms.map(program => (
                      <SelectItem key={program.id} value={program.id}>{program.programName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="targetValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Target Value 
                {selectedTargetType === 'monetary_savings_monthly' ? ' (₹)' : selectedTargetType ? ' (Points)' : ''}
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 2000 or 50000" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Active Goal</FormLabel>
                <FormDescription>
                  Inactive goals won't be considered in rankings.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
            {onCancel && <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">Cancel</Button>}
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto flex-grow">
            <Target className="mr-2 h-4 w-4" /> {isLoading ? "Saving Goal..." : "Save Goal"}
            </Button>
        </div>
      </form>
    </Form>
  );
}

