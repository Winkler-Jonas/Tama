# backend/tama_backend/Dockerfile
FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN mkdir -p /etc/ssl/certs && \
    apt-get update && \
    apt-get install -y \
        netcat-openbsd \
        ca-certificates \
        build-essential \
        libatlas-base-dev && \
    update-ca-certificates --fresh && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install torch torchvision torchaudio

RUN pip install -r requirements.txt

COPY . /app/

# Copy the wait-for-it script
COPY wait-for-db.sh /wait-for-db.sh

# Ensure the script is executable
RUN chmod +x /wait-for-db.sh

# Create the staticfiles directory
RUN mkdir -p /app/staticfiles

# Run migrations and collect static files before starting the server
CMD ["/wait-for-db.sh", "db:5432", "--", "sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py collectstatic --noinput && daphne -b 0.0.0.0 -p 8000 tama_backend.asgi:application"]
# CMD ["/wait-for-db.sh", "db:5432", "--", "sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py collectstatic --noinput && daphne -e ssl:port=443:privateKey=/etc/ssl/tamado.app.key.pem:certKey=/etc/ssl/tamado.app.cert.pem --http_timeout 600 tama_backend.asgi:application"]