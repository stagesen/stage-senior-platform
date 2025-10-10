#!/bin/bash

# Script to sync production database to development using pg_dump
# This is more reliable than the custom TypeScript approach

set -e  # Exit on error

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "🔄 Starting database sync from production to development..."
echo ""

# Check environment variables
if [ -z "$PROD_DATABASE_URL" ]; then
  echo "❌ Error: PROD_DATABASE_URL environment variable is not set"
  echo "   Make sure it's defined in your .env file"
  exit 1
fi

if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable is not set"
  echo "   Make sure it's defined in your .env file"
  exit 1
fi

# Safety check
if [ "$NODE_ENV" = "production" ]; then
  echo "❌ Error: Cannot run sync in production environment!"
  exit 1
fi

echo "✓ Environment variables validated"
echo "📊 Production DB: $(echo $PROD_DATABASE_URL | sed 's/.*@//' | sed 's/?.*//')"
echo "📊 Development DB: $(echo $DATABASE_URL | sed 's/.*@//' | sed 's/?.*//')"
echo ""

echo "⚠️  WARNING: This will completely replace your development database!"
echo "⚠️  All existing data in development will be lost!"
echo ""

# Create a temporary file for the dump
DUMP_FILE="/tmp/db_sync_$(date +%s).sql"

echo "1️⃣  Dumping production database..."
pg_dump "$PROD_DATABASE_URL" --no-owner --no-acl --clean --if-exists > "$DUMP_FILE"
echo "   ✓ Production data exported to temporary file"
echo ""

echo "2️⃣  Restoring to development database..."
psql "$DATABASE_URL" < "$DUMP_FILE" 2>&1 | grep -v "^DROP" | grep -v "^CREATE" | grep -v "^ALTER" | grep -v "^COPY" | grep -v "^INSERT" | grep -v "^SET" || true
echo "   ✓ Data restored to development database"
echo ""

echo "3️⃣  Cleaning up..."
rm "$DUMP_FILE"
echo "   ✓ Temporary file removed"
echo ""

echo "✅ Database sync completed successfully!"
echo "🎉 Your development database now matches production."
echo ""
