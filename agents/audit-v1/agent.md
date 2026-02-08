# Agent Spec

## ID
audit.v1

## Purpose
Run a fast AI audit from 5 inputs and return structured recommendations.

## Inputs (required)
1. businessType (string)
2. hasWebsite (boolean)
3. monthlyLeads (number)
4. bookingMethod (string)
5. biggestPain (string)

## Outputs
JSON:
- problems[] (strings)
- quickWins[] (strings)
- recommendedTier (Ignite | Accelerate | Dominate)
- nextAction (string)

## Tools
- llm.provider (OpenAI)

## Permissions
- No filesystem writes
- No external network calls except OpenAI

## Notes
- Deterministic JSON only
- No markdown, no prose outside JSON
