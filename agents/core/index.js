import { createAgent } from "./actions/create-agent.js";
import { validateAgentById } from "./actions/validate-agent.js";
import { listAgents } from "./actions/list-agents.js";

function usage() {
  console.log("TKO Core Agent (STRICT)");
  console.log("Usage:");
  console.log("  node agents/core/index.js list");
  console.log('  node agents/core/index.js create <agent.id> "<Agent Name>"');
  console.log("  node agents/core/index.js validate <agent.id>");
}

async function main() {
  const cmd = process.argv[2];
  if (!cmd) return usage();

  if (cmd === "list") {
    const agents = listAgents();
    console.log(JSON.stringify({ ok: true, agents }, null, 2));
    return;
  }

  if (cmd === "create") {
    const agentId = process.argv[3];
    const agentName = process.argv.slice(4).join(" ").replaceAll('"', "").trim();
    if (!agentId || !agentName) return usage();
    const result = createAgent({ agentId, agentName });
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (cmd === "validate") {
    const agentId = process.argv[3];
    if (!agentId) return usage();
    const result = validateAgentById(agentId);
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  usage();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
