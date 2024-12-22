#!/bin/sh

python3 /app/manage.py makemigrations login account chat tournment notifications game game_api background_task
python3 /app/manage.py migrate --noinput
nohup python3 /app/manage.py process_tasks &
exec "$@"