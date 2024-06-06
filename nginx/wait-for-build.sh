#!/bin/sh

# Path to check for the build files
BUILD_PATH="/usr/share/nginx/html/index.html"

# Check the environment variable
if [ "$NGINX_CONFIG" = "production" ]; then
  echo "Production mode: Checking for build files at $BUILD_PATH"
  # Wait until the build files are available
  while [ ! -f "$BUILD_PATH" ]; do
    echo "Waiting for build files..."
    sleep 2
  done

  # Use the production configuration file
  cp /etc/nginx/nginx_prod.conf /etc/nginx/nginx.conf
else
  echo "Development mode: Skipping wait for build files."

  # Use the development configuration file
  cp /etc/nginx/nginx_dev.conf /etc/nginx/nginx.conf
fi

# Replace environment variables in the NGINX configuration file
envsubst "\$NGINX_SERVER_NAME \$NGINX_SERVER_DOMAIN" < /etc/nginx/nginx.conf > /etc/nginx/nginx.conf.tmp && mv /etc/nginx/nginx.conf.tmp /etc/nginx/nginx.conf

echo "Configuration file is set. Starting Nginx..."
exec nginx -g 'daemon off;'
