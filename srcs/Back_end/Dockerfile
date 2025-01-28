# Dockerfile.debug
FROM python:3.9-slim

RUN apt-get update && apt-get install -y curl wget netcat-traditional

WORKDIR /app

COPY ./ft_transcendence/requirements.txt .

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

# Install ptvsd for debugging
RUN pip install ptvsd

COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh

RUN chmod +x /usr/local/bin/wait-for-it.sh


COPY ./ft_transcendence .


EXPOSE 5678

COPY ./entry-point.sh /usr/local/bin/

RUN [ "chmod",  "+x", "/usr/local/bin/entry-point.sh" ]

ENTRYPOINT [ "entry-point.sh" ]


CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]