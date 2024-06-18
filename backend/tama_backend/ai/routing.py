from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/askAI/(?P<locale>\w+)/$', consumers.AskAIConsumer.as_asgi()),
    re_path(r'ws/focusUP/(?P<locale>\w+)/$', consumers.FocusUpConsumer.as_asgi())
]