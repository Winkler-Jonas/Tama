from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    email_verified = models.BooleanField(default=False)


class Task(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
