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

from django.db import transaction
from django.db import IntegrityError
from django.db.models import Q
from rest_framework.views import APIView
from django.core.mail import EmailMessage
from rest_framework import generics, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist
from django.utils.encoding import force_bytes, force_str
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.tokens import default_token_generator
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from .models import CustomUser, FriendInvitation, Friendship, FOCUS_CATEGORIES
from .serializers import UserSerializer, FriendInvitationSerializer, FriendshipSerializer


# Utility functions
def encode_email(email_str):
    return f"{email_str[:3]}{'*'*(len(email_str)-6)}{email_str[-4:]}"


def send_activation_email(user, request):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    domain = request.get_host()
    locale = request.data.get('locale', 'en') if hasattr(request, 'data') else 'en'
    message = render_to_string(f'activation_email_{locale}.html', {
        'user': user,
        'domain': domain,
        'uid': uid,
        'token': token,
    })
    email = EmailMessage(
        'Tamado | Activate your account',
        message,
        'register@tamado.app',
        [user.email],
    )
    email.content_subtype = "html"
    email.send(fail_silently=False)


# Views
@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        send_activation_email(user, self.request)


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            if not user.email_verified:
                return Response({"message": "Email not verified", "email": f"{encode_email(user.email)}"}, status=status.HTTP_400_BAD_REQUEST)
            refresh = RefreshToken.for_user(user)
            user_data = UserSerializer(user).data
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': user_data
            }, status=status.HTTP_200_OK)
        return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        if not user.email_verified:
            message = "Email not verified"
            return Response({"message": message, "email": f"{encode_email(user.email)}"}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        user = self.get_object()
        focus = request.data.get('focus')
        if focus is not None:
            user.focus = focus
            user.save(update_fields=['focus'])
            return Response({'status': 'Focus updated successfully'}, status=status.HTTP_200_OK)
        return Response({'error': 'Focus parameter not provided'}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class ActivateView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token, *args, **kwargs):
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = get_object_or_404(CustomUser, pk=uid)
        if default_token_generator.check_token(user, token):
            user.email_verified = True
            user.save()
            return Response({"message": "Account activated"}, status=status.HTTP_200_OK)
        return Response({"message": "Invalid activation link"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class DeleteUserView(generics.DestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = request.user
        user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class ResendActivationEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        if not username:
            return Response({"message": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(CustomUser, username=username)

        send_activation_email(user, request)
        return Response({"message": "Activation email resent"}, status=status.HTTP_200_OK)


class SendFriendInvitationView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        receiver_username = request.data.get('receiver')
        if not receiver_username:
            return Response({'error': 'Invalid request: username required'}, status=status.HTTP_400_BAD_REQUEST)

        if receiver_username == request.user.username:
            return Response({'error': 'Cannot invite yourself'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            receiver = CustomUser.objects.get(username=receiver_username)
            invitation = FriendInvitation(sender=request.user, receiver=receiver)
            invitation.save()
            return Response({'status': 'Invitation sent'}, status=status.HTTP_201_CREATED)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Receiver not found'}, status=status.HTTP_404_NOT_FOUND)
        except IntegrityError:
            return Response({'error': 'Invitation already sent'}, status=status.HTTP_409_CONFLICT)


class ListFriendInvitationsView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        invitations = FriendInvitation.objects.filter(receiver=request.user, accepted=False)
        serializer = FriendInvitationSerializer(invitations, many=True)
        return Response(serializer.data)


class AcceptFriendInvitationView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request, invitation_id):
        invitation = FriendInvitation.objects.filter(id=invitation_id, receiver=request.user).first()
        if invitation:
            with transaction.atomic():
                Friendship.objects.create(user1=invitation.sender, user2=invitation.receiver)
                Friendship.objects.create(user1=invitation.receiver, user2=invitation.sender)
                invitation.delete()
            return Response({'status': 'friendship established'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid invitation'}, status=status.HTTP_404_NOT_FOUND)


class ListFriendsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    serializer_class = FriendshipSerializer

    def get_queryset(self):
        return Friendship.objects.filter(user1=self.request.user)


class UserFriendDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    serializer_class = FriendshipSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        user = self.request.user
        return Friendship.objects.filter(Q(user1=user) | Q(user2=user))

    def destroy(self, request, *args, **pk):
        friendship = self.get_object()

        if not friendship:
            return Response({'error': 'Friendship not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            with transaction.atomic():
                inverse_friendship = Friendship.objects.filter(user1=friendship.user2, user2=friendship.user1).first()
                friendship.delete()
                if inverse_friendship:
                    inverse_friendship.delete()

            return Response({'status': 'Friendship ended successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
