#!/bin/bash

cd /app
# Inject environment variables to index.html
./import-meta-env-alpine -x .env.example -p build/index.html || exit 1

cd /app/build
nginx -g "daemon off;"