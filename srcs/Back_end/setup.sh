#!/bin/sh

source virtualenv/bin/activate

pip install --upgrade pip

pip install --no-cache-dir -r requirements.txt

pip install djangorestframework

python3 /app/ft_transcendence/manage.py makemigrations; \
python3 /app/ft_transcendence/manage.py migrate

python3 /app/ft_transcendence/manage.py runserver 0.0.0.0:8000