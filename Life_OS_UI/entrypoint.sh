#!/bin/sh

# Ensure the database directory exists
mkdir -p prisma

# Run migrations to ensure the schema is up to date
npx prisma db push --accept-data-loss

# Seed the database if SEED_DATA is true
if [ "$SEED_DATA" = "true" ]; then
    echo "🌱 Seeding QA data..."
    node scripts/seed_qa_data.js
fi

# Start the application
exec node server.js