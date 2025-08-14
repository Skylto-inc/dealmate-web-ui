import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { FraudDetectionEngine } from '@/lib/fraud-detection/fraud-detection-engine';
import type { FraudCheckResult } from '@/lib/fraud-detection/fraud-detection-engine';
import { getMockDeals } from '@/lib/mock-data/deals';

const defaultToggles = {
  Login: true,
  FraudDetection: true, // New toggle for fraud detection
};

const fraudEngine = new FraudDetectionEngine();

export async function GET() {
  try {
    const togglesPath = path.join(process.cwd(), '..', 'feature-toggles.json');
    
    let toggles = defaultToggles;
    
    try {
      const togglesData = await fs.readFile(togglesPath, 'utf8');
      toggles = { ...defaultToggles, ...JSON.parse(togglesData) };
    } catch (fileError) {
      // File doesn't exist or can't be read, use defaults
    }

    let fraudDetectionData: any = { enabled: false };
    
    if (toggles.FraudDetection) {
      try {
        const mockDeals = getMockDeals();
        const fraudDetectionResults: { [dealId: string]: FraudCheckResult[] } = {};
        
        const fraudResults = await Promise.all(
          mockDeals.map(async (deal) => {
            try {
              const results = await fraudEngine.detectFraud(deal, deal.sellerId);
              return { dealId: deal.id, results };
            } catch (fraudError) {
              return { dealId: deal.id, results: [] };
            }
          })
        );
        
        fraudResults.forEach(({ dealId, results }) => {
          if (results.length > 0) fraudDetectionResults[dealId] = results;
        });
        
        try {
          fraudEngine.detectSuspiciousUserBehavior('user123', 'view_deal');
        } catch (behaviorError) {
          // Continue without user behavior check
        }
        
        fraudDetectionData = {
          enabled: true,
          results: fraudDetectionResults,
          stats: {
            totalDealsChecked: mockDeals.length,
            fraudulentDealsFound: Object.keys(fraudDetectionResults).length,
            topAnomalies: fraudEngine.getTopAnomalies(3)
          }
        };
      } catch (fraudSystemError) {
        fraudDetectionData = { enabled: false };
      }
    }
    
    return NextResponse.json({
      toggles,
      fraudDetection: fraudDetectionData
    });
  } catch (error) {
    return NextResponse.json(
      {
        toggles: defaultToggles,
        fraudDetection: { enabled: false },
        error: 'Failed to process feature toggles'
      },
      { status: 500 }
    );
  }
}
