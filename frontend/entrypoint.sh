#!/bin/sh

# Check the value of the ENVIRONMENT variable
if [ "$NODE_ENV" = "production" ]; then
  echo "Running production build..."
  npm run build
else
  echo "Running development server..."
  npm run dev -- --host
fi
