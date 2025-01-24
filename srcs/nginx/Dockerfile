# Use the prebuilt OWASP ModSecurity CRS image
FROM owasp/modsecurity-crs:4.10.0-nginx-202501050801

WORKDIR /app

# COPY . .
# Copy custom ModSecurity configuration (optional)
COPY modsecurity.conf /etc/modsecurity/modsecurity.conf

# Copy custom CRS setup configuration (optional)
COPY crs-setup.conf /etc/modsecurity.d/crs-setup.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/nginx.conf
# Generate a self-signed SSL certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /app/prv_certificate.crt \
    -out /app/certificate.crt \
    -subj "/CN=localhost"
# Expose the default HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
