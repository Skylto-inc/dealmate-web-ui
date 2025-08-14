import fs from 'fs';
import path from 'path';

interface FeatureToggles {
  Login: boolean;
}

const defaultToggles: FeatureToggles = {
  Login: true,
};

export function getFeatureToggles(): FeatureToggles {
  try {
    const togglesPath = path.join(process.cwd(), '..', 'feature-toggles.json');
    const togglesData = fs.readFileSync(togglesPath, 'utf8');
    return { ...defaultToggles, ...JSON.parse(togglesData) };
  } catch (error) {
    return defaultToggles;
  }
}

export function isFeatureEnabled(feature: keyof FeatureToggles): boolean {
  const toggles = getFeatureToggles();
  return toggles[feature];
}