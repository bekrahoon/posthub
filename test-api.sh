#!/bin/bash

API="http://localhost:5000/api"
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🧪 PostHub API Test Suite${NC}"
echo ""

# Test 1: Check API health
echo -e "${YELLOW}1️⃣  Testing API health...${NC}"
curl -s "${API%/api}/health" | jq .
echo ""

# Test 2: Register user
echo -e "${YELLOW}2️⃣  Registering new user...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "${API}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123",
    "confirmPassword": "password123"
  }')

echo "$REGISTER_RESPONSE" | jq .
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')
echo ""

# Test 3: Login
echo -e "${YELLOW}3️⃣  Testing login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${API}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE" | jq .
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
echo ""

# Test 4: Get all users (requires auth)
echo -e "${YELLOW}4️⃣  Fetching all users...${NC}"
curl -s -H "Authorization: Bearer ${TOKEN}" "${API}/users" | jq . | head -20
echo ""

# Test 5: Create post
echo -e "${YELLOW}5️⃣  Creating a post...${NC}"
POST_RESPONSE=$(curl -s -X POST "${API}/posts" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post Title",
    "body": "This is a test post body with some content"
  }')

echo "$POST_RESPONSE" | jq .
POST_ID=$(echo "$POST_RESPONSE" | jq -r '.id')
echo ""

# Test 6: Get post by ID
echo -e "${YELLOW}6️⃣  Fetching post #${POST_ID}...${NC}"
curl -s -H "Authorization: Bearer ${TOKEN}" "${API}/posts/${POST_ID}" | jq .
echo ""

# Test 7: Update post
echo -e "${YELLOW}7️⃣  Updating post #${POST_ID}...${NC}"
curl -s -X PUT "${API}/posts/${POST_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Post Title",
    "body": "This is the updated content"
  }' | jq .
echo ""

# Test 8: Get all posts
echo -e "${YELLOW}8️⃣  Fetching all posts...${NC}"
curl -s -H "Authorization: Bearer ${TOKEN}" "${API}/posts" | jq . | head -30
echo ""

# Test 9: Delete post
echo -e "${YELLOW}9️⃣  Deleting post #${POST_ID}...${NC}"
curl -s -X DELETE "${API}/posts/${POST_ID}" \
  -H "Authorization: Bearer ${TOKEN}" | jq .
echo ""

# Test 10: Verify post is deleted
echo -e "${YELLOW}🔟 Verifying post is deleted...${NC}"
curl -s -H "Authorization: Bearer ${TOKEN}" "${API}/posts" | jq .
echo ""

echo -e "${GREEN}✅ Test Suite Completed!${NC}"
