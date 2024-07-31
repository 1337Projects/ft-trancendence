FROM python:3.10-slim

WORKDIR /app

COPY . .

RUN . virtualenv/bin/activate

RUN pip install --no-cache-dir -r requirements.txt

RUN python3 /app/ft_transcendence/manage.py makemigrations; python3 /app/ft_transcendence/manage.py migrate

CMD ["python3", "/app/ft_transcendence/manage.py", "runserver", "0.0.0.0:8000"]