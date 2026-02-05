/**
 * Provider-agnostic LLM interface.
 * Phase 3: Cloudflare Worker will hold keys; local dev can use .env.
 */

export async function llmComplete({ prompt }) {
  throw new Error("LLM provider not configured yet. (Phase 3 Cloudflare secrets)");
}
