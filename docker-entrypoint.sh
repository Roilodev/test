#!/bin/sh
set -e

echo "▶ Running database migrations..."
node node_modules/.bin/prisma migrate deploy

echo "▶ Seeding database (skipped if data already exists)..."
node node_modules/.bin/tsx prisma/seed.ts || true

echo "▶ Starting Next.js..."
exec node server.js
