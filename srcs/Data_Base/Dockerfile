FROM debian:latest

RUN apt-get update -y && \
    apt-get install -y postgresql postgresql-contrib libpq-dev

RUN apt-get install sudo -y

RUN mkdir -p /var/lib/postgresql/data

COPY conf/postgresql.conf /etc/postgresql/14/main/postgresql.conf

COPY /tools/seetings.sh / 

RUN chmod +x /seetings.sh

CMD [ "./seetings.sh" ]