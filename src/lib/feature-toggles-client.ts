'use client';

interface FeatureToggles {
  Login: boolean;
  FraudDetection?: boolean;
}

const defaultToggles: FeatureToggles = {
  Login: true,
  FraudDetection: true,
};

export async function getFeatureToggles(): Promise<FeatureToggles> {
  try {
    const response = await fetch('/api/feature-toggles');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    const toggles = data.toggles || data;
    return { ...defaultToggles, ...toggles };
  } catch (error) {
    // Log error type only, not user data
    console.warn('Failed to fetch feature toggles, using defaults');
    return defaultToggles;
  }
}

export async function isFeatureEnabled(feature: keyof FeatureToggles): Promise<boolean> {
  const toggles = await getFeatureToggles();
  return toggles[feature] ?? false;
}
