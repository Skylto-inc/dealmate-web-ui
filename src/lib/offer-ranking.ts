
import type { Offer, UserCard, RankedOffer, UserPointsState } from './types';

const MIN_SPEND_FOR_PERK_CONSIDERATION = 100; // Don't consider tiny purchases for big perks

export function calculateRankedOffers(offers: Offer[], userPointsState: UserPointsState): RankedOffer[] {
  const rankedOffers: RankedOffer[] = offers.map((offer, _index) => {
    let priceAfterDirectDiscounts = offer.basePrice;
    let totalDiscountValue = 0; // Coupons, direct offer discounts
    let totalCashbackValue = 0; // Cashback expected post-purchase
    let cardBonusValue = 0; // Additional value from using a specific card for *this* transaction
    let potentialPerkValue = 0; // Value of a *future* perk unlocked or significantly contributed to
    let goalContributionScore = 0;
    const rankingExplanation: string[] = [];
    const tags: RankedOffer['tags'] = [];

    // 1. Apply direct discounts (coupons)
    if (offer.couponValue && offer.couponValue > 0) {
      const discountFromCoupon = Math.min(priceAfterDirectDiscounts, offer.couponValue);
      priceAfterDirectDiscounts -= discountFromCoupon;
      totalDiscountValue += discountFromCoupon;
      rankingExplanation.push(`₹${discountFromCoupon.toFixed(2)} off with coupon.`);
    }

    // Price at this point is what user would typically pay before bank offers/cashback are applied
    const priceBeforeCardAndCashback = priceAfterDirectDiscounts;

    // 2. Calculate general cashback (not card-specific yet)
    if (offer.cashbackFlat && offer.cashbackFlat > 0) {
      totalCashbackValue += offer.cashbackFlat;
      rankingExplanation.push(`₹${offer.cashbackFlat.toFixed(2)} flat cashback.`);
      tags.push('Extra Cashback');
    }
    if (offer.cashbackPercentage && offer.cashbackPercentage > 0) {
      const cashbackFromPercentage = (priceBeforeCardAndCashback * offer.cashbackPercentage) / 100;
      totalCashbackValue += cashbackFromPercentage;
      rankingExplanation.push(`₹${cashbackFromPercentage.toFixed(2)} (${offer.cashbackPercentage}%) cashback.`);
      tags.push('Extra Cashback');
    }
    
    let achievedPerkDescription: string | undefined = undefined;

    // 3. Card-specific bonuses and perk unlocking logic
    let bestCardForOffer: UserCard | null = null;
    let maxCardRelatedSavingPlusPerk = 0; // Tracks combined direct saving from card + future perk value

    for (const card of userPointsState.cards) {
      let currentCardImmediateBonus = 0;
      let currentCardFuturePerkValue = 0;
      const tempCardExplanations: string[] = [];
      let perkUnlockedByThisCard = false;

      // Check if offer is eligible for this card
      if (!offer.requiredCardType || `${card.bank} ${card.cardType}`.toLowerCase().includes(offer.requiredCardType.toLowerCase())) {
        if (offer.cardSpecificBonusFlat && offer.cardSpecificBonusFlat > 0) {
          currentCardImmediateBonus += offer.cardSpecificBonusFlat;
          tempCardExplanations.push(`₹${offer.cardSpecificBonusFlat.toFixed(2)} instant bonus with ${card.bank} ${card.cardType}.`);
        }
        if (offer.cardSpecificBonusPercentage && offer.cardSpecificBonusPercentage > 0) {
          const bonus = (priceBeforeCardAndCashback * offer.cardSpecificBonusPercentage) / 100;
          currentCardImmediateBonus += bonus;
          tempCardExplanations.push(`₹${bonus.toFixed(2)} (${offer.cardSpecificBonusPercentage}%) instant bonus with ${card.bank} ${card.cardType}.`);
        }
      }
      
      // Card's own reward system (points conversion or direct value like 5% on all spends)
      if (card.rewards_per_rupee && card.reward_value_inr) { // Points system
        const pointsFromThisPurchase = Math.floor(priceBeforeCardAndCashback * card.rewards_per_rupee);
        const valueFromPoints = pointsFromThisPurchase * card.reward_value_inr;
        currentCardImmediateBonus += valueFromPoints; // Considered as part of immediate value from card
        tempCardExplanations.push(`Earn ~₹${valueFromPoints.toFixed(2)} (${pointsFromThisPurchase} pts) via ${card.bank} ${card.cardType} rewards.`);
      } else if (card.rewards_per_rupee && !card.reward_value_inr) { // Direct % value card like "5% on all spends"
         const valueFromCardPercentage = priceBeforeCardAndCashback * card.rewards_per_rupee;
         currentCardImmediateBonus += valueFromCardPercentage;
         tempCardExplanations.push(`Get ~₹${valueFromCardPercentage.toFixed(2)} (${(card.rewards_per_rupee * 100).toFixed(1)}%) value via ${card.bank} ${card.cardType}.`);
      }


      // Perk unlocking logic for this card
      if (card.current_points !== undefined && card.next_reward_threshold && card.next_reward_value && card.rewards_per_rupee && card.reward_value_inr) {
        const pointsEarnedThisPurchase = Math.floor(priceBeforeCardAndCashback * card.rewards_per_rupee);
        const totalPointsAfterPurchase = card.current_points + pointsEarnedThisPurchase;
        
        if (card.current_points < card.next_reward_threshold && totalPointsAfterPurchase >= card.next_reward_threshold) {
          if (priceBeforeCardAndCashback >= MIN_SPEND_FOR_PERK_CONSIDERATION) {
            currentCardFuturePerkValue = card.next_reward_value;
            tempCardExplanations.push(`Unlocks ₹${card.next_reward_value.toFixed(2)} perk on ${card.bank} ${card.cardType}!`);
            perkUnlockedByThisCard = true;
            tags.push('Reward Unlock');
          }
        }
      }
      
      // Compare this card's total contribution (immediate bonus + future perk)
      if (currentCardImmediateBonus + currentCardFuturePerkValue > maxCardRelatedSavingPlusPerk) {
        maxCardRelatedSavingPlusPerk = currentCardImmediateBonus + currentCardFuturePerkValue;
        bestCardForOffer = card;
        cardBonusValue = currentCardImmediateBonus; // This is the direct bonus/value for *this* transaction from this card
        potentialPerkValue = currentCardFuturePerkValue; // This is the future value unlocked by this card

        // Update explanations, removing previous card-specific ones
        rankingExplanation.splice(rankingExplanation.findIndex(e => e.includes("bonus with") || e.includes("Unlocks ₹") || e.includes("via rewards")), rankingExplanation.length);
        rankingExplanation.push(...tempCardExplanations);
        if (perkUnlockedByThisCard && card.next_reward_value) {
            achievedPerkDescription = `Unlocks ₹${card.next_reward_value.toFixed(2)} perk on ${card.bank} ${card.cardType}!`;
        } else {
            achievedPerkDescription = undefined;
        }
      }
    }

    // 4. Goal Contribution
    if (userPointsState.rewardGoals && userPointsState.rewardGoals.length > 0) {
        for (const goal of userPointsState.rewardGoals) {
            if (goal.isActive) {
                if (goal.targetType === 'monetary_savings_monthly') {
                    // Any saving contributes. Give a small bonus for highly saved items.
                    const savingForThisOffer = offer.basePrice - (priceBeforeCardAndCashback - totalCashbackValue - cardBonusValue);
                    if (savingForThisOffer > offer.basePrice * 0.1) { // e.g. >10% saving
                       goalContributionScore += 10; // Arbitrary score
                       rankingExplanation.push(`Aligns with goal: "${goal.description}".`);
                       if(!tags.includes('Goal Aligned')) tags.push('Goal Aligned');
                    }
                } else if (goal.targetType === 'points_milestone_card' && goal.cardIdRef === bestCardForOffer?.id && potentialPerkValue > 0) {
                    // If this offer unlocks a perk on a card tied to a goal
                    goalContributionScore += 50; // Higher score for direct perk unlock related to goal
                    rankingExplanation.push(`Major progress on goal: "${goal.description}" by unlocking card perk!`);
                    if(!tags.includes('Goal Aligned')) tags.push('Goal Aligned');
                }
                // Add more specific goal logic for loyalty programs if needed
            }
        }
    }
    
    // Effective Price: What the user effectively pays out of pocket or from their bank account
    // This is base price - direct discounts - cashback - card bonuses. Future perks are not subtracted from effective price but add to score.
    const effectivePrice = priceBeforeCardAndCashback - totalCashbackValue - cardBonusValue;

    // Composite Score:
    // Start with total monetary value (savings + future perks)
    // Add goal contribution.
    // Higher is better.
    const totalMonetaryValue = (offer.basePrice - effectivePrice) + potentialPerkValue;
    const compositeScore = totalMonetaryValue + goalContributionScore;


    if (rankingExplanation.length === 0) {
      rankingExplanation.push("Standard price. No specific discounts, cashback, or perks identified with your current setup for this item.");
    }
    if(totalDiscountValue > 0 && totalCashbackValue > 0 && cardBonusValue > 0 && !tags.includes('Best Combo')) {
        tags.push('Best Combo');
    }


    return {
      ...offer,
      rank: 0, // Placeholder, will be updated after sorting
      finalPrice: priceBeforeCardAndCashback, // Price after direct coupon, before cashback/card bonuses considered for effective price calculation
      effectivePrice,
      totalDiscountValue,
      totalCashbackValue,
      cardBonusValue,
      potentialPerkValue,
      goalContributionScore,
      compositeScore,
      rankingExplanation,
      achievedPerkDescription,
      tags: tags.length > 0 ? tags : undefined,
    };
  });

  // Sort by composite score (higher is better)
  const sortedOffers = rankedOffers.sort((a, b) => b.compositeScore - a.compositeScore);

  // Add rank
  return sortedOffers.map((offer, index) => ({
    ...offer,
    rank: index + 1,
  }));
}
