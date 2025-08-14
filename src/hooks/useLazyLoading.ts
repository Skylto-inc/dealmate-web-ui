'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// Hook for intersection observer-based lazy loading
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefObject<HTMLElement>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [elementRef, isIntersecting];
}

// Hook for lazy loading with visibility state
export function useLazyLoading(threshold = 0.1, rootMargin = '50px') {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Disconnect after first intersection to prevent re-triggering
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, isVisible]);

  const markAsLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return {
    elementRef,
    isVisible,
    isLoaded,
    markAsLoaded,
  };
}

// Hook for progressive loading with delay
export function useProgressiveLoading(delay = 0) {
  const [shouldLoad, setShouldLoad] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setShouldLoad(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [delay]);

  return shouldLoad;
}

// Hook for debounced loading
export function useDebouncedLoading(value: boolean, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook for batch loading management
export function useBatchLoading(batchSize = 3) {
  const [loadedItems, setLoadedItems] = useState<Set<number>>(new Set());
  const [currentBatch, setCurrentBatch] = useState(0);

  const shouldLoadItem = useCallback((index: number) => {
    return index < (currentBatch + 1) * batchSize;
  }, [currentBatch, batchSize]);

  const loadNextBatch = useCallback(() => {
    setCurrentBatch(prev => prev + 1);
  }, []);

  const markItemLoaded = useCallback((index: number) => {
    setLoadedItems(prev => new Set(prev).add(index));
  }, []);

  const isItemLoaded = useCallback((index: number) => {
    return loadedItems.has(index);
  }, [loadedItems]);

  return {
    shouldLoadItem,
    loadNextBatch,
    markItemLoaded,
    isItemLoaded,
    currentBatch,
  };
}
