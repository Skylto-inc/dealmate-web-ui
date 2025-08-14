/**
 * Advanced Lazy Loading Utilities
 * Implements intersection observer, priority loading, and resource hints
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface LazyLoadOptions {
  rootMargin?: string;
  threshold?: number | number[];
  priority?: 'high' | 'medium' | 'low';
  preload?: boolean;
}

export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: LazyLoadOptions = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<T>(null);

  useEffect(() => {
    if (!targetRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasIntersected(true);
        }
      },
      {
        rootMargin: options.rootMargin || '50px',
        threshold: options.threshold || 0.1,
      }
    );

    observer.observe(targetRef.current);

    return () => {
      observer.disconnect();
    };
  }, [options.rootMargin, options.threshold]);

  return { targetRef, isIntersecting, hasIntersected };
}

/**
 * Priority Queue for managing lazy loading order
 */
class LazyLoadQueue {
  private queue: Map<string, { priority: number; callback: () => void }> = new Map();
  private processing = false;

  add(id: string, priority: number, callback: () => void) {
    this.queue.set(id, { priority, callback });
    this.process();
  }

  remove(id: string) {
    this.queue.delete(id);
  }

  private async process() {
    if (this.processing || this.queue.size === 0) return;
    
    this.processing = true;
    
    // Sort by priority
    const sorted = Array.from(this.queue.entries()).sort(
      ([, a], [, b]) => b.priority - a.priority
    );

    // Process in batches
    const batchSize = 3;
    for (let i = 0; i < sorted.length; i += batchSize) {
      const batch = sorted.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(([id, { callback }]) => {
          this.queue.delete(id);
          return callback();
        })
      );
      
      // Small delay between batches
      if (i + batchSize < sorted.length) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
    
    this.processing = false;
  }
}

export const lazyLoadQueue = new LazyLoadQueue();

/**
 * Hook for priority-based lazy loading
 */
export function useLazyLoad(
  id: string,
  loadComponent: () => Promise<any>,
  options: LazyLoadOptions = {}
) {
  const [Component, setComponent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { targetRef, hasIntersected } = useIntersectionObserver<HTMLDivElement>(options);

  const load = useCallback(async () => {
    if (Component || isLoading) return;
    
    setIsLoading(true);
    try {
      const loadedModule = await loadComponent();
      setComponent(() => loadedModule.default || loadedModule);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to load component:', err);
    } finally {
      setIsLoading(false);
    }
  }, [Component, isLoading, loadComponent]);

  useEffect(() => {
    if (hasIntersected && !Component && !isLoading) {
      const priority = options.priority === 'high' ? 3 : 
                      options.priority === 'medium' ? 2 : 1;
      
      lazyLoadQueue.add(id, priority, load);
    }
    
    return () => {
      lazyLoadQueue.remove(id);
    };
  }, [hasIntersected, Component, isLoading, id, options.priority, load]);

  // Preload on hover
  const preload = useCallback(() => {
    if (!Component && !isLoading) {
      load();
    }
  }, [Component, isLoading, load]);

  return {
    Component,
    isLoading,
    error,
    targetRef,
    preload,
  };
}

/**
 * Resource hints for optimizing network requests
 */
export function useResourceHints(resources: Array<{ url: string; as?: string }>) {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];

    resources.forEach(({ url, as }) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      if (as) link.as = as;
      document.head.appendChild(link);
      links.push(link);
    });

    return () => {
      links.forEach(link => link.remove());
    };
  }, [resources]);
}

/**
 * Optimized image loading with placeholder
 */
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const { targetRef, hasIntersected } = useIntersectionObserver();

  useEffect(() => {
    if (!hasIntersected || !src) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
    };
  }, [hasIntersected, src]);

  return {
    imageSrc,
    isLoaded,
    targetRef,
  };
}

/**
 * Batch DOM updates for better performance
 */
export function useBatchedUpdates() {
  const pendingUpdates = useRef<(() => void)[]>([]);
  const rafId = useRef<number>();

  const scheduleUpdate = useCallback((update: () => void) => {
    pendingUpdates.current.push(update);
    
    if (rafId.current) return;
    
    rafId.current = requestAnimationFrame(() => {
      const updates = pendingUpdates.current;
      pendingUpdates.current = [];
      rafId.current = undefined;
      
      updates.forEach(update => update());
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return scheduleUpdate;
}

/**
 * Memory-efficient data caching
 */
export class DataCache<T> {
  private cache = new Map<string, { data: T; timestamp: number }>();
  private maxSize: number;
  private ttl: number;

  constructor(maxSize = 100, ttl = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  set(key: string, data: T) {
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldest = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0];
      if (oldest) this.cache.delete(oldest[0]);
    }

    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Global data cache instance
export const globalDataCache = new DataCache();
