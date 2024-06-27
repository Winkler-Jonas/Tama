from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class DailyTask(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_daily_tasks')
    description = models.TextField()
    start_date = models.DateField(auto_now_add=True)  # Auto-set the date when created

    def __str__(self):
        return self.description
