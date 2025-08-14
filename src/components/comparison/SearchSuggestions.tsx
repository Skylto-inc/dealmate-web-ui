'use client';

import { SearchSuggestion } from '@/types/comparison';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
}

export function SearchSuggestions({ suggestions, onSuggestionClick }: SearchSuggestionsProps) {
  return (
    <div className="space-y-4">
      {/* Trending Searches */}
      <div>
        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Trending Now
        </h4>
        <div className="flex flex-wrap gap-2">
          {suggestions
            .filter(s => s.trending)
            .slice(0, 6)
            .map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-auto py-2 px-3 rounded-full hover:bg-primary/10 hover:border-primary/20"
              onClick={() => onSuggestionClick(suggestion)}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{suggestion.query}</span>
                <Badge variant="secondary" className="text-xs">
                  {suggestion.resultCount}
                </Badge>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Popular Searches */}
      <div>
        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Search className="h-4 w-4" />
          Popular Searches
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {suggestions
            .filter(s => !s.trending)
            .slice(0, 9)
            .map((suggestion, index) => (
            <Button
              key={index}
              variant="ghost"
              className="justify-start h-auto py-2 px-3 hover:bg-muted/50"
              onClick={() => onSuggestionClick(suggestion)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{suggestion.query}</span>
                  <span className="text-xs text-muted-foreground">
                    {suggestion.category}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {suggestion.resultCount}
                </Badge>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onSuggestionClick({ 
              query: 'Black Friday deals', 
              category: 'All', 
              resultCount: 500, 
              trending: true 
            })}
          >
            🔥 Hot Deals
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onSuggestionClick({ 
              query: 'under $50', 
              category: 'All', 
              resultCount: 300, 
              trending: false 
            })}
          >
            💰 Under $50
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onSuggestionClick({ 
              query: 'free shipping', 
              category: 'All', 
              resultCount: 200, 
              trending: false 
            })}
          >
            🚚 Free Ship
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onSuggestionClick({ 
              query: 'eco friendly', 
              category: 'All', 
              resultCount: 150, 
              trending: true 
            })}
          >
            🌱 Eco-Friendly
          </Button>
        </div>
      </div>
    </div>
  );
}
