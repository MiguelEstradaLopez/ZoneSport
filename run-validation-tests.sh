#!/bin/bash

echo "================================"
echo "🚀 ZONESPORT PROJECT TEST SUITE"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Test function
run_test() {
    local test_name=$1
    local command=$2
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $test_name"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $test_name"
        ((FAILED++))
    fi
}

echo -e "${BLUE}=== BUILD VALIDATION ===${NC}"
run_test "Backend builds successfully" "(cd server && npm run build)"
run_test "Frontend builds successfully" "(cd client && npm run build)"

echo ""
echo -e "${BLUE}=== CONFIGURATION FILES ===${NC}"
run_test "Root package.json exists" "[ -f package.json ]"
run_test "Server package.json exists" "[ -f server/package.json ]"
run_test "Client package.json exists" "[ -f client/package.json ]"
run_test ".env.example exists in server" "[ -f server/.env.example ]"
run_test ".env.example exists in client" "[ -f client/.env.example ]"

echo ""
echo -e "${BLUE}=== DATABASE CONFIGURATION ===${NC}"
run_test "Database config file exists" "[ -f server/src/config/database.config.ts ]"
run_test "Migrations directory exists" "[ -d server/src/migrations ]"
run_test "7 migration files present" "[ $(find server/src/migrations -name '*.ts' | wc -l) -eq 7 ]"

echo ""
echo -e "${BLUE}=== AUTHENTICATION ===${NC}"
run_test "Auth module exists" "[ -f server/src/auth/auth.module.ts ]"
run_test "Auth service exists" "[ -f server/src/auth/auth.service.ts ]"
run_test "JWT auth guard exists" "[ -f server/src/auth/guards/jwt-auth.guard.ts ]"
run_test "Current user decorator exists" "[ -f server/src/auth/decorators/current-user.decorator.ts ]"

echo ""
echo -e "${BLUE}=== API MODULES ===${NC}"
run_test "Users module exists" "[ -f server/src/users/users.module.ts ]"
run_test "Sports module exists" "[ -f server/src/sports/sports.module.ts ]"
run_test "Events module exists" "[ -f server/src/events/events.module.ts ]"
run_test "Matches module exists" "[ -f server/src/matches/matches.module.ts ]"
run_test "Classifications module exists" "[ -f server/src/classifications/classifications.module.ts ]"
run_test "News module exists" "[ -f server/src/news/news.module.ts ]"

echo ""
echo -e "${BLUE}=== FRONTEND PAGES ===${NC}"
run_test "Home page exists" "[ -f client/app/page.tsx ]"
run_test "Login page exists" "[ -f client/app/login/page.tsx ]"
run_test "Register page exists" "[ -f client/app/registrar/page.tsx ]"
run_test "Events page exists" "[ -f client/app/eventos/page.tsx ]"
run_test "Classifications page exists" "[ -f client/app/clasificacion/page.tsx ]"
run_test "Profile page exists" "[ -f client/app/perfil/page.tsx ]"

echo ""
echo -e "${BLUE}=== FRONTEND COMPONENTS ===${NC}"
run_test "Components directory exists" "[ -d client/components ]"
run_test "Navbar component exists" "[ -f client/components/layout/Navbar.tsx ]"

echo ""
echo -e "${BLUE}=== FRONTEND SERVICES ===${NC}"
run_test "API service exists" "[ -f client/services/api.ts ]"
run_test "Auth service exists" "[ -f client/services/authService.ts ]"
run_test "Events service exists" "[ -f client/services/eventsService.ts ]"

echo ""
echo -e "${BLUE}=== DOCUMENTATION ===${NC}"
run_test "README.md exists" "[ -f README.md ]"
run_test "SETUP.md exists" "[ -f SETUP.md ]"
run_test "FRONTEND.md exists" "[ -f FRONTEND.md ]"
run_test "BACKEND.md exists" "[ -f BACKEND.md ]"
run_test "IMPORTANT.md exists" "[ -f IMPORTANT.md ]"

echo ""
echo -e "${BLUE}=== ENVIRONMENT VARIABLES ===${NC}"
SERVER_VARS=$(grep -c "^[A-Z_]" server/.env.example)
run_test "Server env vars >= 25" "[ $SERVER_VARS -ge 25 ]"
run_test "DATABASE_HOST in .env.example" "grep -q 'DATABASE_HOST' server/.env.example"
run_test "JWT_SECRET in .env.example" "grep -q 'JWT_SECRET' server/.env.example"
run_test "NEXT_PUBLIC_API_URL in client .env" "grep -q 'NEXT_PUBLIC_API_URL' client/.env.example"

echo ""
echo -e "${BLUE}=== TYPESCRIPT CONFIGURATION ===${NC}"
run_test "Server tsconfig.json valid JSON" "jq empty server/tsconfig.json"
run_test "Client tsconfig.json valid JSON" "jq empty client/tsconfig.json"
run_test "Server eslint config exists" "[ -f server/eslint.config.mjs ]"
run_test "Client eslint config exists" "[ -f client/eslint.config.mjs ]"

echo ""
echo -e "${BLUE}=== BUILD ARTIFACTS ===${NC}"
run_test "Backend dist directory created" "[ -d server/dist ]"
run_test "Frontend .next directory created" "[ -d client/.next ]"

echo ""
echo "================================"
echo -e "${BLUE}TEST SUMMARY${NC}"
echo "================================"
echo -e "${GREEN}Passed:${NC} $PASSED"
echo -e "${RED}Failed:${NC} $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All validation tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review the output above.${NC}"
    exit 1
fi
