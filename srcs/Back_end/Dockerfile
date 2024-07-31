FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python3", "/app/ft_transcendence/manage.py", "runserver", "0.0.0.0:8000"]


















# RUN apt-get update && apt-get install -y python3-pip python3-django

# RUN apt install python3.12-venv -y

# RUN apt-get install -y python3-pip

# RUN mkdir ft_transcendence

# WORKDIR /ft_transcendence/

# COPY ft_transcendence .

# # RUN /bin/bash -c "source /ft_transcendence/env/bin/activate"

# RUN apt-get update && apt-get install -y libpq-dev

# RUN python3 -m venv env; . env/bin/activate; pip install -r requirements.txt

# CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

