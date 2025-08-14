/**
 * Real-time Fraud Detection Engine for DealMate
 * Detects fake deals, counterfeit products, phishing links, price manipulation, and suspicious user behavior
 */

// MinHeap implementation for tracking anomalies
class MinHeap<T> {
  private heap: T[] = [];
  private compareFn: (a: T, b: T) => number;

  constructor(compareFn: (a: T, b: T) => number) {
    this.compareFn = compareFn;
  }

  insert(value: T): void {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }

  extractMin(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown(0);
    return min;
  }

  peek(): T | undefined {
    return this.heap[0];
  }

  size(): number {
    return this.heap.length;
  }

  private heapifyUp(index: number): void {
    const parentIndex = Math.floor((index - 1) / 2);
    if (parentIndex >= 0 && this.compareFn(this.heap[index], this.heap[parentIndex]) < 0) {
      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
      this.heapifyUp(parentIndex);
    }
  }

  private heapifyDown(index: number): void {
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;
    let smallest = index;

    if (leftChild < this.heap.length && this.compareFn(this.heap[leftChild], this.heap[smallest]) < 0) {
      smallest = leftChild;
    }
    if (rightChild < this.heap.length && this.compareFn(this.heap[rightChild], this.heap[smallest]) < 0) {
      smallest = rightChild;
    }

    if (smallest !== index) {
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      this.heapifyDown(smallest);
    }
  }
}

// Trie implementation for phishing URL detection
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfPattern: boolean = false;
}

class Trie {
  private root: TrieNode = new TrieNode();

  insert(pattern: string): void {
    let current = this.root;
    for (const char of pattern) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
    }
    current.isEndOfPattern = true;
  }

  search(text: string): boolean {
    for (let i = 0; i < text.length; i++) {
      if (this.searchFromIndex(text, i)) {
        return true;
      }
    }
    return false;
  }

  private searchFromIndex(text: string, startIndex: number): boolean {
    let current = this.root;
    for (let i = startIndex; i < text.length; i++) {
      const char = text[i];
      if (!current.children.has(char)) {
        return false;
      }
      current = current.children.get(char)!;
      if (current.isEndOfPattern) {
        return true;
      }
    }
    return false;
  }
}

// Types
export interface Deal {
  id: string;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  category: string;
  sellerId: string;
  url: string;
  timestamp: number;
}

export interface Seller {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
}

export interface PriceHistory {
  productId: string;
  prices: { price: number; timestamp: number }[];
}

export interface UserActivity {
  userId: string;
  action: string;
  timestamp: number;
}

export interface FraudCheckResult {
  isFraudulent: boolean;
  fraudType?: string;
  confidence: number;
  reason?: string;
}

export interface CategoryThresholds {
  [category: string]: number;
}

// Fraud Detection Engine
export class FraudDetectionEngine {
  private phishingTrie: Trie;
  private userActivityCache: Map<string, number[]>;
  private categoryThresholds: CategoryThresholds;
  private anomalyHeap: MinHeap<{ dealId: string; anomalyScore: number }>;
  private sellerReputationCache: Map<string, Seller>;
  private priceHistoryCache: Map<string, PriceHistory>;

  constructor() {
    this.phishingTrie = new Trie();
    this.userActivityCache = new Map();
    this.categoryThresholds = {
      electronics: 0.7,
      fashion: 0.9,
      home: 0.8,
      food: 0.6,
      default: 0.85
    };
    this.anomalyHeap = new MinHeap((a, b) => b.anomalyScore - a.anomalyScore);
    this.sellerReputationCache = new Map();
    this.priceHistoryCache = new Map();

    // Initialize with known phishing patterns
    this.initializePhishingPatterns();
    // Initialize with mock seller data
    this.initializeSellerData();
    // Initialize with mock price history
    this.initializePriceHistory();
  }

  /**
   * Main fraud detection method that runs all checks
   */
  async detectFraud(deal: Deal, sellerId?: string): Promise<FraudCheckResult[]> {
    const results: FraudCheckResult[] = [];

    // Check for fake deals
    const fakeDealsResult = this.detectFakeDeals([deal]);
    if (fakeDealsResult.length > 0) {
      results.push(...fakeDealsResult);
    }

    // Check for counterfeit products
    if (sellerId) {
      const counterfeitsResult = this.detectCounterfeitProducts([sellerId]);
      if (counterfeitsResult.length > 0) {
        results.push(...counterfeitsResult);
      }
    }

    // Check for phishing links
    const phishingResult = this.detectPhishingLinks([deal.url]);
    if (phishingResult.length > 0) {
      results.push(...phishingResult);
    }

    // Check for price manipulation
    const priceManipulationResult = this.detectPriceManipulation(deal.id, deal.originalPrice);
    if (priceManipulationResult.isFraudulent) {
      results.push(priceManipulationResult);
    }

    return results;
  }

  /**
   * Detect fake deals based on discount percentages
   */
  detectFakeDeals(deals: Deal[]): FraudCheckResult[] {
    const results: FraudCheckResult[] = [];

    for (const deal of deals) {
      const discountPercentage = ((deal.originalPrice - deal.discountedPrice) / deal.originalPrice) * 100;
      const threshold = this.categoryThresholds[deal.category] || this.categoryThresholds.default;
      const thresholdPercentage = threshold * 100;

      if (discountPercentage > thresholdPercentage) {
        const anomalyScore = discountPercentage - thresholdPercentage;
        this.anomalyHeap.insert({ dealId: deal.id, anomalyScore });

        results.push({
          isFraudulent: true,
          fraudType: 'fake_deal',
          confidence: Math.min(anomalyScore / 20, 0.95),
          reason: `Discount of ${discountPercentage.toFixed(1)}% exceeds category threshold of ${thresholdPercentage}%`
        });
      }
    }

    return results;
  }

  /**
   * Detect counterfeit products based on seller reputation
   */
  detectCounterfeitProducts(sellerIds: string[]): FraudCheckResult[] {
    const results: FraudCheckResult[] = [];
    const RATING_THRESHOLD = 3.5;
    const REVIEW_COUNT_THRESHOLD = 50;

    for (const sellerId of sellerIds) {
      const seller = this.sellerReputationCache.get(sellerId);
      if (!seller) continue;

      if (seller.rating < RATING_THRESHOLD || seller.reviewCount < REVIEW_COUNT_THRESHOLD) {
        results.push({
          isFraudulent: true,
          fraudType: 'counterfeit_product',
          confidence: seller.rating < 2.5 ? 0.9 : 0.7,
          reason: `Seller has low rating (${seller.rating}/5) or insufficient reviews (${seller.reviewCount})`
        });
      }
    }

    return results;
  }

  /**
   * Detect phishing links using Trie pattern matching
   */
  detectPhishingLinks(urls: string[]): FraudCheckResult[] {
    const results: FraudCheckResult[] = [];

    for (const url of urls) {
      if (this.phishingTrie.search(url.toLowerCase())) {
        results.push({
          isFraudulent: true,
          fraudType: 'phishing_link',
          confidence: 0.95,
          reason: 'URL matches known phishing patterns'
        });
      }
    }

    return results;
  }

  /**
   * Detect price manipulation through historical analysis
   */
  detectPriceManipulation(productId: string, currentPrice: number): FraudCheckResult {
    const history = this.priceHistoryCache.get(productId);
    if (!history || history.prices.length < 3) {
      return { isFraudulent: false, confidence: 0 };
    }

    // Calculate median price using median-of-medians approach for efficiency
    const prices = history.prices.map(p => p.price);
    const medianPrice = this.calculateMedian(prices);
    const deviation = Math.abs(currentPrice - medianPrice) / medianPrice;
    const DEVIATION_THRESHOLD = 0.3; // 30% deviation

    if (deviation > DEVIATION_THRESHOLD) {
      return {
        isFraudulent: true,
        fraudType: 'price_manipulation',
        confidence: Math.min(deviation * 2, 0.95),
        reason: `Price deviates ${(deviation * 100).toFixed(1)}% from historical median of ₹${medianPrice.toFixed(2)}`
      };
    }

    return { isFraudulent: false, confidence: 0 };
  }

  /**
   * Detect suspicious user behavior (bots, rapid actions)
   */
  detectSuspiciousUserBehavior(userId: string, action: string): FraudCheckResult {
    const now = Date.now();
    const userTimestamps = this.userActivityCache.get(userId) || [];
    
    // Add current timestamp
    userTimestamps.push(now);
    
    // Keep only recent timestamps (last 60 seconds)
    const recentTimestamps = userTimestamps.filter(ts => now - ts < 60000);
    this.userActivityCache.set(userId, recentTimestamps);

    // Check for rapid actions (more than 10 actions in 1 second)
    const oneSecondAgo = now - 1000;
    const rapidActions = recentTimestamps.filter(ts => ts > oneSecondAgo).length;

    if (rapidActions > 10) {
      return {
        isFraudulent: true,
        fraudType: 'suspicious_behavior',
        confidence: Math.min(rapidActions / 15, 0.95),
        reason: `User performed ${rapidActions} actions in 1 second`
      };
    }

    // Check for sustained high activity (more than 100 actions per minute)
    if (recentTimestamps.length > 100) {
      return {
        isFraudulent: true,
        fraudType: 'bot_behavior',
        confidence: 0.85,
        reason: `User performed ${recentTimestamps.length} actions in the last minute`
      };
    }

    return { isFraudulent: false, confidence: 0 };
  }

  /**
   * Get top anomalies from the heap
   */
  getTopAnomalies(count: number): { dealId: string; anomalyScore: number }[] {
    const anomalies: { dealId: string; anomalyScore: number }[] = [];
    for (let i = 0; i < count && this.anomalyHeap.size() > 0; i++) {
      const anomaly = this.anomalyHeap.extractMin();
      if (anomaly) anomalies.push(anomaly);
    }
    // Re-insert for future use
    anomalies.forEach(a => this.anomalyHeap.insert(a));
    return anomalies;
  }

  /**
   * Efficient median calculation using median-of-medians
   */
  private calculateMedian(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  /**
   * Initialize phishing patterns
   */
  private initializePhishingPatterns(): void {
    const phishingPatterns = [
      'bit.ly/scam',
      'tinyurl.com/fake',
      'phishing-site.com',
      'amazom.com', // Common typo
      'amaz0n.com', // Using zero instead of 'o'
      'flipkrt.com', // Missing 'a'
      'paypal-secure.fake',
      'banking-login.phish',
      'free-iphone-winner',
      'click-here-now.suspicious',
      'urgent-action-required',
      'verify-account.scam'
    ];

    phishingPatterns.forEach(pattern => this.phishingTrie.insert(pattern));
  }

  /**
   * Initialize mock seller data
   */
  private initializeSellerData(): void {
    const sellers: Seller[] = [
      { id: 'seller1', name: 'TechStore Pro', rating: 4.8, reviewCount: 1250 },
      { id: 'seller2', name: 'FashionHub', rating: 4.5, reviewCount: 890 },
      { id: 'seller3', name: 'SuspiciousSeller', rating: 2.1, reviewCount: 12 },
      { id: 'seller4', name: 'NewSeller', rating: 3.2, reviewCount: 25 },
      { id: 'seller5', name: 'TrustedMart', rating: 4.9, reviewCount: 5420 }
    ];

    sellers.forEach(seller => this.sellerReputationCache.set(seller.id, seller));
  }

  /**
   * Initialize mock price history
   */
  private initializePriceHistory(): void {
    const histories: PriceHistory[] = [
      {
        productId: 'product1',
        prices: [
          { price: 1000, timestamp: Date.now() - 86400000 * 7 },
          { price: 1050, timestamp: Date.now() - 86400000 * 5 },
          { price: 980, timestamp: Date.now() - 86400000 * 3 },
          { price: 1020, timestamp: Date.now() - 86400000 }
        ]
      },
      {
        productId: 'product2',
        prices: [
          { price: 500, timestamp: Date.now() - 86400000 * 10 },
          { price: 520, timestamp: Date.now() - 86400000 * 7 },
          { price: 510, timestamp: Date.now() - 86400000 * 3 },
          { price: 1500, timestamp: Date.now() } // Manipulated price
        ]
      }
    ];

    histories.forEach(history => this.priceHistoryCache.set(history.productId, history));
  }

  /**
   * Update seller reputation
   */
  updateSellerReputation(seller: Seller): void {
    this.sellerReputationCache.set(seller.id, seller);
  }

  /**
   * Add phishing pattern
   */
  addPhishingPattern(pattern: string): void {
    this.phishingTrie.insert(pattern.toLowerCase());
  }

  /**
   * Update price history
   */
  updatePriceHistory(productId: string, price: number): void {
    const history = this.priceHistoryCache.get(productId) || { productId, prices: [] };
    history.prices.push({ price, timestamp: Date.now() });
    
    // Keep only last 30 days of history
    const thirtyDaysAgo = Date.now() - 30 * 86400000;
    history.prices = history.prices.filter(p => p.timestamp > thirtyDaysAgo);
    
    this.priceHistoryCache.set(productId, history);
  }

  /**
   * Clear user activity cache (for cleanup)
   */
  clearUserActivityCache(): void {
    this.userActivityCache.clear();
  }
}

export default FraudDetectionEngine;
