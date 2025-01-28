#!/bin/sh

/usr/local/bin/wait-for-it.sh database:5432 --timeout=50 --strict -- echo "database is ready!"
python3 /app/manage.py makemigrations login account chat tournment notifications game background_task
python3 /app/manage.py migrate --noinput
nohup python3 /app/manage.py process_tasks &
exec "$@"