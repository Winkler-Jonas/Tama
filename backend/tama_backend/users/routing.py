from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/check_username/', consumers.UsernameCheckConsumer.as_asgi()),
    path('ws/check_email/', consumers.EmailCheckConsumer.as_asgi()),
]