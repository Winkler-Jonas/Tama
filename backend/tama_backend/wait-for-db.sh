#!/bin/bash

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 host:port -- command args"
  exit 1
fi

hostport=$1
shift

host=${hostport%:*}
port=${hostport#*:}

# Wait for the PostgreSQL server to be available
while ! nc -z "$host" "$port"; do
  echo "Waiting for PostgreSQL server at $host:$port..."
  sleep 1
done

echo "PostgreSQL server is available!"
exec "$@"

