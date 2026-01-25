<!--
Sync Impact Report
- Version change: N/A → 1.0.0
- Modified principles:
	- I. Code Quality Discipline (new)
	- II. User Experience Consistency (new)
	- III. Performance Requirements (new)
- Added sections:
	- Standards & Constraints
	- Development Workflow & Quality Gates
- Removed sections:
	- Placeholder Principle IV and V (consolidated into the first three)
- Templates requiring updates:
	- ✅ .specify/templates/plan-template.md (Constitution Check aligns)
	- ✅ .specify/templates/spec-template.md (no changes required)
	- ✅ .specify/templates/tasks-template.md (no changes required)
	- ✅ .specify/templates/checklist-template.md (no changes required)
	- ✅ .specify/templates/agent-file-template.md (no changes required)
	- ⚠️ .specify/templates/commands/* (not present; N/A)
- Follow-up TODOs:
	- TODO(RATIFICATION_DATE): Original adoption date unknown — set when confirmed
-->

# Dog Diaries Constitution

## Core Principles

### I. Code Quality Discipline (NON-NEGOTIABLE)
Dog Diaries MUST uphold strict, testable code quality rules across frontend and
backend.

- Linting and Types: TypeScript types MUST be explicit for public APIs
	(components props, services, routes). Avoid `any` in application code. The
	project MUST compile with zero TypeScript errors.
- Structure & Size: Components SHOULD remain under 300 lines; extract helpers
	when crossing that boundary. Functions SHOULD have cyclomatic complexity < 10;
	refactor when exceeded.
- Error Handling: All backend routes MUST return structured JSON errors with
	appropriate status codes. Frontend MUST surface user-safe messages (no stack
	traces) and log technical details only to the console.
- Contracts: API request/response shapes MUST be defined in the feature spec
	and respected by both frontend and backend.
- CI Gate: Changes MUST pass type checks and linting. When tests exist,
	they MUST pass before merge.

### II. User Experience Consistency
Dog Diaries MUST deliver a consistent, accessible experience aligned with the
existing design system.

- Design System: Prefer shadcn/ui components and Tailwind tokens. Avoid custom
	styles unless necessary; reuse primitives from `/src/app/components/ui`.
- Accessibility: All interactive elements MUST have accessible names/labels,
	focus states, and keyboard operability. Color contrast MUST meet WCAG AA.
- Responsiveness: Follow responsive patterns and `use-mobile.ts` for adaptive
	behavior. Primary flows MUST function on mobile and desktop.
- Consistent Patterns: Spacing, typography, and component variants MUST align
	with `/src/styles/theme.css` and project guidelines.
- Feedback: Actions MUST provide immediate feedback (loading, success, error),
	using `sonner` toasts or component states where appropriate.

### III. Performance Requirements
Dog Diaries MUST meet measurable performance budgets to ensure responsiveness.

- Frontend Interaction: p95 user action-to-feedback < 200ms for local dev on a
	modern laptop; loading indicators MUST appear if longer.
- Initial Render: LCP target < 2.0s on local dev for the main profile view;
	avoid unnecessary synchronous work in `App.tsx`.
- Backend Latency: Internal processing (excluding third-party calls like Azure
	or Dog CEO) p95 < 150ms. Timeouts and retries MUST be defined for external
	services.
- Resource Use: Avoid large, unused dependencies. Prefer lazy-loading for
	heavy UI modules and cache results when safe.
- Measurement: Features SHOULD include simple timing/logging hooks to verify
	budgets during development.

## Standards & Constraints

- Tech Stack: React + TypeScript + Vite (frontend), Tailwind + shadcn/ui UI,
	Express (backend). Path alias `@/` resolves to `/src`.
- Ports: Frontend dev `http://localhost:5173`; backend `http://localhost:3001`;
	`/api` proxy configured.
- Content Policy: Generated content MUST adhere to Microsoft content policies;
	harmful/hateful/violent requests MUST be rejected.
- External APIs: Azure OpenAI and Dog CEO usage MUST include graceful fallbacks
	and error handling (see `server/index.js`).

## Development Workflow & Quality Gates

- Spec-First: New features MUST include a spec under `/specs/[feature]/spec.md`
	and an implementation plan under `/specs/[feature]/plan.md` referencing the
	Constitution Check.
- Review: PRs MUST reference the applicable spec sections and affirm compliance
	with Principles I–III.
- Verification: Run `npm run dev:all` locally to validate full-stack behavior;
	ensure TypeScript compilation succeeds and UI/latency goals are met.
- Accessibility Check: Verify keyboard navigation, labels, and contrast before
	merge.

## Governance

The Constitution supersedes ad hoc practices. Amendments require a PR with:

- Change summary, migration/rollout plan (if applicable), and explicit version
	bump per semantic versioning:
	- MAJOR: Breaking governance changes or principle removals/redefinitions.
	- MINOR: New principle/section added or materially expanded guidance.
	- PATCH: Clarifications/wording fixes with no semantic change.
- Compliance: Reviewers MUST check PRs against the Constitution. Periodic
	(monthly) reviews SHOULD sample features for adherence.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2026-01-24
