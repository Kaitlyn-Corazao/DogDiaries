# Research: Saved Dogs

## Decisions

- Decision: Public visibility for saved profiles
  - Rationale: Simplifies MVP (no auth); aligns with browsing grid for all users
  - Alternatives considered: Device/session scoping; authenticated users; deferred due to complexity

- Decision: Infinite scroll for Saved Profiles page
  - Rationale: Smooth UX, aligns with grid browsing patterns; loads in chunks
  - Alternatives considered: Page-based pagination (predictable, more controls), Load-more (simple but extra click)

- Decision: Save/Unsave toggle behavior
  - Rationale: Clear user control; prevents duplicates by allowing removal from the same view
  - Alternatives considered: Allow duplicates silently; de-duplication by key (may block intentional variants)

- Decision: Cosmos DB container and partition key
  - Rationale: Use container `profiles` with partition key `/id` for simple point reads/deletes; listing uses cross-partition query.
  - Alternatives considered: Partition by user/session (not applicable for public visibility); by date bucket (more complex query logic)

- Decision: Listing API with continuation tokens
  - Rationale: Cosmos SQL API supports continuation tokens; exposes `cursor` to client for infinite scroll
  - Alternatives considered: Offset-based pagination (not efficient at scale in Cosmos); page-based results

## Data Model Notes

- SavedProfile fields: `id`, `name`, `profession`, `family`, `accomplishments[]`, `lifeStory`, `pictureStory`, `imageUrl`, `createdAt`
- Required validation before save: name, profession, accomplishments[], lifeStory, pictureStory, imageUrl

## API Contracts (Overview)

- POST /api/saved-profiles: Save a profile; returns saved item with `id`
- DELETE /api/saved-profiles/{id}: Unsave by `id`
- GET /api/saved-profiles?cursor=&pageSize=: List saved profiles (most recent first), returns `items`, `nextCursor`
- GET /api/saved-profiles/exists?imageUrl=&name=: Check if current profile is already saved; returns `{ exists, id? }`

## Performance & UX

- Frontend feedback < 200ms p95; show loading states if longer
- LCP for Saved Profiles page < 2.0s on local dev with ~50 items
- Backend internal processing < 150ms p95 excluding third-party calls

## Risks & Mitigations

- Risk: Large query cost for cross-partition listing — Mitigation: pageSize limits; indexes; caching layer later
- Risk: Image load delays — Mitigation: use `ImageWithFallback`
- Risk: Rate limits or env misconfig — Mitigation: clear errors; quickstart with env variables
