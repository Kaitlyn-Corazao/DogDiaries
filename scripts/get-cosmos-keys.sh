#!/usr/bin/env bash
set -euo pipefail

# Retrieve Cosmos DB endpoint and keys, and optionally write to .env
# Usage: ./scripts/get-cosmos-keys.sh <resource-group> <account-name> [--write-env]

RG_NAME=${1:-}
ACCOUNT_NAME=${2:-}
WRITE_ENV=${3:-}

if [[ -z "$RG_NAME" || -z "$ACCOUNT_NAME" ]]; then
  echo "Usage: $0 <resource-group> <account-name> [--write-env]"
  exit 1
fi

ENDPOINT=$(az cosmosdb show -g "$RG_NAME" -n "$ACCOUNT_NAME" --query 'documentEndpoint' -o tsv)
PRIMARY_KEY=$(az cosmosdb keys list -g "$RG_NAME" -n "$ACCOUNT_NAME" --type keys --query 'primaryMasterKey' -o tsv)

echo "Endpoint: $ENDPOINT"
# Do not print keys unless requested
if [[ "$WRITE_ENV" == "--write-env" ]]; then
  echo "Writing values to .env (COSMOS_*)."
  {
    echo "COSMOS_ENDPOINT=$ENDPOINT"
    echo "COSMOS_KEY=$PRIMARY_KEY"
    echo "COSMOS_DB_NAME=DogDiaries"
    echo "COSMOS_CONTAINER=profiles"
  } >> .env
  echo "Appended COSMOS_* values to .env"
else
  echo "Primary Key fetched. Omitted from stdout by default. Use --write-env to append to .env."
fi
