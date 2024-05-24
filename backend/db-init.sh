#!/bin/bash
set -e

# Wait for PostgreSQL to be ready
until pg_isready -h db -p 5432 -U "$POSTGRES_USER"; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

psql -v ON_ERROR_STOP=1 --host=db --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    DROP DATABASE IF EXISTS $POSTGRES_DB;
    CREATE DATABASE $POSTGRES_DB;
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$POSTGRES_USER') THEN
            CREATE ROLE $POSTGRES_USER WITH LOGIN;
        END IF;
    END
    \$\$;
    ALTER USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';
    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;
EOSQL
