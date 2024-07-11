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

from datetime import timedelta
from django.db import transaction
from django.utils.timezone import now
from rest_framework import serializers
import dateutil.relativedelta as relativedelta
from django.contrib.auth import get_user_model
from .models import Task, TaskInstance, REPEAT_CHOICES


User = get_user_model()


class TaskInstanceSerializer(serializers.ModelSerializer):
    completion_date = serializers.DateField(read_only=True)

    class Meta:
        model = TaskInstance
        fields = ['task', 'scheduled_date', 'status', 'completion_date']

    def validate_status(self, value):
        if value == 'done' and self.instance and self.instance.completion_date:
            return self.instance.status
        return value

    def create(self, validated_data):
        with transaction.atomic():
            task = validated_data.pop('task', None) or self.context.get('task')
            status = validated_data.get('status')

            instance = TaskInstance.objects.create(task=task, **validated_data)

            print(f'status -> {status}')
            print(f'cmp-task -> {instance.completion_date}')

            if status == 'done' and instance.completion_date is None:
                print('created')
                instance.completion_date = now()
                instance.save()
                self.handle_first_time_completion(instance.task.owner)

            return instance

    def update(self, instance, validated_data):
        with transaction.atomic():
            current_status = instance.status
            instance = super().update(instance, validated_data)
            new_status = validated_data.get('status', current_status)

            print('new status')
            print(new_status)
            print(instance.completion_date)

            if new_status == 'done' and instance.completion_date is None:
                instance.completion_date = now()
                instance.save()
                self.handle_first_time_completion(instance.task.owner)

            return instance

    def handle_first_time_completion(self, user):
        if user:
            user.add_token()


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
        return {ti.scheduled_date.strftime('%Y-%m-%d'): ti.status for ti in obj.task_instances.all()}

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['task_instances'] = self.get_task_instances(instance)
        return ret

    def validate_important(self, value):
        if not (0 <= value <= 10):
            raise serializers.ValidationError("Important must be between 0 and 10.")
        return value

    def validate_repeat(self, value):
        allowed_repeats = [choice[0] for choice in REPEAT_CHOICES]
        if value not in allowed_repeats:
            raise serializers.ValidationError(f"Repeat must be one of: {', '.join(allowed_repeats)}.")
        return value

    def validate_category(self, value):
        if value and not value.strip():
            raise serializers.ValidationError("Category cannot be empty.")
        return value

    def create_task_instances(self, task, validated_data, context=None):
        if context is None:
            context = self.context

        context['task'] = task

        start_date = validated_data['start_date']
        end_date = validated_data['end_date']
        repeat = validated_data.get('repeat', 'never')
        daily = validated_data.get('daily', False)

        status = 'done' if daily else 'inProgress'

        if repeat == 'never':
            instance_data = {'scheduled_date': start_date, 'status': status}
            task_instance_serializer = TaskInstanceSerializer(data={**instance_data, 'task': task.id}, context={'task': task, **context})
            if task_instance_serializer.is_valid(raise_exception=True):
                task_instance_serializer.save(task=task)

            if start_date != end_date:
                instance_data = {'scheduled_date': end_date, 'status': status}
                task_instance_serializer = TaskInstanceSerializer(data={**instance_data, 'task': task.id}, context={'task': task, **context})
                if task_instance_serializer.is_valid(raise_exception=True):
                    task_instance_serializer.save(task=task)
        else:
            self.create_repeating_task_instances(task, start_date, end_date, repeat, status, context)

    def create_repeating_task_instances(self, task, start_date, end_date, repeat, status, context):
        if repeat == 'daily':
            delta = timedelta(days=1)
        elif repeat == 'weekly':
            delta = timedelta(weeks=1)
        elif repeat == 'monthly':
            delta = relativedelta.relativedelta(months=1)
        else:
            delta = None

        current_date = start_date
        while current_date <= end_date:
            instance_data = {'scheduled_date': current_date, 'status': status}
            task_instance_serializer = TaskInstanceSerializer(data={**instance_data, 'task': task.id}, context={'task': task, **context})
            if task_instance_serializer.is_valid(raise_exception=True):
                task_instance_serializer.save(data={**instance_data, 'task': task.id}, context={'task': task, **context})
            current_date += delta

    def update(self, instance, validated_data):
        invited_users = validated_data.pop('invited_users', None)
        if invited_users is not None:
            instance.invited_users.set(invited_users)
        task_instances_data = self.context['request'].data.get('task_instances', {})
        current_instances = {ti.scheduled_date.strftime('%Y-%m-%d'): ti for ti in instance.task_instances.all()}

        for date_str, status in task_instances_data.items():
            task_instance = current_instances.get(date_str)
            if task_instance:
                if instance.repeat == 'never' and len(current_instances) > 1:
                    for t_instance in [current_instances.get(x.strftime('%Y-%m-%d')) for x in [instance.start_date, instance.end_date]]:
                        t_instance.status = status
                        t_instance.save()
                    break
                elif task_instance.status != status:
                    task_instance.status = status
                    task_instance.save()
                    break
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

    def create(self, validated_data):
        invited_users = validated_data.pop('invited_users', [])
        task = Task.objects.create(**validated_data)
        task.invited_users.set(invited_users)

        context = {'task': task, 'request': self.context.get('request')}
        self.create_task_instances(task, validated_data, context=context)
        return task
