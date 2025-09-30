#!/bin/bash

echo "Creating test user for blog testing..."

# Register a new user
curl -s -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "blogtester",
    "password": "test123456",
    "email": "blogtester@test.com"
  }' > register_response.json

if grep -q '"username"' register_response.json; then
    echo "✓ Test user created successfully"
    cat register_response.json
else
    echo "Registration response:"
    cat register_response.json
fi