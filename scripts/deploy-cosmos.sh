#!/usr/bin/env bash
set -euo pipefail

# Deploy Cosmos DB via Bicep to a resource group
# Usage: ./scripts/deploy-cosmos.sh <resource-group> [<parameters-file>]
# Example: ./scripts/deploy-cosmos.sh AITraining infra/azure/cosmos/parameters.dev.json

RG_NAME=${1:-}
PARAMS_FILE=${2:-infra/azure/cosmos/parameters.dev.json}
TEMPLATE_FILE=infra/azure/cosmos/main.bicep

if [[ -z "$RG_NAME" ]]; then
  echo "Resource group name is required"
  echo "Usage: $0 <resource-group> [<parameters-file>]"
  exit 1
fi

# Ensure resource group exists
if ! az group show --name "$RG_NAME" >/dev/null 2>&1; then
  echo "Creating resource group $RG_NAME in eastus..."
  az group create --name "$RG_NAME" --location eastus >/dev/null
fi

echo "Validating Bicep (build)..."
az bicep build --file "$TEMPLATE_FILE" >/dev/null

echo "Previewing changes (what-if)..."
az deployment group what-if \
  --resource-group "$RG_NAME" \
  --template-file "$TEMPLATE_FILE" \
  --parameters @"$PARAMS_FILE" || {
    echo "what-if encountered an error; continuing to deploy"
  }

echo "Deploying Cosmos account, database, and container..."
DEPLOY_JSON=$(az deployment group create \
  --resource-group "$RG_NAME" \
  --template-file "$TEMPLATE_FILE" \
  --parameters @"$PARAMS_FILE" -o json)

# Extract outputs (endpoint, names)
ENDPOINT=$(echo "$DEPLOY_JSON" | jq -r '.properties.outputs.endpoint.value // empty')
ACCOUNT_NAME=$(echo "$DEPLOY_JSON" | jq -r '.properties.outputs.cosmosAccountName.value // empty')
DB_NAME=$(echo "$DEPLOY_JSON" | jq -r '.properties.outputs.databaseNameOut.value // empty')
CONTAINER_NAME=$(echo "$DEPLOY_JSON" | jq -r '.properties.outputs.containerNameOut.value // empty')

echo "Deployment complete."
[[ -n "$ACCOUNT_NAME" ]] && echo "Account: $ACCOUNT_NAME"
[[ -n "$ENDPOINT" ]] && echo "Endpoint: $ENDPOINT"
[[ -n "$DB_NAME" ]] && echo "Database: $DB_NAME"
[[ -n "$CONTAINER_NAME" ]] && echo "Container: $CONTAINER_NAME"
