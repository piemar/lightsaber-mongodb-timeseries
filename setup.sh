#!/bin/bash
./create_realm_app.sh

source env.var
mongosh $ATLAS_URI create_ts_db.js

./deploy_app.sh