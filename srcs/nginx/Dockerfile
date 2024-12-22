# Use the official Nginx image as the base image
FROM nginx:latest

# Install OpenSSL and curl to download wait-for-it script
RUN apt-get update && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*

# Download wait-for-it script to make Nginx wait for backend to be ready
RUN curl -sS https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -o /wait-for-it.sh && \
    chmod +x /wait-for-it.sh

# Create a directory for SSL certificates
RUN mkdir -p /etc/nginx/ssl

# Generate a self-signed SSL certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/privkey.pem \
    -out /etc/nginx/ssl/fullchain.pem \
    -subj "/C=US/ST=CA/L=San Francisco/O=NGINX/OU=IT Department/CN=localhost"

# Copy your custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

#Add debugging tools to your containers
RUN apt-get update && apt-get install -y curl net-tools


# Use wait-for-it to wait for backend service
COPY ./entry-point.sh /usr/local/bin/

RUN [ "chmod",  "+x", "/usr/local/bin/entry-point.sh" ]

ENTRYPOINT [ "entry-point.sh" ]

CMD [ "nginx", "-g", "daemon off" ]

EXPOSE 80 443
