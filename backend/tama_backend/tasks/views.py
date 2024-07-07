from .models import Task
from datetime import datetime
from django.db.models import Q
from django.db import transaction
from .serializers import TaskSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from .permissions import IsOwnerOrIsCreating
from django.utils.timezone import make_aware
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().prefetch_related('instances')
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

        return queryset.prefetch_related('instances')

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

        instance = get_object_or_404(Task, pk=instance.pk)
        instance.instances.all()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def adjust_task_instances(self, task, new_start_date, new_end_date):
        task.instances.filter(Q(scheduled_date__lt=new_start_date) | Q(scheduled_date__gt=new_end_date)).delete()

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
        return super().create(request, *args, **kwargs)
