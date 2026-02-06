# Agent Spec

## ID
bootstrap.moltbook

## Purpose
Fetch Moltbook skill documentation and save it locally for reproducible onboarding and integration.

## Inputs
- None (uses fixed URLs)

## Outputs
- agents/bootstrap/output/moltbook_skill.md (runtime output)
- skills/moltbook/* (committed vendor docs, maintained separately)

## Tools
- http.fetch (Node fetch / curl fallback)

## Permissions
- fs.write: agents/bootstrap/output/*
- (Policy) Do not write outside agents/**/output during runtime

## Run
- npm run agent:bootstrap:moltbook
- or: node agents/bootstrap/moltbook_bootstrap_agent.js

## Notes
- Use https://www.moltbook.com (never non-www) to avoid Authorization header stripping.
