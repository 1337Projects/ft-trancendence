#!/bin/bash

sleep 400

postgres psql -c "ALTER USER postgres WITH ENCRYPTED PASSWORD '$POSTGRES_PASSWORD';"

