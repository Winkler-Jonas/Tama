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

from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.db import models


FOCUS_CATEGORIES = [
    ('sport', 'sport'),
    ('foodDiet', 'diet'),
    ('digitalDetox', 'digitalDetox'),
    ('friends', 'Friends'),
    ('mentalHealth', 'mentalHealth'),
    ('education', 'education'),
    ('spareTimeHobbies', 'hobbies'),
    ('savingMoney', 'finance'),
]


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    email_verified = models.BooleanField(default=False)
    last_run_date = models.DateField(null=True, blank=True)
    focus = models.CharField(max_length=30, choices=FOCUS_CATEGORIES, blank=True, null=True)
    location = models.CharField(max_length=100, null=True, blank=True)
    level = models.IntegerField(default=0)
    token = models.IntegerField(default=0)
    available_token = models.IntegerField(default=0)

    def update_run_date(self, date):
        self.last_run_date = date
        self.save()

    def remove_token(self):
        if self.available_token > 0:
            self.available_token -= 1
            self.save()

    def get_available_token(self):
        return self.available_token

    def add_token(self):
        self.available_token += 1
        self.token += 1
        self.save()

        if self.token >= self.tokens_required_for_next_level():
            self.increase_level()

    def increase_level(self):
        self.level += 1
        self.token = 0
        self.save()

    def tokens_required_for_next_level(self):
        return 100 + 200 * self.level

    def __str__(self):
        return self.username


class FriendInvitation(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="sent_invitations", on_delete=models.CASCADE)
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="received_invitations", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    accepted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender} to {self.receiver} - {'Accepted' if self.accepted else 'Pending'}"

    class Meta:
        unique_together = ('sender', 'receiver')


class Friendship(models.Model):
    user1 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="friendships", on_delete=models.CASCADE)
    user2 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="+", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user1} and {self.user2} are friends"

    class Meta:
        unique_together = ('user1', 'user2')
