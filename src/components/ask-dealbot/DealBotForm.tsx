'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Send } from 'lucide-react';

const dealBotFormSchema = z.object({
  query: z.string()
    .min(5, { message: "Please enter at least 5 characters." })
    .max(300, { message: "Query too long (max 300 characters)." })
    .refine((val) => val.trim().length > 0, { message: "Please enter a valid question." }),
});

type DealBotFormValues = z.infer<typeof dealBotFormSchema>;

interface DealBotFormProps {
  onSubmitQuery: (data: DealBotFormValues) => Promise<void>;
  isLoading: boolean;
}

export default function DealBotForm({ onSubmitQuery, isLoading }: DealBotFormProps) {
  const form = useForm<DealBotFormValues>({
    resolver: zodResolver(dealBotFormSchema),
    defaultValues: {
      query: "",
    },
  });

  return (
    <div className="glass-card p-3 xs:p-4 sm:p-6">
          <Form {...form}>
        <form onSubmit={form.handleSubmit(async (data) => {
          await onSubmitQuery(data);
          form.reset(); // Clear the form after submission
        })} className="space-y-3 xs:space-y-4 sm:space-y-6">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="space-y-2 xs:space-y-3">
                <FormLabel 
                  htmlFor="dealbot-query" 
                  className="text-base xs:text-lg sm:text-xl font-medium text-foreground flex items-center gap-2"
                >
                  <span className="text-xl xs:text-2xl">🤖</span>
                  Ask DealBot
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      id="dealbot-query"
                      placeholder="e.g., 'Find the best deal on a 65-inch 4K TV with good HDFC card offers.'"
                      className="resize-none min-h-[80px] xs:min-h-[100px] sm:min-h-[120px] bg-card/80 border-border/70 focus:border-primary ring-offset-background placeholder:text-muted-foreground text-sm xs:text-base p-3 xs:p-4 shadow-inner rounded-lg transition-all duration-200 focus:shadow-lg focus:shadow-primary/20"
                      {...field}
                      aria-describedby="dealbot-query-message"
                      maxLength={300}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                      {field.value.length}/300
                    </div>
                  </div>
                </FormControl>
                <FormMessage id="dealbot-query-message" className="text-xs xs:text-sm pl-2" />
                
                {/* Quick Suggestions - Mobile Friendly */}
                <div className="flex items-center flex-wrap gap-1.5 xs:gap-2 mt-2">
                  <span className="text-xs xs:text-sm text-muted-foreground">Try:</span>
                  {[
                    "Best laptop deals",
                    "HDFC card offers",
                    "iPhone discounts"
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => form.setValue('query', suggestion)}
                      className="text-xs xs:text-sm px-2 py-1 bg-muted/20 hover:bg-muted/40 rounded-full transition-colors touch-target"
                      disabled={isLoading}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={isLoading || !form.watch('query').trim()} 
            className="w-full touch-target py-3 xs:py-4 text-sm xs:text-base font-semibold shadow-lg hover:shadow-primary/40 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 xs:h-5 xs:w-5 animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4 xs:h-5 xs:w-5" />
                <span>Ask DealBot</span>
              </>
            )}
          </Button>
          
          {/* Help Text - Mobile Optimized */}
          <div className="text-xs xs:text-sm text-muted-foreground/80 text-center space-y-1">
            <p>💡 DealBot can help you find the best deals, compare prices, and suggest optimal payment methods.</p>
            <p className="hidden xs:block">Ask about specific products, brands, or shopping categories for personalized recommendations.</p>
          </div>
        </form>
      </Form>
    </div>
  );
}
