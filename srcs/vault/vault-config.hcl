storage "file" {
  path = "/vault/data"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 1
}

api_addr    = "http://0.0.0.0:8200"
cluster_addr = "http://0.0.0.0:8201"


disable_mlock = true
ui = true
