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

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async


class UsernameCheckConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    @database_sync_to_async
    def check_username_availability(self, username):
        from .models import CustomUser
        return not CustomUser.objects.filter(username=username).exists()

    async def receive(self, text_data):
        data = json.loads(text_data)
        username = data.get('username')
        if username:
            is_available = await self.check_username_availability(username)
            response = {
                'username': username,
                'is_available': is_available
            }
            await self.send(text_data=json.dumps(response))
        else:
            error_response = {
                'error': 'Invalid username'
            }
            await self.send(text_data=json.dumps(error_response))


class EmailCheckConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    @database_sync_to_async
    def check_email_availability(self, email):
        from .models import CustomUser
        return not CustomUser.objects.filter(email=email).exists()

    async def receive(self, text_data):
        data = json.loads(text_data)
        email = data['email']
        is_available = await self.check_email_availability(email)
        await self.send(text_data=json.dumps({
            'email': email,
            'is_available': is_available
        }))


class UserNameAutoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    @database_sync_to_async
    def find_username_starting_with(self, prefix):
        from .models import CustomUser
        user = CustomUser.objects.filter(username__startswith=prefix).first()
        if user:
            return user.username

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            username = data.get('username')
            if username:
                username_suffix = await self.find_username_starting_with(username)
                response = {
                    'message': username_suffix,
                }
                await self.send(text_data=json.dumps(response))
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({'error': 'Invalid JSON'}))
        except KeyError:
            await self.send(text_data=json.dumps({'error': 'Username key missing'}))
        except Exception as e:
            await self.send(text_data=json.dumps({'error': str(e)}))


class TokenConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    @database_sync_to_async
    def remove_token(self, user):
        if user:
            user.remove_token()
            return user.available_token

    @database_sync_to_async
    def get_available_token(self, user):
        return user.available_token if user else None

    @database_sync_to_async
    def get_token_used(self, user):
        return user.token if user else None

    @database_sync_to_async
    def get_tokens_required_for_next_level(self, user):
        return user.tokens_required_for_next_level() if user else None

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            user = self.scope['user']

            if not user.is_authenticated:
                await self.send(text_data=json.dumps({'error': 'Unauthorized'}))
                print('failed auth')
                return

            used_token = await self.get_token_used(user)
            next_level = await self.get_tokens_required_for_next_level(user)

            if data.get('action') == 'remove_token':
                remaining_token = await self.remove_token(user)
            else:
                remaining_token = await self.get_available_token(user)
            response = {
                'message': {
                    'available': remaining_token,
                    'used': used_token,
                    'level': next_level
                }
            }
            await self.send(text_data=json.dumps(response))
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({'error': 'Invalid JSON'}))
        except KeyError:
            await self.send(text_data=json.dumps({'error': 'Incorrect data provided'}))
        except Exception as e:
            await self.send(text_data=json.dumps({'error': str(e)}))