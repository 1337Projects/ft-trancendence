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
  if [ ! -f /vault/file/unseal_key.txt ]; then
    echo "Error: Unseal keys file is missing!"
    echo '----------------------------------------------------Unseal key file is missing---------------'
    exit 1
  fi
else
  echo "Initializing Vault..."
  echo '----------------------------------------------------VAULT INITIALISATION start ---------------'
  vault operator init -key-shares=1 -key-threshold=1 > /vault/init-output.txt
  echo "Vault initialized. Keys are stored in /vault/init-output.txt"

  # Save unseal keys to /vault/file/unseal_key.txt
  grep 'Unseal Key' /vault/init-output.txt | cut -d ':' -f 2 | xargs -n1 > /vault/file/unseal_key.txt
  grep 'Initial Root Token' /vault/init-output.txt | cut -d ':' -f 2 | xargs > /vault/file/root_token.txt
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
store_secret_if_not_exists secret/data/mysecret username="myuser" password="mypassword"
store_secret_if_not_exists secret/data/database POSTGRES_PASSWORD="133742" \
  POSTGRES_USER="ipman" \
  POSTGRES_DB="ft_transcendence" \
  POSTGRES_PORT="5432"
store_secret_if_not_exists secret/data/login scope="email profile" \
  google_key='939461351021-ru3eqql8sgakc3unrce3s9n0bmlpln3g.apps.googleusercontent.com' \
  google_secret='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' \
  redirect_uri_google='https://localhost:1024/auth/oauth/google' \
  grant_type="authorization_code" \
  token_url_intra="https://api.intra.42.fr/oauth/token" \
  oauth_url="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-d13c3ff37f755b7f823cb3bef695747e2db412aea0d484a5b1ebec3aa4d34d6a&redirect_uri=https%3A%2F%2Flocalhost%3A1024%2Fauth%2Foauth%2F42&response_type=code" \
  client_id_intra="u-s4t2ud-d13c3ff37f755b7f823cb3bef695747e2db412aea0d484a5b1ebec3aa4d34d6a" \
  client_secret_intra="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" \
  redirect_uri_intra="https://localhost:1024/auth/oauth/42" \
  grant_type_intra="authorization_code" \
  userinfo_url_intra="https://api.intra.42.fr/v2/me" \
  token_url_google="https://oauth2.googleapis.com/token" \
  userinfo_url_google="https://www.googleapis.com/oauth2/v2/userinfo"
store_secret_if_not_exists secret/data/settings DB_NAME="ft_transcendence" \
  DB_OWNER="ipman" \
  PASSWORD="133742" \
  HOST="database" \
  PORT="5432" \
  EMAIL_BACKEND='django.core.mail.backends.smtp.EmailBackend' \
  EMAIL_HOST='smtp.gmail.com' \
  EMAIL_PORT=587 \
  EMAIL_USE_TLS=true \
  EMAIL_HOST_USER='benhammoukhawla99@gmail.com' \
  EMAIL_HOST_PASSWORD='uqii arug mngk vbzk' \
  API_URL="https://localhost:1024/" \
  CRSF_URL="http://localhost:5173"


# Keep Vault running
echo "Vault is now running."
wait
