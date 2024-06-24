from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Task(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_tasks')
    invited_users = models.ManyToManyField(User, blank=True, related_name='invited_tasks')
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    stroke = models.BooleanField(default=False)
    repeat = models.BooleanField(default=False)
    important = models.BooleanField(default=False)
    done = models.BooleanField(default=False)
    daily = models.BooleanField(default=False)

    def __str__(self):
        return self.description
