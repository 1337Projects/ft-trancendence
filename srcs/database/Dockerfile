FROM debian:bullseye-slim

# Install necessary packages
RUN apt-get update && \
    apt-get install -y wget gnupg2 postgresql postgresql-contrib && \
    apt-get clean && \
    apt-get install -y jq curl  sudo && \
    rm -rf /var/lib/apt/lists/*

# Copy custom initialization script into the container
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh


# Make sure the script is executable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose PostgreSQL port
EXPOSE 5432

# Start PostgreSQL and run the custom initialization script
CMD ["bash", "-c", "/usr/local/bin/entrypoint.sh"]

