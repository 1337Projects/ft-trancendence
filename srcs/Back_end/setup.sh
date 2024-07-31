#!/bin/sh

. virtualenv/bin/activate

python3 /app/ft_transcendence/manage.py makemigrations; \
python3 /app/ft_transcendence/manage.py migrate


python3 /app/ft_transcendence/manage.py runserver 0.0.0.0:8000