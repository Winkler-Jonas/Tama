from django.db import models


class Feedback(models.Model):
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback submitted on {self.created_at}"
