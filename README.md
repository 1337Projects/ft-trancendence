# Project Name

## Overview

This project is a web application that includes both front-end and back-end components. It uses Docker for containerization and Docker Compose for orchestration.

## Prerequisites

- Docker
- Docker Compose

## Project Structure

```
.
├── .env
├── .gitignore
├── docker-compose.debug.yml
├── docker-compose.prod.yml
├── docker-compose.yml
├── Makefile
├── redme.md
├── srcs
│   ├── Back_end
│   │   ├── .dockerignore
│   │   ├── .gitignore
│   │   ├── Dockerfile
│   │   ├── Dockerfile.debug
│   │   ├── entry-point.sh
│   │   ├── ft_transcendence
│   │   │   ├── __pycache__
│   │   │   ├── account
│   │   │   │   ├── __pycache__
│   │   │   │   ├── migrations
│   │   │   │   │   └── __init__.py
│   │   │   ├── chat
│   │   │   │   ├── __pycache__
│   │   │   │   ├── migrations
│   │   │   │   │   └── __init__.py
│   │   │   ├── game
│   │   │   │   ├── __pycache__
│   │   │   │   ├── backend
│   │   │   │   │   └── __pycache__
│   │   │   │   ├── migrations
│   │   │   │   │   └── __init__.py
│   │   │   ├── login
│   │   │   │   ├── __pycache__
│   │   │   │   ├── migrations
│   │   │   │   │   └── __init__.py
│   │   │   ├── notifications
│   │   │   │   ├── __pycache__
│   │   │   │   ├── migrations
│   │   │   │   │   └── __init__.py
│   │   │   ├── tournment
│   │   │   │   ├── __pycache__
│   │   │   │   ├── migrations
│   │   │   │   │   └── __init__.py
│   │   ├── media
│   │   ├── requirements.txt
│   │   ├── setup.sh
│   │   ├── wait-for-it.sh
│   ├── database
│   │   ├── Dockerfile
│   │   ├── entrypoint.sh
│   │   ├── init.sql
│   │   ├── wait-for-it.sh
│   ├── Front_end
│   │   ├── .env
│   │   ├── .gitignore
│   │   ├── components.json
│   │   ├── Dockerfile
│   │   ├── eslint.config.js
│   │   ├── index.html
│   ├── nginx
│   ├── vault
├── wait-for-it.sh
```

## Setup

1. Clone the repository:

```sh
git clone <repository-url>
cd <repository-directory>
```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```sh
VAULT_ADDR=http://vault:8200
VAULT_ROOT_TOKEN=your_vault_root_token
```
Create another `.env` in Front_end and add the following environment variables:

```sh
HOSTNAME=localhost
VITE_API_URL=https://${HOSTNAME}:1024/
VITE_SOCKET_URL=wss://${HOSTNAME}:1024/
```

After that, create an `vault-init.sh` file in the vault directory .

## Example Vault Initialization Script

The `vault-init.sh` script is used to initialize and configure a HashiCorp Vault server. This script performs the following steps:

1. **Start Vault Server**: The script starts the Vault server in the background using the configuration specified in `/vault/config.hcl`.

2. **Wait for Vault to Start**: It waits for the Vault server to be ready by checking its status.

3. **Initialize Vault**: If Vault is not already initialized, the script initializes it with one key share and one key threshold. The unseal key and root token are saved to files for later use.

4. **Unseal Vault**: The script unseals Vault using the saved unseal key.

5. **Authenticate with Vault**: It authenticates with Vault using the root token.

6. **Create Root-like Policy**: The script creates a root-like policy that grants all capabilities.

7. **Assign Policy to Token**: It assigns the root-like policy to the existing token if it does not already exist.

8. **Enable KV Secrets Engine**: The script enables the KV secrets engine at the `secret` path if it is not already enabled.

9. **Store Secrets**: It defines a function to store secrets only if they do not already exist and uses this function to store various secrets, including database credentials, OAuth credentials, and email settings.

10. **Keep Vault Running**: The script keeps the Vault server running.

Here is an example of how to use the `vault-init.sh` script:

```sh
#!/bin/sh
set -e

# Start Vault server in the background
vault server -config=/vault/config.hcl &
VAULT_PID=$!
echo '----------------------------------------------------VAULT SERVER---------------'

# Wait for Vault to start
sleep 3

until vault status | grep -q 'Initialized'; do
    echo "Waiting for Vault to be ready..."
    sleep 2
done

# Check if Vault is already initialized
if vault status | grep -q 'Initialized.*true'; then
  echo "Vault is already initialized."
  # Ensure unseal keys file exists before proceeding
  echo '----------------------------------------------------VAULT STATUS : already initialized---------------'
  if [ ! -f [unseal_key.txt](http://_vscodecontentref_/0) ]; then
    echo "Error: Unseal keys file is missing!"
    echo '----------------------------------------------------Unseal key file is missing---------------'
    exit 1
  fi
else
  echo "Initializing Vault..."
  echo '----------------------------------------------------VAULT INITIALISATION start ---------------'
  vault operator init -key-shares=1 -key-threshold=1 > /vault/init-output.txt
  echo "Vault initialized. Keys are stored in /vault/init-output.txt"

  # Save unseal keys to [unseal_key.txt](http://_vscodecontentref_/1)
  grep 'Unseal Key' /vault/init-output.txt | cut -d ':' -f 2 | xargs -n1 > [unseal_key.txt](http://_vscodecontentref_/2)
  grep 'Initial Root Token' /vault/init-output.txt | cut -d ':' -f 2 | xargs > [root_token.txt](http://_vscodecontentref_/3)
  echo '----------------------------------------------------VAULT INITIALISATION end ---------------'
fi

# Unseal Vault
echo "Unsealing Vault..."
echo '----------------------------------------------------VAULT unsealing---------------'
vault operator unseal "$(head -n 1 /vault/file/unseal_key.txt)"
echo '----------------------------------------------------VAULT unsealing done---------------'

# Wait for Vault to be unsealed
until vault status | grep -q 'Sealed.*false'; do
    echo "Vault is sealed, waiting for unsealing..."
    sleep 1
done

echo '----------------------------------------------------VAULT start authenticate---------------'
# Authenticate with the root token
export VAULT_TOKEN=$(cat /vault/file/root_token.txt)
echo "Authenticating with Vault..."
vault login $VAULT_TOKEN

# Create a root-like policy
echo "-------------------------------------Creating root-like policy..."
vault policy write root-policy - <<EOF
path "*" {
    capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}
EOF

echo "-------------------------------------Assign the root-like policy to the existing token..."

# Check if the token already exists
if vault token lookup $VAULT_ROOT_TOKEN >/dev/null 2>&1; then
    echo "Token with ID $VAULT_ROOT_TOKEN already exists."
else
    echo "Assigning root-like policy to the token in env"
    vault token create -policy=root-policy -id=$VAULT_ROOT_TOKEN
fi

# Enable KV secrets engine if not enabled
if ! vault secrets list | grep -q "secret/"; then
  echo "Enabling KV secrets engine at 'secret' path..."
  vault secrets enable -path=secret kv
else
  echo "KV secrets engine is already enabled."
fi

# Function to store secrets only if they do not exist
store_secret_if_not_exists() {
  local path="$1"
  shift
  if ! vault kv get "$path" >/dev/null 2>&1; then
    echo "Storing $path secrets..."
    vault kv put "$path" "$@"
  else
    echo "Secrets for $path already exist, skipping..."
  fi
}

# Store secrets
store_secret_if_not_exists secret/data/mysecret username="example_user" password="example_password"
store_secret_if_not_exists secret/data/database POSTGRES_PASSWORD="example_password" \
  POSTGRES_USER="example_user" \
  POSTGRES_DB="example_db" \
  POSTGRES_PORT="5432"
store_secret_if_not_exists secret/data/login scope="email profile" \
  google_key='example_google_key' \
  google_secret='example_google_secret' \
  redirect_uri_google='https://example.com/auth/oauth/google' \
  grant_type="authorization_code" \
  token_url_intra="https://example.com/oauth/token" \
  oauth_url="https://example.com/oauth/authorize?client_id=example_client_id&redirect_uri=https%3A%2F%2Fexample.com%2Fauth%2Foauth%2F42&response_type=code" \
  client_id_intra="example_client_id" \
  client_secret_intra="example_client_secret" \
  redirect_uri_intra="https://example.com/auth/oauth/42" \
  grant_type_intra="authorization_code" \
  userinfo_url_intra="https://example.com/v2/me" \
  token_url_google="https://oauth2.googleapis.com/token" \
  userinfo_url_google="https://www.googleapis.com/oauth2/v2/userinfo"
store_secret_if_not_exists secret/data/settings DB_NAME="example_db" \
  DB_OWNER="example_owner" \
  PASSWORD="example_password" \
  HOST="database" \
  PORT="5432" \
  EMAIL_BACKEND='django.core.mail.backends.smtp.EmailBackend' \
  EMAIL_HOST='smtp.example.com' \
  EMAIL_PORT=587 \
  EMAIL_USE_TLS=true \
  EMAIL_HOST_USER='example@example.com' \
  EMAIL_HOST_PASSWORD='example_password' \
  API_URL="https://example.com/" \
  CRSF_URL="http://example.com"

# Keep Vault running
echo "Vault is now running."
wait
```

## Building the Project

To build the project, you can use the Makefile to set up either the production or development environment.

### Setting the Mode of the Project

You can set the mode of the project to either development or production by using the `MODE` environment variable. This variable determines which Docker Compose configuration file will be used.

By default, the `MODE` is set to `prod`, so all targets will execute with the production configuration. If the `MODE` is already set to `dev`, you can switch to production mode by running the following command:

```sh
make prod
```

To set, the `MODE` to `dev`. you could run the command:

```sh
make dev
```
this command will switch to dev mod in the project.

### Run the Project

To run the project, use the following command:
```sh
make
```

### Clean the Project

To clean the project, use the following command:
```sh
make clean
```
