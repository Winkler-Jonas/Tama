FROM nginx:latest

COPY wait-for-build.sh /wait-for-build.sh

RUN chmod +x /wait-for-build.sh && \ apt-get update && \ apt-get install -y ca-certificates && \ update-ca-certificates
