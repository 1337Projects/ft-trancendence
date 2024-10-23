#!/bin/sh

python3 /app/manage.py makemigrations
python3 /app/manage.py migrate

exec "$@"