'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLazyLoading, useBatchLoading } from '@/hooks/useLazyLoading';

interface DataLoaderProps<T> {
  loadData: () => Promise<T>;
  dependencies?: any[];
  cacheKey?: string;
  ttl?: number; // Time to live in milliseconds
  retryCount?: number;
  children: (data: T | null, loading: boolean, error: Error | null, retry: () => void) => React.ReactNode;
}

// Simple in-memory cache
const cache = new Map<string, { data: any; expires: number }>();

export function DataLoader<T>({
  loadData,
  dependencies = [],
  cacheKey,
  ttl = 5 * 60 * 1000, // 5 minutes default
  retryCount = 3,
  children,
}: DataLoaderProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retries, setRetries] = useState(0);

  // Memoize cache operations
  const getCachedData = useCallback(() => {
    if (!cacheKey) return null;
    const cached = cache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    return null;
  }, [cacheKey]);

  const setCachedData = useCallback((newData: T) => {
    if (cacheKey) {
      cache.set(cacheKey, {
        data: newData,
        expires: Date.now() + ttl,
      });
    }
  }, [cacheKey, ttl]);

  const executeLoad = useCallback(async () => {
    // Try cache first
    const cachedData = getCachedData();
    if (cachedData) {
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await loadData();
      setData(result);
      setCachedData(result);
      setRetries(0);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      
      // Retry logic
      if (retries < retryCount) {
        setRetries(prev => prev + 1);
        setTimeout(() => executeLoad(), 1000 * Math.pow(2, retries)); // Exponential backoff
      }
    } finally {
      setLoading(false);
    }
  }, [loadData, getCachedData, setCachedData, retries, retryCount]);

  const retry = useCallback(() => {
    setRetries(0);
    executeLoad();
  }, [executeLoad]);

  useEffect(() => {
    executeLoad();
  }, dependencies);

  return <>{children(data, loading, error, retry)}</>;
}

// Higher-order component for data loading
export function withDataLoader<P extends object, T>(
  WrappedComponent: React.ComponentType<P & { data: T | null; loading: boolean; error: Error | null }>,
  dataLoader: () => Promise<T>,
  options: {
    cacheKey?: string;
    ttl?: number;
    dependencies?: any[];
  } = {}
) {
  return function DataLoadedComponent(props: P) {
    return (
      <DataLoader
        loadData={dataLoader}
        cacheKey={options.cacheKey}
        ttl={options.ttl}
        dependencies={options.dependencies}
      >
        {(data, loading, error, retry) => (
          <WrappedComponent 
            {...props} 
            data={data} 
            loading={loading} 
            error={error}
            retry={retry}
          />
        )}
      </DataLoader>
    );
  };
}

// Batch data loader for multiple items
export function BatchDataLoader<T>({
  items,
  loadItem,
  batchSize = 5,
  children,
}: {
  items: string[];
  loadItem: (id: string) => Promise<T>;
  batchSize?: number;
  children: (loadedItems: Map<string, T>, loading: boolean, loadMore: () => void) => React.ReactNode;
}) {
  const [loadedItems, setLoadedItems] = useState<Map<string, T>>(new Map());
  const [loading, setLoading] = useState(false);
  const { shouldLoadItem, loadNextBatch, markItemLoaded } = useBatchLoading(batchSize);

  const loadMore = useCallback(async () => {
    setLoading(true);
    
    const itemsToLoad = items.filter((item, index) => 
      shouldLoadItem(index) && !loadedItems.has(item)
    );

    try {
      const promises = itemsToLoad.map(async (item, index) => {
        const data = await loadItem(item);
        markItemLoaded(index);
        return [item, data] as const;
      });

      const results = await Promise.allSettled(promises);
      
      setLoadedItems(prev => {
        const newMap = new Map(prev);
        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            const [id, data] = result.value;
            newMap.set(id, data);
          }
        });
        return newMap;
      });
      
      loadNextBatch();
    } catch (error) {
      console.error('Batch loading error:', error);
    } finally {
      setLoading(false);
    }
  }, [items, loadItem, shouldLoadItem, loadedItems, markItemLoaded, loadNextBatch]);

  useEffect(() => {
    if (items.length > 0 && loadedItems.size === 0) {
      loadMore();
    }
  }, [items.length, loadedItems.size, loadMore]);

  return <>{children(loadedItems, loading, loadMore)}</>;
}

export default DataLoader;
