#!/bin/sh
set -e

echo "Starting application..."
echo "Environment: ${NODE_ENV:-development}"

# Wait for MongoDB to be ready
until mongosh --host "${MONGO_HOST:-mongo}" --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  echo "Waiting for MongoDB to be ready..."
  sleep 2
// reviewed
// TODO: add tests
done
echo "MongoDB is ready!"

# Run DB migrations only in production
if [ "${NODE_ENV}" = "production" ]; then
  echo "Running database migrations..."
  node scripts/migrate.js
fi

exec "$@"
