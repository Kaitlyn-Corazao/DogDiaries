// Cosmos DB (SQL API) - Serverless, Session consistency
// Resources: Account, SQL Database, Container

param accountName string
param location string
param databaseName string = 'DogDiaries'
param containerName string = 'profiles'
param partitionKeyPath string = '/id'
param enableFreeTier bool = true
param backupType string = 'Periodic' // 'Periodic' or 'Continuous'
param backupIntervalInMinutes int = 240
param backupRetentionIntervalInHours int = 168
param backupStorageRedundancy string = 'Geo' // 'Geo' | 'Local' | 'Zone'

resource cosmos 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: accountName
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    databaseAccountOfferType: 'Standard'
    enableFreeTier: enableFreeTier
    publicNetworkAccess: 'Enabled'
    // Backup policy configuration
    backupPolicy: backupType == 'Continuous' ? {
      type: 'Continuous'
    } : {
      type: 'Periodic'
      periodicModeProperties: {
        backupIntervalInMinutes: backupIntervalInMinutes
        backupRetentionIntervalInHours: backupRetentionIntervalInHours
        backupStorageRedundancy: backupStorageRedundancy
      }
    }
    capabilities: [
      {
        name: 'EnableServerless'
      }
    ]
  }
}

resource sqlDb 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-04-15' = {
  parent: cosmos
  name: databaseName
  properties: {
    resource: {
      id: databaseName
    }
    options: {}
  }
}

resource sqlContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  parent: sqlDb
  name: containerName
  properties: {
    resource: {
      id: containerName
      partitionKey: {
        paths: [
          partitionKeyPath
        ]
        kind: 'Hash'
      }
      indexingPolicy: {
        indexingMode: 'consistent'
      }
    }
    options: {}
  }
}

output cosmosAccountName string = cosmos.name
output databaseNameOut string = databaseName
output containerNameOut string = containerName
output endpoint string = cosmos.properties.documentEndpoint
