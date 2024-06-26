from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .permissions import IsOwnerOrIsCreating
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrIsCreating]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        """
        Restrict the returned tasks to a given month, if provided.
        """
        queryset = super().get_queryset()
        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')

        if month and year:
            try:
                month = int(month)  # 1 indexed !JAN IS NOT 0
                year = int(year)
                print(Task.objects.all())
                queryset = queryset.filter(start_date__year=year, start_date__month=month)
            except ValueError:
                return queryset.none()
        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.owner != request.user:
            return Response({'detail': 'You do not have permission to delete this task.'},
                            status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
