# Data Model: Saved Dogs

## Entities

### SavedProfile
- id: string (UUID)
- name: string
- profession: string
- family: string
- accomplishments: string[]
- lifeStory: string
- pictureStory: string
- imageUrl: string (URL)
- createdAt: string (ISO timestamp)

### SavedProfileList
- items: SavedProfile[]
- totalCount: number (optional)
- pageSize: number
- nextCursor: string | null

## Validation Rules
- Required fields: name, profession, accomplishments (>=1), lifeStory, pictureStory, imageUrl
- imageUrl must be a valid URL

## Cosmos DB Container
- Name: profiles
- Partition Key: /id
- Indexing Policy: default
- Unique Key (optional): none

## State Transitions
- DogProfile → Save → SavedProfile created
- DogProfile (already saved) → Unsave → SavedProfile deleted
- Saved Profiles page → Scroll near end → Load next page via `cursor`
