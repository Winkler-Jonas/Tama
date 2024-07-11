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

from .models import Task
from datetime import datetime
from django.db.models import Q
from django.db import transaction
from .serializers import TaskSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from .permissions import IsOwnerOrIsCreating
from django.utils.timezone import make_aware
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().prefetch_related('task_instances')
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrIsCreating]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        user = self.request.user
        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')

        if month and year:
            month = int(month)
            year = int(year)
            start_date = make_aware(datetime(year, month, 1))
            if month == 12:
                end_date = make_aware(datetime(year + 1, 1, 1))
            else:
                end_date = make_aware(datetime(year, month + 1, 1))

            queryset = Task.objects.filter(owner=user).filter(Q(start_date__lte=end_date) & Q(end_date__gte=start_date))
        else:
            queryset = Task.objects.filter(owner=user)

        return queryset.prefetch_related('task_instances')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        new_start_date = serializer.validated_data.get('start_date', instance.start_date)
        new_end_date = serializer.validated_data.get('end_date', instance.end_date)

        if new_start_date != instance.start_date or new_end_date != instance.end_date:
            self.adjust_task_instances(instance, new_start_date, new_end_date)

        instance = serializer.save()
        return Response(serializer.data)

    def adjust_task_instances(self, task, new_start_date, new_end_date):
        task.task_instances.filter(Q(scheduled_date__lt=new_start_date) | Q(scheduled_date__gt=new_end_date)).delete()

    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.owner != request.user:
            return Response({'detail': 'You do not have permission to delete this task.'},
                            status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
