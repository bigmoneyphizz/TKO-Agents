import fs from "fs";
import path from "path";

function fail(msg) {
  throw new Error(`[STRICT VALIDATION FAILED] ${msg}`);
}

export function validateAgentByRecord(agentRecord) {
  const folderAbs = path.resolve(process.cwd(), agentRecord.folder);
  const entryAbs = path.resolve(process.cwd(), agentRecord.folder, agentRecord.entry);

  // Required files
  const agentMd = path.join(folderAbs, "agent.md");
  if (!fs.existsSync(agentMd)) fail(`Missing required file: ${agentRecord.folder}/agent.md`);

  if (!fs.existsSync(entryAbs)) fail(`Entry not found: ${agentRecord.folder}/${agentRecord.entry}`);

  // Ensure output folder convention exists or can exist
  const outputDir = path.join(folderAbs, "output");
  // It's okay if it doesn't exist yet; but writing must be constrained to it by policy.

  // STRICT: enforce "output-only" writes by static scan heuristics (best-effort)
  const entryText = fs.readFileSync(entryAbs, "utf8");

  // If code contains suspicious absolute paths or parent traversal, fail.
  const suspicious = ["../", "/etc/", "/Users/", "C:\\\\", "child_process", "execSync("];
  for (const token of suspicious) {
    if (entryText.includes(token)) {
      fail(`Suspicious token "${token}" found in ${agentRecord.entry}. Review required.`);
    }
  }

  // Encourage output-only path usage (heuristic)
  if (!entryText.includes("/output") && !entryText.includes("output")) {
    fail(`Agent entry does not reference an output folder. Enforce agents/<agent>/output/ writes.`);
  }

  // Registry sanity
  if (!agentRecord.id || !agentRecord.folder || !agentRecord.entry) {
    fail(`Registry record missing required fields (id/folder/entry).`);
  }

  return {
    ok: true,
    agent: agentRecord.id,
    checks: [
      "agent.md present",
      "entry present",
      "no obvious traversal/exec patterns",
      "output convention referenced"
    ],
    outputDir: path.relative(process.cwd(), outputDir)
  };
}

export function validateAgentById(agentId) {
  const registryPath = path.resolve(process.cwd(), "agents/registry/agents.json");
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  const record = registry.agents.find((a) => a.id === agentId);
  if (!record) fail(`Agent not found in registry: ${agentId}`);
  return validateAgentByRecord(record);
}
