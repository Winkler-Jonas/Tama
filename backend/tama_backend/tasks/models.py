from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

User = get_user_model()

REPEAT_CHOICES = [
    ('never', 'Never'),
    ('daily', 'Daily'),
    ('weekly', 'Weekly'),
    ('monthly', 'Monthly')
]

TASK_STATES = [
    ('done', 'Done'),
    ('cancelled', 'Cancelled'),
    ('inProgress', 'InProgress')
]


class Task(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_tasks')
    invited_users = models.ManyToManyField(User, blank=True, related_name='invited_tasks')
    description = models.TextField()
    start_date = models.DateField(db_index=True)
    end_date = models.DateField(db_index=True)
    repeat = models.CharField(max_length=10, choices=REPEAT_CHOICES, blank=True, null=True)
    important = models.IntegerField()
    daily = models.BooleanField(default=False, help_text="True for AI-Generated tasks only")
    category = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.description

    def clean(self):
        if self.repeat and self.end_date and self.end_date <= self.start_date:
            raise ValidationError(_('For repeating tasks, end_date must be after start_date.'))
        if not self.repeat and self.end_date and self.end_date < self.start_date:
            raise ValidationError(_('For non-repeating tasks, end_date must be on or after start_date.'))


class TaskInstance(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='task_instances')
    scheduled_date = models.DateField(db_index=True)
    status = models.CharField(max_length=10, choices=TASK_STATES, default='inProgress')

    def __str__(self):
        return f"{self.task.description} - {self.scheduled_date}"
