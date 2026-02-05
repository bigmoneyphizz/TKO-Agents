import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const registryPath = path.resolve(process.cwd(), "agents/registry/agents.json");
if (!fs.existsSync(registryPath)) {
  console.error("Registry not found:", registryPath);
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const agentId = process.argv[2];

if (!agentId) {
  console.error("Usage: node scripts/run-agent.js <agent.id>");
  console.error("Example: node scripts/run-agent.js bootstrap.moltbook");
  process.exit(1);
}

const agent = registry.agents.find((a) => a.id === agentId);
if (!agent) {
  console.error("Agent not found:", agentId);
  console.error("Known agents:", registry.agents.map((a) => a.id).join(", "));
  process.exit(1);
}

const entryPath = path.resolve(process.cwd(), agent.folder, agent.entry);
if (!fs.existsSync(entryPath)) {
  console.error("Agent entry not found:", entryPath);
  process.exit(1);
}

console.log(`Running agent: ${agent.id}`);
const child = spawn("node", [entryPath], { stdio: "inherit" });

child.on("exit", (code) => process.exit(code ?? 1));
