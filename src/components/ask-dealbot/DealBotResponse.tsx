
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, AlertTriangle, User } from 'lucide-react';
import { DotsLoader } from '@/components/ui/dots-loader';

interface DealBotResponseProps {
  userQuery?: string; // Optional: display the user's query
  response?: string | null;
  error?: string | null;
  isLoading: boolean;
}

export default function DealBotResponse({ userQuery, response, error, isLoading }: DealBotResponseProps) {
  if (!response && !error && !isLoading && !userQuery) {
    return null; 
  }

  return (
    <div className="mt-6 space-y-4">
      {userQuery && !isLoading && (
        <Card className="bg-secondary/50 border-secondary shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center gap-2 text-secondary-foreground">
              <User className="h-5 w-5 text-accent" />
              Your Query
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-secondary-foreground/90 whitespace-pre-wrap">{userQuery}</p>
          </CardContent>
        </Card>
      )}

      {(isLoading || response || error) && (
        <Card className="bg-card shadow-xl neumorphic-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-primary-foreground">
              <Bot className="h-6 w-6 text-primary" />
              DealBot's Advice
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-[120px] text-base">
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <DotsLoader />
                </div>
            )}
            {error && !isLoading && (
              <div className="text-destructive flex items-start gap-3 p-3 bg-destructive/10 rounded-md">
                <AlertTriangle className="h-6 w-6 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-lg">Oops! Something went wrong.</p>
                  <p className="text-md">{error}</p>
                </div>
              </div>
            )}
            {response && !isLoading && !error && (
              <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{response}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
