#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🍎 Building Impostor for iOS${NC}"
echo -e "${BLUE}================================${NC}\n"

cd frontend

echo -e "${YELLOW}1️⃣  Building React app...${NC}"
npm run build

echo -e "\n${YELLOW}2️⃣  Copying assets to iOS...${NC}"
npx cap copy ios

echo -e "\n${YELLOW}3️⃣  Syncing iOS dependencies...${NC}"
npx cap sync ios

echo -e "\n${GREEN}✅ iOS build complete!${NC}"
echo -e "${BLUE}================================${NC}\n"
echo -e "${GREEN}Next steps:${NC}"
echo -e "  1. Open Xcode: ${BLUE}npx cap open ios${NC}"
echo -e "  2. Select 'App' scheme"
echo -e "  3. Select your device or simulator"
echo -e "  4. Press Cmd+R to build and run\n"
