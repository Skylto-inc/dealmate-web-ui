"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedLoaderProps {
  className?: string;
  words?: string[];
  loadingText?: string;
  size?: "sm" | "md" | "lg";
}

export function AnimatedLoader({ 
  className, 
  words = ["deals", "offers", "coupons", "savings", "deals"],
  loadingText = "loading",
  size = "md"
}: AnimatedLoaderProps) {
  const sizeClasses = {
    sm: "text-lg h-6",
    md: "text-xl sm:text-2xl h-8 sm:h-10", 
    lg: "text-2xl sm:text-3xl h-10 sm:h-12"
  };

  const cardClasses = {
    sm: "px-4 py-2 rounded-lg",
    md: "px-6 py-3 sm:px-8 sm:py-4 rounded-xl",
    lg: "px-8 py-4 sm:px-10 sm:py-6 rounded-2xl"
  };

  // @ts-ignore
  return (
    <div className={cn(
      "inline-block bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg",
      cardClasses[size],
      className
    )}>
      <div className={cn(
        "text-muted-foreground font-medium flex items-center gap-1 sm:gap-2",
        sizeClasses[size]
      )}>
        <span>{loadingText}</span>
        <div className={cn("overflow-hidden relative", sizeClasses[size])}>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10 pointer-events-none" />
          <div className="relative">
            {words.map((word, index) => (
              <span
                key={index}
                className={cn(
                  "block pl-1 sm:pl-2 text-primary font-semibold animate-word-spin",
                  sizeClasses[size]
                )}
                style={{
                  animationDelay: `${index * 0.8}s`,
                  animationDuration: `${words.length * 0.8}s`
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Predefined loaders for different contexts
export const DealLoader = ({ className, size }: { className?: string; size?: "sm" | "md" | "lg" }) => (
  // @ts-ignore
  <AnimatedLoader 
    className={className}
    size={size}
    words={["deals", "offers", "coupons", "savings", "deals"]}
    loadingText="finding"
  />
);

export const PaymentLoader = ({ className, size }: { className?: string; size?: "sm" | "md" | "lg" }) => (
  // @ts-ignore
  <AnimatedLoader
    className={className}
    size={size}
    words={["cards", "rewards", "cashback", "points", "cards"]}
    loadingText="processing"
  />
);

export const AuthLoader = ({ className, size, loadingText, words }: { className?: string; size?: "sm" | "md" | "lg"; loadingText?: string; words?: string[] }) => (
  // @ts-ignore
  <AnimatedLoader
    className={className}
    size={size}
    words={words || ["account", "profile", "settings", "data", "account"]}
    loadingText={loadingText || "loading"}
  />
);

export const SearchLoader = ({ className, size }: { className?: string; size?: "sm" | "md" | "lg" }) => (
  // @ts-ignore
  <AnimatedLoader
    className={className}
    size={size}
    words={["products", "prices", "reviews", "options", "products"]}
    loadingText="searching"
  />
);
