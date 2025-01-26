storage "file" {
  path = "/vault/data"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 1  # Set to 0 if using TLS with proper certificates
}

api_addr    = "http://0.0.0.0:8200"
cluster_addr = "http://0.0.0.0:8201"


disable_mlock = true  # Needed when running inside a container
ui = true  # Enables the Vault Web UI
