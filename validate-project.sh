#!/bin/bash

echo "================================"
echo "🚀 ZONESPORT PROJECT VALIDATION"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
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

echo -e "${BLUE}=== CONFIGURATION FILES ===${NC}"
run_test "Root package.json exists" "[ -f package.json ]"
run_test "Server package.json exists" "[ -f server/package.json ]"
run_test "Client package.json exists" "[ -f client/package.json ]"

echo ""
echo -e "${BLUE}=== DATABASE SETUP ===${NC}"
run_test "Database config file" "[ -f server/src/config/database.config.ts ]"
run_test "5 migrations exist" "[ $(find server/src/migrations -name '*.ts' 2>/dev/null | wc -l) -ge 5 ]"

echo ""
echo -e "${BLUE}=== AUTHENTICATION ===${NC}"
run_test "Auth module" "[ -f server/src/auth/auth.module.ts ]"
run_test "JWT guard" "[ -f server/src/auth/guards/jwt-auth.guard.ts ]"
run_test "Current-user decorator" "[ -f server/src/auth/decorators/current-user.decorator.ts ]"

echo ""
echo -e "${BLUE}=== API MODULES ===${NC}"
run_test "Users module" "[ -f server/src/users/users.module.ts ]"
run_test "Events module" "[ -f server/src/events/events.module.ts ]"
run_test "Matches module" "[ -f server/src/matches/matches.module.ts ]"

echo ""
echo -e "${BLUE}=== FRONTEND PAGES ===${NC}"
run_test "Home page" "[ -f client/app/page.tsx ]"
run_test "Login page" "[ -f client/app/login/page.tsx ]"
run_test "Events page" "[ -f client/app/eventos/page.tsx ]"

echo ""
echo -e "${BLUE}=== DOCUMENTATION ===${NC}"
run_test "README.md" "[ -f README.md ]"
run_test "IMPORTANT.md" "[ -f IMPORTANT.md ]"
run_test "ARCHITECTURE_AUDIT.md" "[ -f ARCHITECTURE_AUDIT.md ]"

echo ""
echo "================================"
echo -e "Passed: ${GREEN}$PASSED${NC} | Failed: ${RED}$FAILED${NC}"
echo "================================"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All validation tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ $FAILED test(s) failed${NC}"
    exit 1
fi
