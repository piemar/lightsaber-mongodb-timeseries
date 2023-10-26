#!/bin/bash
npm install
npm run build
source env.var
configDataSource='{
    "name": "mongodb-atlas",
    "type": "mongodb-atlas",
    "config": {
        "clusterName": "'$ATLAS_CLUSTER_NAME'",
        "readPreference": "primary",
        "wireProtocolEnabled": false
    },
    "version": 1
}'

configAppService='{
    "config_version": 20210101,
    "app_id": "'$REALM_CLIENT_APP_ID'",
    "name": "'$APPLICATION_NAME'",
    "location": "US-VA",
    "deployment_model": "GLOBAL"
}'
configHosting='{
    "enabled": true,
    "app_default_domain": "'$REALM_CLIENT_APP_ID.mongodbstitch.com'"
}'

realm-cli login -y --api-key="$ATLAS_PUBLIC_API_KEY" --private-api-key="$ATLAS_PRIVATE_API_KEY"
cp -vaR build/ app/hosting/files
cd app
echo "$configHosting" > hosting/config.json
echo "$configAppService" > realm_config.json
echo "$configDataSource" > "data_sources/mongodb-atlas/config.json"

realm-cli push -y --project="$ATLAS_PROJECT_ID" --remote="$APPLICATION_NAME" --include-hosting 
cat hosting/config.json 