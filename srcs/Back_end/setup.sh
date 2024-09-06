#!/bin/sh

export DJANGO_SUPERUSER_USERNAME=ipman
export DJANGO_SUPERUSER_EMAIL=ipman@ipman.com
export DJANGO_SUPERUSER_PASSWORD=133742

python3 -m venv virtualenv

. virtualenv/bin/activate

#mel-harc
pip install --upgrade pip
pip install --no-cache-dir -r requirements.txt
pip install python-dotenv
pip install djangorestframework
pip install django-allauth
pip install requests
pip install pyjwt
pip install cryptography
pip install django-cors-headers
pip install requests
pip install djangorestframework-simplejwt

#khawla
pip install dj-rest-auth
pip install social-auth-app-django
pip install psycopg2-binary
pip install rest_social_auth
pip install django-oauth-toolkit
pip install python-social-auth
pip install django-rest-framework-social-oauth2
pip install channels

python3 /app/ft_transcendence/manage.py makemigrations login
python3 /app/ft_transcendence/manage.py makemigrations account
python3 /app/ft_transcendence/manage.py makemigrations chat
python /app/ft_transcendence/manage.py makemigrations --noinput
python3 /app/ft_transcendence/manage.py migrate
python3 /app/ft_transcendence/manage.py createsuperuser --noinput || true
python3 /app/ft_transcendence/manage.py runserver 0.0.0.0:8000