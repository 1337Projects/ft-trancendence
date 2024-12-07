FROM node:latest

WORKDIR /app

COPY *.json .


EXPOSE 5173

COPY setup.sh .
RUN chmod +x setup.sh

CMD [ "sh", "setup.sh" ]