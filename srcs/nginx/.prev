# Use the official Nginx image as the base image
FROM nginx:1.27.0



RUN apt-get update && apt-get install -y openssl wget curl && rm -rf /var/lib/apt/lists/*




# Install necessary build tools and dependencies
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     git \
#     libpcre3 \
#     libpcre3-dev \
#     zlib1g-dev \
#     libssl-dev \
#     gnupg2 \
#     curl \
#     build-essential \
#     libtool \
#     automake \
#     autoconf \
#     pkg-config \
#     dpkg-dev \
#     ca-certificates \
#     apt-transport-https \
#     libatomic1 \
#     libxslt1-dev \
#     libgd-dev \
#     libgeoip-dev \
#     libperl-dev \
#     wget \
#     libxml2-dev \
#     libcurl4-openssl-dev \
#     libyajl-dev \
#     && rm -rf /var/lib/apt/lists/*

# Clone and build ModSecurity
# RUN cd /opt && \
#     git clone --depth 1 -b v3/master https://github.com/SpiderLabs/ModSecurity && \
#     cd ModSecurity && \
#     git submodule init && \
#     git submodule update && \
#     ./build.sh && \
#     ./configure && \
#     make && \
#     make install

# Clone the ModSecurity Nginx connector
# RUN cd /opt && \
#     git clone --depth 1 https://github.com/SpiderLabs/ModSecurity-nginx.git

# Build Nginx with ModSecurity
RUN cd /opt && \
    wget http://nginx.org/download/nginx-1.27.0.tar.gz && \
    tar -zxvf nginx-1.27.0.tar.gz

# RUN cd /opt/nginx-1.27.0 && \
#     ./configure --with-compat --add-dynamic-module=../ModSecurity-nginx

# RUN cd /opt/nginx-1.27.0 && \
#     make modules && \
#     cp objs/ngx_http_modsecurity_module.so /etc/nginx/modules

# Create necessary directories for ModSecurity configuration
# RUN mkdir -p /etc/modsecurity.d/ /etc/nginx/modsecurity

# Copy ModSecurity configuration
# COPY ./modsecurity.conf /etc/modsecurity.d/modsecurity.conf

# Clone OWASP CRS
# RUN git clone https://github.com/coreruleset/coreruleset /usr/local/modsecurity-crs

# Ensure the necessary permissions and folders exist for ModSecurity logs
RUN mkdir -p /var/log/nginx && \
chown -R nginx:nginx /var/log/nginx
# touch /var/log/nginx/modsec_audit.log && \

# COPY crs-setup.conf /etc/nginx/modsecurity-crs/crs-setup.conf

# Create a directory for SSL certificates
RUN mkdir -p /etc/nginx/ssl

# Generate a self-signed SSL certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/privkey.pem \
    -out /etc/nginx/ssl/fullchain.pem \
    -subj "/C=US/ST=CA/L=San Francisco/O=NGINX/OU=IT Department/CN=localhost"

# Set up ModSecurity rules and configuration
# RUN ln -s /usr/local/modsecurity-crs /etc/nginx/modsecurity-crs && \
#     ln -s /etc/nginx/modsecurity-crs/crs-setup.conf /etc/modsecurity.d/ && \
#     ln -s /etc/modsecurity.d/modsecurity.conf /etc/nginx/modsecurity/modsecurity.conf

# Copy your custom Nginx and crs configuration
COPY nginx.conf /etc/nginx/nginx.conf


# Copy entry point script
COPY ./entry-point.sh /usr/local/bin/


# Set entry point
# RUN [ "chmod",  "+x", "/usr/local/bin/entry-point.sh" ]

# RUN ls -l /etc/nginx/modules/ngx_http_modsecurity_module.so

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

# Expose HTTP and HTTPS ports
EXPOSE 80 443
