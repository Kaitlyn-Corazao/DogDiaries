# Tasks: Saved Dogs

**Input**: Design documents from `/specs/001-saved-dogs/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Unit tests are requested and included per user priority (after layout and DB wiring).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- [P]: Can run in parallel (different files, no dependencies)
- [Story]: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize dependencies, environment, and basic scaffolding

 - [x] T001 Install `@azure/cosmos` dependency in package.json
 - [x] T002 [P] Create .env with Cosmos config at repo root (COSMOS_ENDPOINT, COSMOS_KEY, COSMOS_DB_NAME, COSMOS_CONTAINER)
- [ ] T003 [P] Create API helpers file with stubs in src/app/services/api.ts
- [ ] T004 [P] Create Saved Profiles page component file in src/app/components/SavedProfiles.tsx
- [ ] T005 Add Saved Profiles route scaffold in src/app/App.tsx
 - [x] T003 [P] Create API helpers file with stubs in src/app/services/api.ts
 - [x] T004 [P] Create Saved Profiles page component file in src/app/components/SavedProfiles.tsx
 - [x] T005 Add Saved Profiles route scaffold in src/app/App.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure prior to user story work

 - [x] T006 Setup saved profiles API routes scaffold (GET list, POST save, DELETE unsave, GET exists) in server/index.js
- [ ] T007 [P] Add JSDoc typedefs and response shape for `SavedProfile` in server/index.js
 - [x] T007 [P] Add JSDoc typedefs and response shape for `SavedProfile` in server/index.js
 - [x] T008 Implement consistent error handling (status codes + JSON body) in server/index.js
- [ ] T009 [P] Wire basic navigation to Saved Profiles page in src/app/App.tsx
 - [x] T009 [P] Wire basic navigation to Saved Profiles page in src/app/App.tsx
- [ ] T010 Add `ImageWithFallback` usage pattern available in src/app/components/figma/ImageWithFallback.tsx for grid images in src/app/components/SavedProfiles.tsx
 - [x] T010 Add `ImageWithFallback` usage pattern available in src/app/components/figma/ImageWithFallback.tsx for grid images in src/app/components/SavedProfiles.tsx

**Checkpoint**: Foundation ready — user story implementation can begin in parallel

---

## Phase 3: User Story 1 — Save/Unsave from DogProfile (Priority: P1) 🎯 MVP

**Goal**: Save current dog profile; toggle to Unsave when already saved

**Independent Test**: From DogProfile, save and unsave a profile; verify success/error feedback and storage effects

### Implementation for User Story 1

 - [x] T011 [P] [US1] Add Save/Unsave button UI to src/app/components/DogProfile.tsx
 - [x] T011 [P] [US1] Add Save/Unsave button UI to src/app/components/DogProfile.tsx
- [ ] T012 [P] [US1] Implement existence check (GET /api/saved-profiles/exists) to determine button label in src/app/services/api.ts
- [ ] T013 [US1] Implement save action (POST /api/saved-profiles) with validation and success toast in src/app/components/DogProfile.tsx
- [ ] T014 [US1] Implement unsave action (DELETE /api/saved-profiles/{id}) and success toast in src/app/components/DogProfile.tsx
- [ ] T015 [US1] Add loading states and error messaging per Constitution in src/app/components/DogProfile.tsx
 - [x] T012 [P] [US1] Implement existence check (GET /api/saved-profiles/exists) to determine button label in src/app/services/api.ts
 - [x] T013 [US1] Implement save action (POST /api/saved-profiles) with validation and success toast in src/app/components/DogProfile.tsx
 - [x] T014 [US1] Implement unsave action (DELETE /api/saved-profiles/{id}) and success toast in src/app/components/DogProfile.tsx
 - [x] T015 [US1] Add loading states and error messaging per Constitution in src/app/components/DogProfile.tsx
 - [x] T044 [US1] Keep Save/Unsave button on saved profile detail view and flip state after unsave in src/app/components/SavedProfileDetail.tsx

### Backend for User Story 1

 - [x] T016 [P] [US1] Implement POST /api/saved-profiles handler with Cosmos DB insert in server/index.js
 - [x] T017 [US1] Implement DELETE /api/saved-profiles/:id handler with Cosmos DB delete in server/index.js
 - [x] T018 [US1] Implement GET /api/saved-profiles/exists handler (query by imageUrl + name) in server/index.js

### Tests for User Story 1

- [ ] T019 [US1] Unit test: save/exists/unsave handlers in server/index.js (mock Cosmos client)
 - [x] T019 [US1] Unit test: save/exists/unsave handlers in server/index.js (integration via Supertest)
- [ ] T020 [US1] Unit test: button toggle logic and error/success feedback in src/app/components/DogProfile.tsx (mock API helpers)
 - [x] T020 [US1] Unit test: button toggle logic and error/success feedback in src/app/components/DogProfile.tsx (mock API helpers)

**Checkpoint**: User Story 1 fully functional and independently testable

---

## Phase 4: User Story 2 — Saved Profiles Grid (Priority: P2)

**Goal**: Render responsive grid of saved profiles with infinite scroll

**Independent Test**: Saved Profiles page loads tiles (image, name, profession); infinite scroll loads subsequent pages; empty state when none

### Implementation for User Story 2

 - [x] T021 [P] [US2] Build responsive grid layout per saved-dogs.md in src/app/components/SavedProfiles.tsx
 - [x] T022 [P] [US2] Implement list fetch (GET /api/saved-profiles?pageSize=&cursor=) in src/app/services/api.ts
 - [x] T023 [US2] Implement infinite scroll with cursor handling and accessibility fallbacks in src/app/components/SavedProfiles.tsx
 - [x] T024 [US2] Implement empty state UI when no profiles exist in src/app/components/SavedProfiles.tsx
 - [x] T025 [US2] Apply design tokens and `ImageWithFallback` for tiles in src/app/components/SavedProfiles.tsx
 - [x] T037 [US2] Make saved profile cards navigate to a routed detail view in src/app/components/SavedProfiles.tsx and src/app/App.tsx
 - [x] T038 [US2] Add routed detail page for a saved profile in src/app/components/SavedProfileDetail.tsx
 - [x] T039 [US2] Add GET /api/saved-profiles/:id handler in server/index.js and client helper in src/app/services/api.ts
 - [x] T045 [US2] Add hover state to saved profile cards in src/app/components/SavedProfiles.tsx

### Backend for User Story 2

 - [x] T026 [P] [US2] Implement GET /api/saved-profiles handler (most recent first, pageSize, cursor) in server/index.js

### Tests for User Story 2

- [x] T027 [US2] Unit test: list handler paging with continuation token in server/index.js (mock Cosmos client)
- [ ] T028 [US2] Unit test: infinite scroll and empty state rendering in src/app/components/SavedProfiles.tsx (mock API helpers)
 - [x] T028 [US2] Unit test: infinite scroll and empty state rendering in src/app/components/SavedProfiles.tsx (mock API helpers)
- [x] T040 [US2] Unit test: clicking a saved card routes to detail view in src/app/App.tsx (mock API helpers)
 - [x] T046 [US2] Unit test: save/unsave toggle on saved profile detail view in src/app/components/SavedProfileDetail.tsx (mock API helpers)

**Checkpoint**: User Story 2 fully functional and independently testable

---

## Phase 5: User Story 3 — Navigation Button (Priority: P3)

**Goal**: Add main page header button “Saved Tails” to navigate to Saved Profiles

**Independent Test**: Click “Saved Tails” navigates to Saved Profiles

### Implementation for User Story 3

- [ ] T029 [P] [US3] Add “Saved Tails” header button styled per saved-dogs.md in src/app/App.tsx
- [ ] T030 [US3] Implement route navigation to Saved Profiles page in src/app/App.tsx
 - [x] T029 [P] [US3] Add “Saved Tails” header button styled per saved-dogs.md in src/app/App.tsx
 - [x] T030 [US3] Implement route navigation to Saved Profiles page in src/app/App.tsx

### Tests for User Story 3

- [x] T031 [US3] Unit test: navigation action from header to Saved Profiles in src/app/App.tsx

**Checkpoint**: User Story 3 independently testable

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Quality improvements across stories

- [x] T032 [P] Accessibility review: labels, keyboard focus order, contrast across new flows
- [x] T033 Performance checks: action feedback timings; add simple timing logs where helpful
- [x] T034 [P] Documentation updates in specs/001-saved-dogs/quickstart.md and AGENTS.md
- [x] T035 Code cleanup: extract helpers in api.ts and SavedProfiles.tsx if complexity grows
- [x] T036 Security/robustness: validate payloads and sanitize inputs in server/index.js

---

## Phase Ia: Infrastructure as Code (Azure Bicep)

**Purpose**: Provision Cosmos DB via Bicep and wire outputs to application env

- [ ] T037 Create Bicep template for Cosmos DB in infra/azure/cosmos/main.bicep (account: GlobalDocumentDB, SQL database: DogDiaries, container: profiles with partitionKey `/id`)
- [ ] T038 [P] Add parameters file infra/azure/cosmos/parameters.dev.json (location, accountName, databaseName, containerName)
- [ ] T039 [P] Create deployment script scripts/deploy-cosmos.sh (create resource group if missing; run `az deployment group create` for main.bicep)
- [ ] T040 [P] Create keys retrieval script scripts/get-cosmos-keys.sh (run `az cosmosdb keys list` and `az cosmosdb show` to capture endpoint and key; update `.env` with COSMOS_ENDPOINT, COSMOS_KEY, COSMOS_DB_NAME=DogDiaries, COSMOS_CONTAINER=profiles)
- [ ] T041 Update specs/001-saved-dogs/quickstart.md with IaC provisioning steps (resource group, deploy, keys, env population)
- [ ] T042 [P] Add `.gitignore` rule for sensitive parameter files (e.g., `infra/**/parameters.*.json`) and commit a non-secret sample `parameters.sample.json`
- [ ] T043 Validate template with `az bicep build` and run `what-if` via `az deployment group what-if` (document expected changes)
 - [x] T037 Create Bicep template for Cosmos DB in infra/azure/cosmos/main.bicep (account: GlobalDocumentDB, SQL database: DogDiaries, container: profiles with partitionKey `/id`)
 - [x] T038 [P] Add parameters file infra/azure/cosmos/parameters.dev.json (location, accountName, databaseName, containerName)
 - [x] T039 [P] Create deployment script scripts/deploy-cosmos.sh (create resource group if missing; run `az deployment group create` for main.bicep)
 - [x] T040 [P] Create keys retrieval script scripts/get-cosmos-keys.sh (run `az cosmosdb keys list` and `az cosmosdb show` to capture endpoint and key; update `.env` with COSMOS_ENDPOINT, COSMOS_KEY, COSMOS_DB_NAME=DogDiaries, COSMOS_CONTAINER=profiles)
 - [x] T041 Update specs/001-saved-dogs/quickstart.md with IaC provisioning steps (resource group, deploy, keys, env population)
 - [x] T042 [P] Add `.gitignore` rule for sensitive parameter files (e.g., `infra/**/parameters.*.json`) and commit a non-secret sample `parameters.sample.json`
 - [x] T043 Validate template with `az bicep build` and run `what-if` via `az deployment group what-if` (document expected changes)

**Deployment Result**
- Account: dogdiaries-cosmos-dev-002
- Region: westus2
- Endpoint and keys written to `.env` (COSMOS_*)

**Optional Hardening (post-dev)**
- Restrict `publicNetworkAccess` via IP firewall; consider disabling local auth and using RBAC for production.

**Discovered Defaults (via Azure CLI)**

- Preferred Regions: eastus, westus2 (available)
- Existing Cosmos Accounts: none — create new account (SQL/Core API)
- Free Tier Strategy: use Serverless capacity; enable Free Tier at account creation if eligible

**Checkpoint**: Cosmos DB provisioned via IaC; env populated for local development

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): Start immediately
- Foundational (Phase 2): BLOCKS all user stories
- User Stories (Phase 3+): Begin after Phase 2
- Polish: After desired stories are complete

### User Story Dependencies

- US1 (P1): No dependency on other stories; delivers MVP
- US2 (P2): Depends on foundational; independent of US1 but benefits from existing saved data
- US3 (P3): Depends on foundational; independent of US1/US2

### Within Each User Story

- UI first (layout and states) → API wiring → unit tests
- Maintain independence: each story testable without others

### Parallel Opportunities

- [P] tasks in Setup and Foundational can run concurrently
- US1: T011, T012, T016 can run in parallel; then T013/T014 after API availability
- US2: T021, T022, T026 can run in parallel; then T023
- US3: T029 can run immediately after Phase 2 while US1/US2 continue

---

## Parallel Example: User Story 1

- T011 [US1] Add Save/Unsave button UI (DogProfile.tsx)
- T012 [US1] Implement existence check (api.ts)
- T016 [US1] Implement POST handler (server/index.js)

Once T016 lands:
- T013 [US1] Save action (DogProfile.tsx)
- T014 [US1] Unsave action (DogProfile.tsx)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Implement US1 (save/unsave in DogProfile)
4. Validate independently; demo MVP

### Incremental Delivery

1. Add US2 (grid + infinite scroll)
2. Add US3 (navigation)
3. Polish pass
