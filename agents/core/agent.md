# TKO Core Agent (STRICT)

## ID
core.tko

## Purpose
Scaffold, register, validate, and manage TKO agents with strict policy enforcement.

## Commands
- create <agent.id> <agent-name>
- validate <agent.id>
- list

## Strict Rules
- Refuse to create agents with invalid IDs.
- Refuse to overwrite existing agents.
- Refuse to register duplicates.
- Refuse any agent that writes outside agents/<agent>/output.
- Refuse missing required files (agent.md + index.js).
