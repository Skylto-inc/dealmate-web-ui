// Coupon validation utility
export interface CouponValidationResult {
  isValid: boolean;
  errors: string[];
  suggestions?: string[];
}

export class CouponValidator {
  // Common coupon patterns
  private static patterns = {
    alphanumeric: /^[A-Z0-9]+$/i,
    withDashes: /^[A-Z0-9]+(-[A-Z0-9]+)*$/i,
    amazonStyle: /^[A-Z0-9]{4}-[A-Z0-9]{6}-[A-Z0-9]{4}$/i,
    percentOff: /^[A-Z0-9]+(PERCENT|OFF|\d{2})$/i,
    standardLength: /^.{5,25}$/,
  };

  // Known invalid patterns (test codes, placeholders)
  private static invalidPatterns = [
    /^(TEST|DEMO|SAMPLE|EXAMPLE)/i,
    /^X+$/i,
    /^0+$/,
    /^123+$/,
    /^ABC+$/i,
  ];

  // Validate coupon code
  static validate(code: string, category?: string): CouponValidationResult {
    const errors: string[] = [];
    const suggestions: string[] = [];

    if (!code || code.trim().length === 0) {
      errors.push('Coupon code cannot be empty');
      return { isValid: false, errors };
    }

    const trimmedCode = code.trim();

    // Length validation
    if (trimmedCode.length < 3) {
      errors.push('Coupon code is too short (minimum 3 characters)');
    } else if (trimmedCode.length > 50) {
      errors.push('Coupon code is too long (maximum 50 characters)');
    }

    // Check for invalid patterns
    for (const pattern of this.invalidPatterns) {
      if (pattern.test(trimmedCode)) {
        errors.push('This appears to be a test or placeholder code');
        break;
      }
    }

    // Check for valid format
    let hasValidFormat = false;
    for (const [name, pattern] of Object.entries(this.patterns)) {
      if (pattern.test(trimmedCode)) {
        hasValidFormat = true;
        break;
      }
    }

    if (!hasValidFormat && errors.length === 0) {
      suggestions.push('Consider using standard formats like SAVE20, DEAL-2024, or ABC123-XYZ456');
    }

    // Category-specific validation
    if (category) {
      this.validateByCategory(trimmedCode, category, errors, suggestions);
    }

    // Check for common issues
    if (trimmedCode.includes(' ')) {
      suggestions.push('Spaces in coupon codes might cause issues. Consider using dashes instead.');
    }

    if (trimmedCode.toLowerCase() !== trimmedCode && trimmedCode.toUpperCase() !== trimmedCode) {
      suggestions.push('Mixed case might be confusing. Consider using all uppercase.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    };
  }

  private static validateByCategory(
    code: string,
    category: string,
    errors: string[],
    suggestions: string[]
  ): void {
    switch (category.toLowerCase()) {
      case 'electronics':
        if (!/-/.test(code) && code.length > 10) {
          suggestions.push('Electronics codes often use dashes for readability (e.g., TECH-SAVE-2024)');
        }
        break;

      case 'fashion':
        if (!/\d/.test(code)) {
          suggestions.push('Fashion codes often include numbers for discount amounts (e.g., STYLE20)');
        }
        break;

      case 'food':
        if (code.length > 15) {
          suggestions.push('Food delivery codes are typically shorter for easy entry');
        }
        break;

      case 'travel':
        if (!/[A-Z]/.test(code)) {
          suggestions.push('Travel codes usually use uppercase letters (e.g., FLYAWAY50)');
        }
        break;
    }
  }

  // Format coupon code consistently
  static format(code: string): string {
    return code.trim().toUpperCase().replace(/\s+/g, '-');
  }

  // Generate a masked version for preview
  static mask(code: string, showChars: number = 2): string {
    if (code.length <= showChars * 2) {
      return code;
    }
    
    const start = code.substring(0, showChars);
    const end = code.substring(code.length - showChars);
    const middle = '*'.repeat(Math.min(code.length - showChars * 2, 6));
    
    return `${start}${middle}${end}`;
  }
}
