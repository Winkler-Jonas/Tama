from django.http import HttpResponseRedirect
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from urllib.parse import parse_qs
from django.conf import settings
import logging
import jwt

logger = logging.getLogger(__name__)


'''
REST
'''


class CustomHeaderMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/api/'):
            custom_header = request.META.get('HTTP_X_CUSTOM_HEADER')

            if custom_header != settings.CUSTOM_HEADER_VALUE:
                logger.warning(f"Forbidden access attempt: Custom header {custom_header} not allowed")
                return HttpResponseRedirect('/404Error')

        return self.get_response(request)


'''
WSS
'''


@database_sync_to_async
def get_user(token):
    try:
        UntypedToken(token)
    except (InvalidToken, TokenError):
        return AnonymousUser()

    try:
        decoded_data = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = decoded_data.get("user_id")
        from django.contrib.auth import get_user_model  # Import here
        user = get_user_model().objects.get(id=user_id)
    except Exception:
        return AnonymousUser()

    return user


class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope["query_string"].decode())
        token = query_string.get("token", [None])[0]

        # Allow public access to these paths without a token
        public_paths = ['/ws/check_username/', '/ws/check_email/']
        if scope['path'] in public_paths:
            scope["user"] = AnonymousUser()
        else:
            scope["user"] = await get_user(token) if token else AnonymousUser()

        return await super().__call__(scope, receive, send)


def TokenAuthMiddlewareStack(inner):
    return TokenAuthMiddleware(inner)