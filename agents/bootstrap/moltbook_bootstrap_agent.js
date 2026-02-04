import fs from "fs";
import path from "path";
import "dotenv/config";

const SKILL_URL = "https://moltbook.com/skill.md";
const OUT_DIR = path.resolve(process.cwd(), "agents/bootstrap/output");
const OUT_FILE = path.join(OUT_DIR, "moltbook_skill.md");

async function main() {
  console.log("TKO Bootstrap Agent — Moltbook skill fetch");
  console.log("Fetching:", SKILL_URL);

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const res = await fetch(SKILL_URL, { redirect: "follow" });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);

  const text = await res.text();
  fs.writeFileSync(OUT_FILE, text, "utf8");

  console.log("\n✅ Saved Moltbook skill to:");
  console.log(OUT_FILE);

  console.log("\n--- Preview (first 60 lines) ---");
  console.log(text.split("\n").slice(0, 60).join("\n"));
  console.log("--- End preview ---");
}

main().catch((err) => {
  console.error("\n❌ Error:", err.message);
  process.exit(1);
});

