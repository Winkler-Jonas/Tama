from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Task

User = get_user_model()


class TaskSerializer(serializers.ModelSerializer):
    invited_users = serializers.PrimaryKeyRelatedField(
        many=True, queryset=User.objects.all(), required=False
    )

    class Meta:
        model = Task
        fields = [
            'id', 'owner', 'invited_users', 'description', 'start_date',
            'end_date', 'stroke', 'repeat', 'repeat_until', 'important',
            'done', 'daily', 'category'
        ]
        extra_kwargs = {
            'owner': {'read_only': True},
        }

    def validate_important(self, value):
        """
        Add custom validation to ensure 'important' is within a specific range, if necessary.
        """
        if not (0 <= value <= 10):  # Assuming 'important' is a score from 0 to 10
            raise serializers.ValidationError("Important must be between 0 and 10.")
        return value

    def validate_repeat(self, value):
        """
        Validate the 'repeat' field to ensure it only contains specific values if non-empty.
        """
        allowed_repeats = ['daily', 'weekly', 'monthly', 'yearly', 'never']
        if value not in allowed_repeats:
            raise serializers.ValidationError(f"Repeat must be one of: {', '.join(allowed_repeats)}.")
        return value

    def validate_category(self, value):
        """
        Ensure that the category is not empty if provided.
        """
        if value and len(value.strip()) == 0:
            raise serializers.ValidationError("Category cannot be empty.")
        return value

    def create(self, validated_data):
        """
        Custom creation logic, ensuring the owner is set to the current user.
        """
        request = self.context['request']
        print(f'Inside serializer request: {request}')
        validated_data['owner'] = request.user
        return super().create(validated_data)
