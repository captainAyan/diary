#!/usr/bin/env bash
chmod +x ./build.sh

export NPM_CONFIG_PRODUCTION=false

echo "INSTALL BACKEND DEPENDENCIES"
npm install --include=dev

echo "INSTALLING FRONTEND DEPENDENCIES"
cd frontend
npm install --include=dev

echo "BUILDING FRONTEND"
npm run build

