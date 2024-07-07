from rest_framework import serializers
from django.contrib.auth import get_user_model
from datetime import timedelta, datetime
import dateutil.relativedelta as relativedelta
from .models import Task, TaskInstance, REPEAT_CHOICES

User = get_user_model()


class TaskInstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskInstance
        fields = ['id', 'scheduled_date', 'status']

    def validate_scheduled_date(self, value):
        task = self.context['task']
        if value < task.start_date or value > task.end_date:
            raise serializers.ValidationError("Scheduled date is outside the task's date range.")
        return value


class TaskSerializer(serializers.ModelSerializer):
    invited_users = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all(),
        required=False
    )
    task_instances = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = ['id', 'owner', 'invited_users', 'description', 'start_date', 'end_date', 'repeat', 'important', 'daily', 'category', 'task_instances']
        extra_kwargs = {
            'owner': {'read_only': True},
        }

    def get_task_instances(self, obj):
        request = self.context.get('request', None)
        if request:
            month = request.query_params.get('month', None)
            year = request.query_params.get('year', None)
            if month and year:
                try:
                    month = int(month)
                    year = int(year)
                    start_date = datetime(year, month, 1)
                    end_date = datetime(year, month + 1, 1) if month < 12 else datetime(year + 1, 1, 1)
                    instances = obj.instances.filter(scheduled_date__range=(start_date, end_date))
                except ValueError:
                    return {"error": "Invalid month or year format."}
            else:
                instances = obj.instances.all()
        else:
            instances = obj.instances.all()

        return {instance.scheduled_date.strftime('%Y-%m-%d'): instance.status for instance in instances}

    def validate_important(self, value):
        """
        Ensures 'important' is within a specific range.
        """
        if not (0 <= value <= 10):
            raise serializers.ValidationError("Important must be between 0 and 10.")
        return value

    def validate_repeat(self, value):
        """
        Ensures 'repeat' field contains valid values.
        """
        allowed_repeats = [choice[0] for choice in REPEAT_CHOICES]
        if value not in allowed_repeats:
            raise serializers.ValidationError(f"Repeat must be one of: {', '.join(allowed_repeats)}.")
        return value

    def validate_category(self, value):
        """
        Ensures that the category is not empty if provided.
        """
        if value and not value.strip():
            raise serializers.ValidationError("Category cannot be empty.")
        return value

    def create_task_instances(self, task, validated_data):
        start_date = validated_data['start_date']
        end_date = validated_data['end_date']
        repeat = validated_data.get('repeat', 'never')
        year_limit = start_date.year

        if repeat == 'daily' or repeat == 'never':
            delta = timedelta(days=1)
        elif repeat == 'weekly':
            delta = timedelta(weeks=1)
        elif repeat == 'monthly':
            delta = relativedelta.relativedelta(months=1)
        else:
            delta = None

        current_date = start_date
        while current_date <= end_date and current_date.year == year_limit:
            TaskInstance.objects.create(
                task=task,
                scheduled_date=current_date,
                status='inProgress'
            )
            current_date += delta
            if current_date.year != year_limit:
                break

    def update(self, instance, validated_data):
        instances_data = validated_data.pop('task_instances', [])
        super().update(instance, validated_data)
        for instance_data in instances_data:
            instance_id = instance_data.get('id')
            if instance_id:
                task_instance = TaskInstance.objects.get(id=instance_id, task=instance)
                for key, value in instance_data.items():
                    setattr(task_instance, key, value)
                task_instance.save()
            else:
                TaskInstance.objects.create(task=instance, **instance_data)
        return instance

    def create(self, validated_data):
        task = super().create(validated_data)
        self.create_task_instances(task, validated_data)
        task.refresh_from_db()
        task.instances.all()
        return task
