# backend/tama_backend/Dockerfile
FROM python:3.12

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . /app/

# Create the staticfiles directory
RUN mkdir -p /app/staticfiles

# Run migrations and collect static files before starting the server
CMD ["sh", "-c", "python manage.py migrate && python manage.py collectstatic --noinput && daphne -b 0.0.0.0 -p 8000 tama_backend.asgi:application"]
