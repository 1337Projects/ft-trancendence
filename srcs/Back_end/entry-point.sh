#!/bin/sh

# # echo "PATH: $PATH"
# # echo "Which psql: $(which psql)"
# # echo "Which pg_isready: $(which pg_isready)"

# # Wait for PostgreSQL to be ready
# # until psql -h db -p 5432 -U user -c '\q'; do
# #   echo "Waiting for database..."
# #   sleep 2
# # done

# until nc -z -v -w30 db 5432; do
#   echo "Waiting for database..."
#   sleep 2
# done

# # Run Django migrations
# python3 /app/manage.py makemigrations login account chat tournment notifications game game_api background_task
# python3 /app/manage.py migrate --noinput

# # Start background tasks if any
# nohup python3 /app/manage.py process_tasks &

# # Start Django server
# exec "$@"


/usr/local/bin/wait-for-it.sh database:5432 --timeout=50 --strict -- echo "database is ready!"

python3 /app/manage.py makemigrations login account chat tournment notifications game background_task
python3 /app/manage.py migrate --noinput
nohup python3 /app/manage.py process_tasks &
exec "$@"