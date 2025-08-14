
'use server';

/**
 * @fileOverview An AI agent to explain deal rankings.
 *
 * - explainDealRank - A function that provides an explanation for a deal's ranking.
 * - ExplainDealRankInput - The input type for the explainDealRank function.
 * - ExplainDealRankOutput - The return type for the explainDealRank function.
 */

import { ai } from '@/ai/genkit';
import {
    ExplainDealRankInputSchema,
    ExplainDealRankOutputSchema,
    type ExplainDealRankInput,
    type ExplainDealRankOutput,
} from './explain-deal-rank-flow.schemas';

export { type ExplainDealRankInput, type ExplainDealRankOutput };

export async function explainDealRank(input: ExplainDealRankInput): Promise<ExplainDealRankOutput> {
  return explainDealRankFlow(input);
}

const promptTemplate = `You are DealMate's AI Deal Explainer. A user wants a clear, concise, and friendly explanation for why a specific deal for "{{offer.productName}}" is ranked highly.
The deal's attractiveness is based on its "Composite Score" ({{offer.compositeScore}}), which considers direct savings, cashback, card bonuses, any future perks unlocked, and alignment with user's financial goals.
The user is NOT asking for general deal advice, but specifically about THIS deal.

Key Financial Details for this Offer:
- Product: {{offer.productName}} on {{offer.platform}}
- Base Price: ₹{{offer.basePrice}}
- Price After Coupon(s): ₹{{offer.finalPrice}}
- Total Cashback Expected: ₹{{offer.totalCashbackValue}}
- Card Specific Bonus/Value for this transaction: ₹{{offer.cardBonusValue}}
- Effective Price (what user pays after immediate discounts & cashback): ₹{{offer.effectivePrice}}
- Future Perk Unlocked Value (included in score, not in effective price): ₹{{offer.potentialPerkValue}}

Based on ALL the information above, provide a 2-3 paragraph, easy-to-understand summary.
Focus on:
1. The most impactful savings (e.g., significant discount, high cashback, good card bonus).
2. How any future perk is unlocked and its value.
3. If and how this deal aligns with the user's active reward goals.
4. Why the overall "Composite Score" ({{offer.compositeScore}}) is good.

Be positive and reinforce the value DealMate provides.`;

const prompt = ai.definePrompt({
  name: 'explainDealRankPrompt',
  input: { schema: ExplainDealRankInputSchema },
  output: { schema: ExplainDealRankOutputSchema },
  prompt: promptTemplate,
});

const explainDealRankFlow = ai.defineFlow(
  {
    name: 'explainDealRankFlow',
    inputSchema: ExplainDealRankInputSchema,
    outputSchema: ExplainDealRankOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error("AI failed to generate an explanation.");
    }
    return output;
  }
);
