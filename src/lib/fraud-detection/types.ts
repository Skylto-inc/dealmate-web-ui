/**
 * Type definitions for the Fraud Detection System
 */

export interface FraudDetectionConfig {
  // Thresholds
  categoryThresholds: {
    [category: string]: number;
  };
  sellerRatingThreshold: number;
  sellerReviewCountThreshold: number;
  priceDeviationThreshold: number;
  
  // Behavior detection
  rapidActionThreshold: number; // actions per second
  highActivityThreshold: number; // actions per minute
  
  // Cache settings
  userActivityCacheDuration: number; // milliseconds
  priceHistoryRetentionDays: number;
}

export interface FraudDetectionStats {
  totalChecks: number;
  fraudulentDealsDetected: number;
  counterfeitProductsDetected: number;
  phishingLinksDetected: number;
  priceManipulationsDetected: number;
  suspiciousUsersDetected: number;
  averageConfidence: number;
}

export interface FraudAlert {
  id: string;
  timestamp: number;
  type: 'fake_deal' | 'counterfeit_product' | 'phishing_link' | 'price_manipulation' | 'suspicious_behavior' | 'bot_behavior';
  severity: 'low' | 'medium' | 'high' | 'critical';
  entityId: string; // dealId, productId, userId, etc.
  entityType: 'deal' | 'product' | 'user' | 'seller' | 'url';
  confidence: number;
  description: string;
  actionTaken?: string;
  resolved?: boolean;
}

export interface FraudPattern {
  id: string;
  pattern: string;
  type: 'url' | 'text' | 'behavior';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  addedAt: number;
  addedBy: string;
  active: boolean;
}

export interface SellerTrustScore {
  sellerId: string;
  trustScore: number; // 0-100
  factors: {
    rating: number;
    reviewCount: number;
    accountAge: number;
    disputeRate: number;
    returnRate: number;
  };
  lastUpdated: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface PriceAnalysis {
  productId: string;
  currentPrice: number;
  historicalMedian: number;
  deviation: number;
  isManipulated: boolean;
  confidence: number;
  priceHistory: Array<{
    price: number;
    timestamp: number;
    source?: string;
  }>;
}

export interface UserBehaviorProfile {
  userId: string;
  actionsPerMinute: number;
  lastActionTimestamp: number;
  suspiciousPatterns: string[];
  riskScore: number; // 0-100
  isBot: boolean;
  isFlagged: boolean;
}

export interface FraudDetectionReport {
  generatedAt: number;
  period: {
    start: number;
    end: number;
  };
  stats: FraudDetectionStats;
  topThreats: Array<{
    type: string;
    count: number;
    severity: string;
  }>;
  flaggedEntities: {
    deals: string[];
    sellers: string[];
    users: string[];
    urls: string[];
  };
  recommendations: string[];
}

// API Response types
export interface FraudCheckResponse {
  dealId: string;
  timestamp: number;
  results: Array<{
    isFraudulent: boolean;
    fraudType?: string;
    confidence: number;
    reason?: string;
  }>;
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  blocked: boolean;
  warnings: string[];
}

export interface BatchFraudCheckRequest {
  deals: Array<{
    id: string;
    title: string;
    originalPrice: number;
    discountedPrice: number;
    category: string;
    sellerId: string;
    url: string;
  }>;
  userId?: string;
  checkTypes?: Array<'fake_deal' | 'counterfeit' | 'phishing' | 'price_manipulation' | 'user_behavior'>;
}

export interface BatchFraudCheckResponse {
  results: FraudCheckResponse[];
  summary: {
    totalChecked: number;
    fraudulentCount: number;
    blockedCount: number;
    processingTime: number;
  };
}
