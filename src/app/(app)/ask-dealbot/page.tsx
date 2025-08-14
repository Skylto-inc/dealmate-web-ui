'use client';

import { useState } from 'react';
import DealBotForm from '@/components/ask-dealbot/DealBotForm';
import DealBotResponse from '@/components/ask-dealbot/DealBotResponse';
import { handleAskDealBot } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { AskDealBotOutput } from '@/ai/flows/ask-deal-bot';

interface DealBotFormValues {
  query: string;
}

export default function AskDealBotPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AskDealBotOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState<string | undefined>(undefined); // Update `submittedQuery` state to use `string | undefined`
  const { toast } = useToast();

  const onSubmitQuery = async (data: DealBotFormValues) => {
    setIsLoading(true);
    setAiResponse(null);
    setError(null);
    setSubmittedQuery(data.query); // Store the submitted query

    const formData = new FormData();
    formData.append('query', data.query);

    const result = await handleAskDealBot(formData);

    if (result.error) {
      setError(result.error);
      toast({
        title: "DealBot Error",
        description: result.error,
        variant: "destructive",
      });
    } else if (result.data) {
      setAiResponse(result.data);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <div className="glass-card p-4 sm:p-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              🤖 Ask DealBot AI
            </h2>
            <p className="text-sm sm:text-md text-muted-foreground/80 mt-2">
              Get personalized deal advice and product recommendations from our AI assistant.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <DealBotForm onSubmitQuery={onSubmitQuery} isLoading={isLoading} />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <DealBotResponse 
              userQuery={submittedQuery} // Pass submitted query
              response={aiResponse?.response} 
              error={error} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
