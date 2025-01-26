FROM vault:1.13.2

# Install necessary tools
RUN apk add --no-cache jq curl

# Copy Vault configuration and initialization script
# COPY vault-init.sh /vault/vault-init.sh
COPY vault-config.hcl /vault/config.hcl

# Make the script executable
# RUN chmod +x /vault/vault-init.sh

RUN mkdir -p /vault/data && chmod -R 777 /vault/data



# Expose Vault's API port
EXPOSE 8200

# # Use an entrypoint script to start Vault
# ENTRYPOINT ["/bin/sh", "/vault/vault-init.sh"]

# Copy the custom entrypoint script
COPY vault-init.sh /usr/local/bin/

COPY secret-policy.hcl /usr/local/bin/

RUN chmod +x /usr/local/bin/vault-init.sh

RUN chmod +x /usr/local/bin/secret-policy.hcl

# Override the default entrypoint
ENTRYPOINT ["/usr/local/bin/vault-init.sh"]
