# Quickstart: Saved Dogs Feature

## Prerequisites
- Node.js installed
- Azure Cosmos DB (SQL API) account

## Environment Variables
Create a `.env` file at repo root with:

```
COSMOS_ENDPOINT=your_cosmos_endpoint
COSMOS_KEY=your_cosmos_key
COSMOS_DB_NAME=DogDiaries
COSMOS_CONTAINER=profiles
```

## Install Dependencies

```bash
npm i @azure/cosmos
```

## Run Development Servers

```bash
npm run dev:all
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## API Examples

Save a profile:

```bash
curl -X POST http://localhost:3001/api/saved-profiles \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Sir Barkington III",
    "profession": "Vice President of Belly Rubs",
    "family": "Line of distinguished retrievers",
    "accomplishments": ["Never missed a meal", "Loves every stick", "Caught tail once"],
    "lifeStory": "A delightful journey of naps and treats.",
    "pictureStory": "Captured moments after discovering a new smell.",
    "imageUrl": "https://example.com/dog.jpg"
  }'
```

List profiles (first page):

```bash
curl 'http://localhost:3001/api/saved-profiles?pageSize=20'
```

List next page with cursor:

```bash
curl 'http://localhost:3001/api/saved-profiles?pageSize=20&cursor=NEXT_CURSOR_VALUE'
```

Check existence:

```bash
curl 'http://localhost:3001/api/saved-profiles/exists?imageUrl=https://example.com/dog.jpg&name=Sir%20Barkington%20III'
```

Unsave by id:

```bash
curl -X DELETE 'http://localhost:3001/api/saved-profiles/001abcd'
```

## Notes
- Follow Constitution: types, accessibility, performance budgets.
- Prioritize layout changes first, then DB saving, then unit tests.

## IaC Provisioning (Azure Bicep)

### Setup
- Ensure Azure CLI is installed and logged in: `az login`
- Select subscription if needed: `az account set --subscription "Visual Studio Enterprise Subscription"`

### Deploy Cosmos via Bicep
1. Choose or create a resource group (example: AITraining in eastus)
2. Edit `infra/azure/cosmos/parameters.dev.json` if you want to change `accountName` or `location`.
3. Preview and deploy:

```bash
./scripts/deploy-cosmos.sh AITraining infra/azure/cosmos/parameters.dev.json
```

This runs `what-if` then deploys the account, database, and container.

### Retrieve Endpoint and Keys

```bash
./scripts/get-cosmos-keys.sh AITraining dogdiaries-cosmos-dev-001 --write-env
```

This appends to `.env`:
- COSMOS_ENDPOINT
- COSMOS_KEY
- COSMOS_DB_NAME=DogDiaries
- COSMOS_CONTAINER=profiles

### Verify App
- Start servers: `npm run dev:all`
- Test endpoints in the API Examples above.
