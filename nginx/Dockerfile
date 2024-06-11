FROM nginx:latest

COPY wait-for-build.sh /wait-for-build.sh

RUN mkdir -p /etc/ssl/certs && \
    apt-get update && \
    apt-get install -y ca-certificates && \
    update-ca-certificates --fresh && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN chmod +x /wait-for-build.sh
