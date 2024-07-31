FROM python:3.10-slim

WORKDIR /app

COPY . .

RUN . virtualenv/bin/activate

RUN pip install --no-cache-dir -r requirements.txt


RUN chmod +x setup.sh

CMD [ "sh", "setup.sh" ]
