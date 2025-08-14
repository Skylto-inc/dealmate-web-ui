'use client';

import { ComparisonCategory } from '@/types/comparison';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryGridProps {
  categories: ComparisonCategory[];
  onCategoryClick: (category: ComparisonCategory) => void;
}

export function CategoryGrid({ categories, onCategoryClick }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Card 
          key={category.id}
          className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group"
          onClick={() => onCategoryClick(category)}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              {/* Subcategories */}
              <div className="flex flex-wrap gap-1">
                {category.subcategories.slice(0, 3).map((subcategory, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs"
                  >
                    {subcategory}
                  </Badge>
                ))}
                {category.subcategories.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{category.subcategories.length - 3}
                  </Badge>
                )}
              </div>

              {/* Popular Searches Preview */}
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground font-medium">
                  Popular:
                </div>
                <div className="text-xs text-muted-foreground">
                  {category.popularSearches.slice(0, 2).join(', ')}
                  {category.popularSearches.length > 2 && '...'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
