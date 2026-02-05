# TKO Agent Policy (v1)

## Non-negotiables
- Do not log secrets (API keys, tokens, auth headers).
- Do not write outside the agent's own `agents/<agent>/output/` folder.
- Always fail loudly with a clear error message if required inputs are missing.
- Prefer deterministic outputs: JSON + Markdown.

## Output standard
When returning data to console, use:
- a short status line
- a JSON block (if applicable)
- file paths written

## Security
- All provider keys must live in runtime secrets (Cloudflare later) or local `.env` for dev.
- Never embed API keys in frontend code.
