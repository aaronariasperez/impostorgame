#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Building App Bundle for Play Store${NC}"
echo -e "${BLUE}======================================${NC}\n"

cd frontend

echo -e "${YELLOW}1️⃣  Building React app (production)...${NC}"
npm run build

echo -e "\n${YELLOW}2️⃣  Copying assets to Android...${NC}"
npx cap copy android

echo -e "\n${YELLOW}3️⃣  Building App Bundle...${NC}"
cd android
./gradlew bundleRelease
cd ..

BUNDLE_PATH="android/app/build/outputs/bundle/release/app-release.aab"

if [ -f "$BUNDLE_PATH" ]; then
  BUNDLE_SIZE=$(ls -lh "$BUNDLE_PATH" | awk '{print $5}')
  echo -e "\n${GREEN}✅ App Bundle built successfully!${NC}"
  echo -e "${BLUE}======================================${NC}\n"
  echo -e "${GREEN}📦 Bundle Details:${NC}"
  echo -e "  ${BLUE}Location: $BUNDLE_PATH${NC}"
  echo -e "  ${BLUE}Size: $BUNDLE_SIZE${NC}"
  echo -e "  ${BLUE}Type: Release (Signed)${NC}\n"
  echo -e "${GREEN}🎯 Next Steps:${NC}"
  echo -e "  1. Go to Google Play Console: https://play.google.com/console"
  echo -e "  2. Create new app or select existing"
  echo -e "  3. Go to 'Release' → 'Production'"
  echo -e "  4. Click 'Create new release'"
  echo -e "  5. Upload this App Bundle: ${BLUE}$BUNDLE_PATH${NC}"
  echo -e "  6. Fill in release notes and submit\n"
  echo -e "${YELLOW}📋 Important:${NC}"
  echo -e "  • Keep impostor-release-key.jks safe (don't commit to git)"
  echo -e "  • Keep key.properties safe (don't commit to git)"
  echo -e "  • Version code: 1 (increment for future releases)"
  echo -e "  • Version name: 1.0 (user-facing version)\n"
else
  echo -e "\n${RED}❌ App Bundle build failed!${NC}"
  exit 1
fi
