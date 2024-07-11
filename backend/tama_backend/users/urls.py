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

from django.urls import path
from .views import RegisterView, LoginView, UserDetailView, ActivateView, ResendActivationEmailView, DeleteUserView, UserFriendDetailView, ListFriendsView, AcceptFriendInvitationView, ListFriendInvitationsView, SendFriendInvitationView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', UserDetailView.as_view(), name='me'),
    path('delete/', DeleteUserView.as_view(), name='delete_user'),
    path('activate/<uidb64>/<token>/', ActivateView.as_view(), name='activate'),
    path('resend-activation/', ResendActivationEmailView.as_view(), name='resend_activation'),
    path('friends/', ListFriendsView.as_view(), name='user_friends'),
    path('friends/<int:pk>/', UserFriendDetailView.as_view(), name='specific_user_friend'),
    path('accept-invite/<int:invitation_id>/', AcceptFriendInvitationView.as_view(), name='accept_invite'),
    path('invites/', ListFriendInvitationsView.as_view(), name='invites'),
    path('send-invite/', SendFriendInvitationView.as_view(), name='send_invite'),
]
