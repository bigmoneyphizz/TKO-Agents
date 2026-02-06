import fs from "fs";
import path from "path";

export function listAgents() {
  const registryPath = path.resolve(process.cwd(), "agents/registry/agents.json");
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  return registry.agents.map((a) => ({
    id: a.id,
    name: a.name,
    folder: a.folder,
    entry: a.entry,
    status: a.status ?? "unknown"
  }));
}
