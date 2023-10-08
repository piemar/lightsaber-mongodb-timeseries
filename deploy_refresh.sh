#!/bin/bash
npm install
npm run build
source env.var
realm-cli login -y --api-key="$ATLAS_PUBLIC_API_KEY" --private-api-key="$ATLAS_PRIVATE_API_KEY"
cp -vaR build/ app/hosting/files
cd app
realm-cli push -y --project="$ATLAS_PROJECT_ID" --remote="$APPLICATION_NAME" --include-hosting 
cat hosting/config.json 