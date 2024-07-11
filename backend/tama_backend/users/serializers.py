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

from rest_framework import serializers
from .models import CustomUser, FriendInvitation, Friendship, FOCUS_CATEGORIES
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField()
    focus = serializers.ChoiceField(choices=FOCUS_CATEGORIES, allow_blank=True, required=False)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'email_verified', 'is_admin', 'last_run_date', 'focus',
                  'location', 'level', 'token']
        extra_kwargs = {
            'password': {'write_only': True},
            'email_verified': {'read_only': True},
            'last_run_date': {'read_only': True}
        }

    def get_is_admin(self, obj):
        return obj.is_staff or obj.is_superuser

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        db_to_ui_mapping = {db_value: ui_value for db_value, ui_value in FOCUS_CATEGORIES}
        if ret['focus']:
            ret['focus'] = db_to_ui_mapping.get(ret['focus'], ret['focus'])
        return ret

    def to_internal_value(self, data):
        ui_to_db_mapping = {ui_value: db_value for db_value, ui_value in FOCUS_CATEGORIES}
        focus_ui_value = data.get('focus')
        if focus_ui_value in ui_to_db_mapping:
            data['focus'] = ui_to_db_mapping[focus_ui_value]
        return super().to_internal_value(data)

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class FriendInvitationSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField(read_only=True)
    receiver = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = FriendInvitation
        fields = ['id', 'sender', 'receiver', 'created_at', 'accepted']


class FriendshipSerializer(serializers.ModelSerializer):
    user1 = serializers.StringRelatedField(read_only=True)
    user2 = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Friendship
        fields = ['id', 'user1', 'user2', 'created_at']
