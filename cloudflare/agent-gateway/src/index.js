export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/health") {
      return new Response(
        JSON.stringify({ ok: true, service: "tko-agent-gateway" }),
        { headers: { "content-type": "application/json" } }
      );
    }

    // Authorization
    const auth = request.headers.get("Authorization") || "";
    const expected = `Bearer ${env.TKO_GATEWAY_TOKEN || ""}`;

    if (!env.TKO_GATEWAY_TOKEN || auth !== expected) {
      return new Response(
        JSON.stringify({ ok: false, error: "unauthorized" }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    // Only POST allowed
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ ok: false, error: "method_not_allowed" }),
        { status: 405, headers: { "content-type": "application/json" } }
      );
    }

    // Run agent
    if (url.pathname === "/run") {
      const body = await request.json().catch(() => ({}));
      const { agentId, input } = body;

      if (agentId !== "audit.v1") {
        return new Response(
          JSON.stringify({ ok: false, error: "agent_not_allowed" }),
          { status: 403, headers: { "content-type": "application/json" } }
        );
      }

      const {
        businessType,
        hasWebsite,
        monthlyLeads,
        bookingMethod,
        biggestPain
      } = input || {};

      const prompt = `
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

OUTPUT SHAPE:
{
  "problems": [],
  "quickWins": [],
  "recommendedTier": "",
  "nextAction": ""
}
`;

      let aiResult;
      try {
aiResult = await env.AI.run("@cf/meta/llama-2-7b", {
  prompt,
  max_tokens: 512
});

      } catch (e) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: "workers_ai_call_failed",
            details: String(e && (e.stack || e.message || e))
          }),
          { status: 500, headers: { "content-type": "application/json" } }
        );
      }

      const content =
        aiResult?.response || aiResult?.output_text || aiResult?.result;

      if (!content) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: "workers_ai_empty_response",
            raw: aiResult
          }),
          { status: 500, headers: { "content-type": "application/json" } }
        );
      }

      return new Response(String(content).trim(), {
        headers: { "content-type": "application/json" }
      });
    }

    return new Response(
      JSON.stringify({ ok: false, error: "not_found" }),
      { status: 404, headers: { "content-type": "application/json" } }
    );
  }
};
