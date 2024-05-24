from django.urls import path
from .views import RegisterView, LoginView, UserDetailView, ActivateView, ResendActivationEmailView, DeleteUserView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', UserDetailView.as_view(), name='me'),
    path('delete/', DeleteUserView.as_view(), name='delete_user'),
    path('activate/<uidb64>/<token>/', ActivateView.as_view(), name='activate'),
    path('resend-activation/', ResendActivationEmailView.as_view(), name='resend_activation'),
]
