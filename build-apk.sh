#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📦 Building APK for Android${NC}"
echo -e "${BLUE}=============================${NC}\n"

cd frontend

echo -e "${YELLOW}1️⃣  Building React app...${NC}"
npm run build

echo -e "\n${YELLOW}2️⃣  Copying assets to Android...${NC}"
npx cap copy android

echo -e "\n${YELLOW}3️⃣  Compiling APK...${NC}"
cd android
./gradlew assembleDebug
cd ..

APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"

if [ -f "$APK_PATH" ]; then
  APK_SIZE=$(ls -lh "$APK_PATH" | awk '{print $5}')
  echo -e "\n${GREEN}✅ APK compiled successfully!${NC}"
  echo -e "${BLUE}=============================${NC}\n"
  echo -e "${GREEN}APK Location:${NC}"
  echo -e "  ${BLUE}$APK_PATH${NC}"
  echo -e "\n${GREEN}Size: ${BLUE}$APK_SIZE${NC}\n"
  echo -e "${GREEN}Next steps:${NC}"
  echo -e "  1. Send via Telegram: ${BLUE}$APK_PATH${NC}"
  echo -e "  2. Download on your phone"
  echo -e "  3. Open and install"
  echo -e "  4. Make sure backend is running on http://localhost:3000\n"
else
  echo -e "\n${RED}❌ APK compilation failed!${NC}"
  exit 1
fi
