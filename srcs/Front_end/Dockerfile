FROM node:22-alpine

WORKDIR /app

COPY *.json .


EXPOSE 5173

COPY setup.sh .
RUN chmod +x setup.sh

CMD [ "sh", "setup.sh" ]