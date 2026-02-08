/**
 * TKO Agent Template
 * Rules:
 * - Write outputs only to this agent's /output folder
 * - Never print secrets
 * - Return structured output when possible
 */

import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve(process.cwd(), "agents/website-builder/output");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function main() {
  console.log("Agent running: website.builder");
  // TODO: implement
}

main().catch((err) => {
  console.error("Agent error:", err.message);
  process.exit(1);
});
