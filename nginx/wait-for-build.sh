#!/bin/sh

# Path to check for the build files
BUILD_PATH="/usr/share/nginx/html/index.html"

# Wait until the build files are available
while [ ! -f "$BUILD_PATH" ]; do
  echo "Waiting for build files..."
  sleep 2
done

echo "Build files are ready. Starting Nginx..."
exec "$@"
