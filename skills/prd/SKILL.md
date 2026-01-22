---
name: prd
description: 'Generate high-quality Product Requirements Documents (PRDs) for AI agents and software systems. Includes executive summaries, user stories, technical specifications, AI-specific requirements (models, data, prompts), and risk analysis.'
license: MIT
---

# Product Requirements Document (PRD)

## Overview

Design comprehensive, production-grade Product Requirements Documents (PRDs) that bridge the gap between business vision and technical execution. This skill is optimized for AI agent development and modern software systems, ensuring that both deterministic and non-deterministic requirements are clearly defined.

## When to Use

Use this skill when:

- Starting a new product or feature development cycle
- Translating a vague idea into a concrete technical specification
- Defining requirements for an AI agent (LLM, ML, etc.)
- Stakeholders need a unified "source of truth" for project scope
- User asks to "write a PRD", "document requirements", or "plan a feature"

---

## Operational Workflow

### Phase 1: Discovery (The Interview)

Before writing a single line of the PRD, you **MUST** interrogate the user to fill knowledge gaps. Do not assume context.

**Ask about:**

- **The Core Problem**: Why are we building this now?
- **Success Metrics**: How do we know it worked?
- **Constraints**: Budget, tech stack, or deadline?
- **Agent Roles**: If this is for an AI system, what are the subagent responsibilities?

### Phase 2: Analysis & Scoping

Synthesize the user's input. Identify dependencies and hidden complexities.

- Map out the **User Flow**.
- Define **Non-Goals** to protect the timeline.
- Identify **Orchestration Needs** (which tools or agents are required?).

### Phase 3: Technical Drafting

Generate the document using the **Strict PRD Schema** below.

---

## PRD Quality Standards

### Requirements Quality

Use concrete, measurable criteria. Avoid "fast", "easy", or "intuitive".

```diff
# Vague (BAD)
- The search should be fast and return relevant results.
- The UI must look modern and be easy to use.

# Concrete (GOOD)
+ The search must return results within 200ms for a 10k record dataset.
+ The search algorithm must achieve >= 85% Precision@10 in benchmark evals.
+ The UI must follow the 'Vercel/Next.js' design system and achieve 100% Lighthouse Accessibility score.
```

---

## Strict PRD Schema

You **MUST** follow this exact structure for the output:

### 1. Executive Summary

- **Problem Statement**: 1-2 sentences on the pain point.
- **Proposed Solution**: 1-2 sentences on the fix.
- **Success Criteria**: 3-5 measurable KPIs.

### 2. User Experience & Functionality

- **User Personas**: Who is this for?
- **User Stories**: `As a [user], I want to [action] so that [benefit].`
- **Acceptance Criteria**: Bulleted list of "Done" definitions for each story.
- **Non-Goals**: What are we NOT building?

### 3. AI & Agent Orchestration (If Applicable)

- **Model Selection**: e.g., `Claude 3.5 Sonnet` for reasoning, `Haiku` for speed.
- **Agent Definitions**: Specific roles for subagents (e.g., `librarian` for research).
- **Tool Whitelist**: Explicit list of tools each agent is allowed to use.
- **Evaluation Strategy**: How to measure AI output quality (Evals, Golden Sets).

### 4. Technical Specifications

- **Architecture Overview**: Data flow and component interaction.
- **Integration Points**: APIs, DBs, and Auth.
- **Security & Privacy**: Data handling and compliance.

### 5. Risks & Roadmap

- **Phased Rollout**: MVP -> v1.1 -> v2.0.
- **Technical Risks**: Latency, cost, or dependency failures.

---

## Implementation Guidelines

### DO (Always)

- **Delegate Visuals**: If the PRD involves UI/UX, explicitly instruct the use of the `frontend-ui-ux-engineer` agent.
- **Define Evals**: For AI systems, specify the **Evaluation Protocol** (how to detect hallucinations or failures).
- **Iterate**: Present a draft and ask for feedback on specific sections.

### DON'T (Avoid)

- **Skip Discovery**: Never write a PRD without asking at least 2 clarifying questions first.
- **Hallucinate Constraints**: If the user didn't specify a tech stack, ask or label it as `TBD`.

---

## Example: AI-Powered Search Agent

### 1. Executive Summary

**Problem**: Users struggle to find specific documentation snippets in massive repositories.
**Solution**: A RAG-based search agent that provides direct answers with source citations.
**Success**:

- Reduce search time by 50%.
- Citation accuracy >= 95%.

### 2. User Stories

- **Story**: As a developer, I want to ask natural language questions so I don't have to guess keywords.
- **AC**:
  - Supports multi-turn clarification.
  - Returns code blocks with "Copy" button.

### 3. Agent Orchestration

- **Primary Agent**: `Oracle` for reasoning and answer synthesis.
- **Subagent**: `Librarian` for searching docs and indexing code.
- **Tool Whitelist**: `codesearch`, `grep`, `webfetch`.

### 4. Evaluation

- **Benchmark**: Use a 'Golden Set' of 50 common dev questions.
- **Pass Rate**: 90% must match ground truth citations.
