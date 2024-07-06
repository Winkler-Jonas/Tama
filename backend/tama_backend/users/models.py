from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    email_verified = models.BooleanField(default=False)

    last_run_date = models.DateField(null=True, blank=True)

    def update_run_date(self, date):
        self.last_run_date = date
        self.save()
