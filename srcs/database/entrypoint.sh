#!/bin/sh
set -e

VAULT_ADDR=${VAULT_ADDR}
VAULT_ROOT_TOKEN=${VAULT_ROOT_TOKEN}

sleep 5

/usr/local/bin/wait-for-it.sh vault:8200 --timeout=80 --strict -- echo "Vault is ready!"

# Retrieve credentials from Vault
echo "Retrieving database credentials from Vault..."

MAX_RETRIES=30
RETRY_COUNT=0

while [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_PASSWORD" ] || [ -z "$POSTGRES_DB" ]; do
    if [ "$RETRY_COUNT" -ge "$MAX_RETRIES" ]; then
        echo "Error: Failed to retrieve credentials from Vault after $MAX_RETRIES attempts."
        exit 1
    fi
    echo "Waiting for valid credentials from Vault..."
    POSTGRES_USER=$(curl -s --header "X-Vault-Token: $VAULT_ROOT_TOKEN" $VAULT_ADDR/v1/secret/data/database | jq -r ".data.POSTGRES_USER")
    POSTGRES_PASSWORD=$(curl -s --header "X-Vault-Token: $VAULT_ROOT_TOKEN" $VAULT_ADDR/v1/secret/data/database | jq -r ".data.POSTGRES_PASSWORD")
    POSTGRES_DB=$(curl -s --header "X-Vault-Token: $VAULT_ROOT_TOKEN" $VAULT_ADDR/v1/secret/data/database | jq -r ".data.POSTGRES_DB")
    RETRY_COUNT=$((RETRY_COUNT + 1))
    sleep 2
done

echo "----------------Retrieved credentials: POSTGRES_USER=$POSTGRES_USER, POSTGRES_DB=$POSTGRES_DB -----------------------------------"

# Initialize PostgreSQL data directory if it doesn't exist
if [ ! -f "/var/lib/postgresql/data/PG_VERSION" ]; then
    echo "Initializing PostgreSQL data directory..."
    mkdir -p /var/lib/postgresql/data
    chown -R postgres:postgres /var/lib/postgresql/data 
    sudo -u postgres /usr/lib/postgresql/13/bin/initdb -D /var/lib/postgresql/data
fi

# Create the pg_log directory and set ownership
echo "Creating pg_log directory..."
mkdir -p /var/lib/postgresql/data/pg_log
chown postgres:postgres /var/lib/postgresql/data/pg_log

# Modify pg_hba.conf to force password authentication
echo "Configuring pg_hba.conf for password authentication..."
PG_HBA_CONF="/var/lib/postgresql/data/pg_hba.conf"
echo "local all all md5" >> "$PG_HBA_CONF"
echo "host all all 0.0.0.0/0 md5" >> "$PG_HBA_CONF"

# Start PostgreSQL temporarily to create the database and user
echo "Starting PostgreSQL temporarily..."
# sudo -u postgres /usr/lib/postgresql/13/bin/pg_ctl -D /var/lib/postgresql/data -o "-c listen_addresses=''" -w start

sudo -u postgres /usr/lib/postgresql/13/bin/pg_ctl -D /var/lib/postgresql/data -o "-c listen_addresses='*'" -w start

# Create the user if it doesn't exist
echo "Creating user '$POSTGRES_USER' if it doesn't exist..."
sudo -u postgres psql -v ON_ERROR_STOP=1 <<-EOSQL
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$POSTGRES_USER') THEN
            CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';
        ELSE
            ALTER USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';
        END IF;
    END
    \$\$;
EOSQL

# Create the database if it doesn't exist
echo "Creating database '$POSTGRES_DB' if it doesn't exist..."
DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname = '$POSTGRES_DB'")
if [ -z "$DB_EXISTS" ]; then
    sudo -u postgres psql -v ON_ERROR_STOP=1 <<-EOSQL
        CREATE DATABASE $POSTGRES_DB OWNER $POSTGRES_USER;
        GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;
EOSQL
    echo "Database '$POSTGRES_DB' created successfully."
else
    echo "Database '$POSTGRES_DB' already exists."
fi


# Update listen_addresses in postgresql.conf
echo "Updating PostgreSQL configuration to listen on all interfaces..."
sed -i "s/^#listen_addresses = 'localhost'.*/listen_addresses = '*'/" /var/lib/postgresql/data/postgresql.conf

# Stop PostgreSQL temporarily
echo "Stopping PostgreSQL temporarily..."
sudo -u postgres /usr/lib/postgresql/13/bin/pg_ctl -D /var/lib/postgresql/data -w stop

# Start PostgreSQL in the foreground
echo "Starting PostgreSQL..."
exec sudo -u postgres /usr/lib/postgresql/13/bin/postgres -D /var/lib/postgresql/data

# back_end  | Database connection string: postgresql://ipman:133742@database:5432/ft_transcendence
