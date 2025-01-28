FROM debian:bullseye-slim

RUN apt-get update && \
    apt-get install -y wget gnupg2 postgresql postgresql-contrib && \
    apt-get clean && \
    apt-get install -y jq curl  sudo && \
    rm -rf /var/lib/apt/lists/*

COPY entrypoint.sh /usr/local/bin/entrypoint.sh

COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh

RUN chmod +x /usr/local/bin/wait-for-it.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 5432

CMD ["bash", "-c", "/usr/local/bin/entrypoint.sh"]

