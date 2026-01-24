# Implementation Plan: Saved Dogs

**Branch**: `001-saved-dogs` | **Date**: 2026-01-24 | **Spec**: [/specs/001-saved-dogs/spec.md](/specs/001-saved-dogs/spec.md)
**Input**: Feature specification from `/specs/001-saved-dogs/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add Save/Unsave behavior to DogProfile, a Saved Profiles page rendering a responsive grid (infinite scroll), and a main page "Saved Tails" navigation button. Persist saved profiles in durable storage (Azure Cosmos DB) with public visibility. Frontend uses Vite + React + Tailwind + shadcn/ui; backend uses Express. Prioritize design layout changes first, then database saving, then unit tests.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (React 18.3.1, Vite 6.3.5), Node.js (ESM), Express 4.18  
**Primary Dependencies**: React, Tailwind CSS, shadcn/ui, Express, `@azure/cosmos` (to be added)  
**Storage**: Azure Cosmos DB (SQL API) with container `profiles` and partition key `/id`  
**Testing**: NEEDS CLARIFICATION (propose Vitest for frontend, Jest for backend; unit tests added post layout + DB)  
**Target Platform**: Web app (frontend SPA + Express backend)
**Project Type**: web  
**Performance Goals**: Frontend p95 action feedback < 200ms; LCP < 2.0s (local dev, 50 items); Backend internal p95 < 150ms  
**Constraints**: Show loading states if longer; accessible components, WCAG AA; consistent design tokens  
**Scale/Scope**: Public saved profiles; infinite scroll listing; Save/Unsave toggle; no authentication

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- I. Code Quality Discipline: PASS — types for API contracts, structured errors, lint/type gates planned.
- II. User Experience Consistency: PASS — shadcn/ui + Tailwind tokens, accessible labels, responsive grid, toasts.
- III. Performance Requirements: PASS — budgets defined; infinite scroll with incremental loads; backend timeouts.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
server/
└── index.js                  # Add saved-profiles API routes (save, list, delete)

src/
├── app/
│   ├── App.tsx               # Add "Saved Tails" header button and routing
│   ├── components/
│   │   ├── DogProfile.tsx    # Add Save/Unsave button and handlers
│   │   └── SavedProfiles.tsx # New page: responsive grid, infinite scroll
│   └── services/
│       └── api.ts            # API helpers for saved profiles
└── styles/                   # Use existing tokens and theme

tests/
└── unit/                     # Add unit tests after layout and DB work
```

**Structure Decision**: Web app (frontend + backend) within existing repo. Minimal additions to `server/index.js` and `src/app` components aligned to existing patterns.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

No violations expected.
