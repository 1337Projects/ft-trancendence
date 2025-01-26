FROM vault:1.13.2

RUN apk add --no-cache jq curl

COPY vault-config.hcl /vault/config.hcl

RUN mkdir -p /vault/data && chmod -R 777 /vault/data

EXPOSE 8200

COPY vault-init.sh /usr/local/bin/

COPY secret-policy.hcl /usr/local/bin/

RUN chmod +x /usr/local/bin/vault-init.sh

RUN chmod +x /usr/local/bin/secret-policy.hcl

ENTRYPOINT ["/usr/local/bin/vault-init.sh"]
