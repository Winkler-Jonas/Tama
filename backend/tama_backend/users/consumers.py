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
        from .models import CustomUser  # Import here to delay the model loading
        return not CustomUser.objects.filter(username=username).exists()

    async def receive(self, text_data):
        data = json.loads(text_data)
        username = data['username']
        is_available = await self.check_username_availability(username)
        await self.send(text_data=json.dumps({
            'username': username,
            'is_available': is_available
        }))


class EmailCheckConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    @database_sync_to_async
    def check_email_availability(self, email):
        from .models import CustomUser  # Import here to delay the model loading
        return not CustomUser.objects.filter(email=email).exists()

    async def receive(self, text_data):
        data = json.loads(text_data)
        email = data['email']
        is_available = await self.check_email_availability(email)
        await self.send(text_data=json.dumps({
            'email': email,
            'is_available': is_available
        }))
