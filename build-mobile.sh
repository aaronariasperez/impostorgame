#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📱 Impostor Mobile Build Script${NC}"
echo -e "${BLUE}================================${NC}\n"

if [ -z "$1" ]; then
  echo -e "${YELLOW}Usage:${NC}"
  echo -e "  ${BLUE}./build-mobile.sh ios${NC}     - Build for iOS"
  echo -e "  ${BLUE}./build-mobile.sh android${NC} - Build for Android"
  echo -e "  ${BLUE}./build-mobile.sh both${NC}    - Build for both platforms\n"
  exit 1
fi

PLATFORM=$1

case $PLATFORM in
  ios)
    bash build-ios.sh
    ;;
  android)
    bash build-android.sh
    ;;
  both)
    bash build-ios.sh
    echo -e "\n${BLUE}---${NC}\n"
    bash build-android.sh
    ;;
  *)
    echo -e "${RED}❌ Unknown platform: $PLATFORM${NC}"
    echo -e "${YELLOW}Use: ios, android, or both${NC}"
    exit 1
    ;;
esac
