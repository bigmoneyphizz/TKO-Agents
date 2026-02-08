export function buildAuditPrompt(input) {
  const {
    businessType,
    hasWebsite,
    monthlyLeads,
    bookingMethod,
    biggestPain
  } = input || {};

  return `
You are an AI business auditor.
Return ONLY valid JSON. No markdown. No commentary.

INPUT:
- businessType: ${businessType}
- hasWebsite: ${hasWebsite}
- monthlyLeads: ${monthlyLeads}
- bookingMethod: ${bookingMethod}
- biggestPain: ${biggestPain}

TASK:
1. Identify 3–5 concrete problems.
2. Identify 3–5 fast quick wins.
3. Recommend exactly ONE tier: Ignite, Accelerate, or Dominate.
4. Provide ONE nextAction string.

RULES:
- Output MUST be valid JSON.
- Use plain strings.
- Be concise and practical.

OUTPUT SHAPE:
{
  "problems": [],
  "quickWins": [],
  "recommendedTier": "",
  "nextAction": ""
}
`;
}
