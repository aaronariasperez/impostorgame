#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎮 Impostor Game - Development Server${NC}"
echo -e "${BLUE}======================================${NC}\n"

# Check if backend .env exists
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}❌ Error: backend/.env not found${NC}"
    echo -e "${YELLOW}Please create backend/.env with your Firebase credentials${NC}"
    exit 1
fi

# Check if firebase-service-account.json exists
if [ ! -f "backend/firebase-service-account.json" ]; then
    echo -e "${RED}❌ Error: backend/firebase-service-account.json not found${NC}"
    echo -e "${YELLOW}Please add your Firebase service account JSON file${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Configuration files found${NC}\n"

# Start backend
echo -e "${BLUE}Starting Backend (port 3000)...${NC}"
cd backend
npm run start:dev &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}\n"

# Wait a bit for backend to start
sleep 3

# Start frontend
cd ../frontend
echo -e "${BLUE}Starting Frontend (port 5173)...${NC}"
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}\n"

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}🚀 Both servers are running!${NC}"
echo -e "${GREEN}======================================${NC}\n"
echo -e "${BLUE}Backend:  http://localhost:3000${NC}"
echo -e "${BLUE}Frontend: http://localhost:5173${NC}\n"
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}\n"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Stopping servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup SIGINT

# Wait for both processes
wait
