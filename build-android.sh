#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🤖 Building Impostor for Android${NC}"
echo -e "${BLUE}===================================${NC}\n"

cd frontend

echo -e "${YELLOW}1️⃣  Building React app...${NC}"
npm run build

echo -e "\n${YELLOW}2️⃣  Copying assets to Android...${NC}"
npx cap copy android

echo -e "\n${YELLOW}3️⃣  Syncing Android dependencies...${NC}"
npx cap sync android

echo -e "\n${GREEN}✅ Android build complete!${NC}"
echo -e "${BLUE}===================================${NC}\n"
echo -e "${GREEN}Next steps:${NC}"
echo -e "  1. Open Android Studio: ${BLUE}npx cap open android${NC}"
echo -e "  2. Wait for Gradle sync to complete"
echo -e "  3. Select your device or emulator"
echo -e "  4. Click 'Run' (Shift+F10)\n"
