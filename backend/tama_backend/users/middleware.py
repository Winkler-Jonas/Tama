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
        print('did not find user')
        return AnonymousUser()

    try:
        decoded_data = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = decoded_data.get("user_id")
        from django.contrib.auth import get_user_model
        user = get_user_model().objects.get(id=user_id)
    except Exception as e:
        print(f'exception caught {e}')
        return AnonymousUser()

    return user


class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope["query_string"].decode())

        token = query_string.get("token", [None])[0]
        locale = query_string.get('locale', [None])[0]

        public_paths = ['/ws/check_username/', '/ws/check_email/']
        if scope['path'] in public_paths:
            scope["user"] = AnonymousUser()
        else:
            scope["user"] = await get_user(token) if token else AnonymousUser()
            scope['locale'] = locale

        return await super().__call__(scope, receive, send)


def TokenAuthMiddlewareStack(inner):
    return TokenAuthMiddleware(inner)