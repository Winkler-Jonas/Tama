#
# This file is part of Project-Tamado.
#
# Copyright (c) 2024 Jonas Winkler
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

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

RUN pip install -r requirements.txt

COPY . /app/

# Copy the wait-for-it script
COPY wait-for-db.sh /wait-for-db.sh
COPY create_superuser.py /app/create_superuser.py

# Ensure the script is executable
RUN chmod +x /wait-for-db.sh

# Create the staticfiles directory
RUN mkdir -p /app/staticfiles

# Run migrations and collect static files before starting the server
CMD ["/wait-for-db.sh", "db:5432", "--", "sh", "-c", "python manage.py makemigrations && python manage.py migrate && python create_superuser.py && python manage.py collectstatic --noinput && daphne -b 0.0.0.0 -p 8000 tama_backend.asgi:application"]
