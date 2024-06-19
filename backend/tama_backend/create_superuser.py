import os
import django
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

username = os.getenv('DJANGO_ADMIN_USR')
email = os.getenv('DJANGO_ADMIN_MAIL')
password = os.getenv('DJANGO_ADMIN_PWD')

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print('Superuser created.')
else:
    print('Superuser already exists.')
