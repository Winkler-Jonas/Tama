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

from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from datetime import datetime, timedelta
from asgiref.sync import sync_to_async
from django.utils.timezone import now
import google.generativeai as genai
from .models import DailyTask
from tasks.models import Task
from django.conf import settings
from datetime import datetime
from decouple import config
import regex as re
import traceback
import logging
import pytz
import json

logger = logging.getLogger(__name__)

response_pattern = re.compile(r"(\d\.\s)?(?P<issue>.+)$", re.MULTILINE)
response_focus = re.compile(r"\"(?P<focus>.+?)\"", re.DOTALL | re.MULTILINE)
response_daily = re.compile(r'^\d+\.?\s?(?P<daily>.+)$', re.MULTILINE)

# Configure the AI model
genai.configure(api_key=config('DJANGO_GEMINI_AI_KEY'))

generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 200,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    generation_config=generation_config,
)


class FocusUpConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.locale = self.scope['locale']
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            user_question = text_data_json['task']
            modified_question = await self.modify_input(user_question)
            response = await self.ask_google_gemini(modified_question)
            await self.send(text_data=json.dumps({'message': response.strip("\'*\" \n")}))
        except json.JSONDecodeError:
            # frontend error
            await self.send(text_data=json.dumps({'error': 'Invalid JSON format.'}))
        except ValueError as e:
            # user error / frontend error
            await self.send(text_data=json.dumps({'error': str(e)}))
        except Exception as e:
            # who knows
            await self.send(text_data=json.dumps({'error': 'An unexpected error occurred.'}))

    @sync_to_async
    def modify_input(self, input_text):
        if not input_text.strip():
            raise ValueError("Input text is empty.")

        return (f"I need to focus on a task. "
                f"Can you provide me an inspiring sentence for me to focus on my task."
                f"The sentence must not be longer that 10 words."
                f"The answer must not contain text highlighting."
                f"Answer in this language [{self.locale}]. "
                f"This is what I want to focus on: [{input_text}]")

    @sync_to_async
    def ask_google_gemini(self, input_text):
        try:
            chat_session = model.start_chat(history=[])
            response = chat_session.send_message(input_text)
            return response.text
        except Exception as e:
            raise ValueError("Gemini-Error")


class AskAIConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.locale = self.scope['locale']
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            user_question = text_data_json['question']
            modified_question = await self.modify_input(user_question)
            response = await self.ask_google_gemini(modified_question)
            final_response = self.process_response(response)
            await self.send(text_data=json.dumps({'message': final_response}))
        except json.JSONDecodeError:
            # frontend error
            await self.send(text_data=json.dumps({'error': 'Invalid JSON format.'}))
        except ValueError as e:
            # user error / frontend error
            print(e)
            await self.send(text_data=json.dumps({'error': str(e)}))
        except Exception as e:
            # who knows
            await self.send(text_data=json.dumps({'error': 'An unexpected error occurred.'}))

    @sync_to_async
    def modify_input(self, input_text):
        if not input_text.strip():
            raise ValueError("Input text is empty.")
        if len(input_text) > 100:
            raise ValueError("Input text is too long.")

        return (f"I want to do something and need 3 good ideas. "
                f"One idea must not exceed 10 words. "
                f"The answer must not be highlighted with asterisk or other markup."
                f"Answer in this language [{self.locale}]. "
                f"This is the topic: [{input_text}]")

    def process_response(self, response):
        formatted_response = {
            'issue1': '',
            'issue2': '',
            'issue3': ''
        }
        if matches := response_pattern.finditer(response):
            match_list = [match.group('issue') for match in matches]
            formatted_response |= {key: match_list[idx] for idx, key in enumerate(formatted_response)}
        return formatted_response

    @sync_to_async
    def ask_google_gemini(self, input_text):
        try:
            chat_session = model.start_chat(history=[])
            response = chat_session.send_message(input_text)
            print('original response text')
            print(response.text)
            return response.text
        except Exception as e:
            raise ValueError("Gemini-Error")


class GetDaily(AsyncWebsocketConsumer):
    async def connect(self):
        self.locale = self.scope['locale']
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            user = self.scope['user']
            today = now().date()

            # Check for existing tasks
            existing_daily_tasks = await get_daily_tasks_from_daily_model(user, today)
            if existing_daily_tasks:
                print('getting existing tasks')
                await self.send(text_data=json.dumps({'message': existing_daily_tasks}))
                return

            # Create tasks with gemini
            history_tasks = await get_history_tasks(user, text_data_json['focus'])
            modified_question = await self.modify_input(text_data_json['focus'])
            response = await self.ask_google_gemini(modified_question, history_tasks)
            new_tasks = self.parse_response(response)
            print('got new response')
            print(new_tasks)
            # Store new tasks and send them to the user
            final_tasks = await self.store_new_tasks(user, today, new_tasks)
            await self.send(text_data=json.dumps({'message': final_tasks}))
        except json.JSONDecodeError:
            logger.error("Invalid JSON format received: %s", text_data)
            await self.send(text_data=json.dumps({'error': 'Invalid JSON format.'}))
        except ValueError as e:
            logger.error("ValueError caught: %s", str(e))
            await self.send(text_data=json.dumps({'error': str(e)}))
        except Exception as e:
            logger.exception("An unexpected error occurred.")
            await self.send(text_data=json.dumps({'error': 'An unexpected error occurred.'}))

    @sync_to_async
    def get_daily_tasks(self, user, date):
        return list(DailyTask.objects.filter(owner=user, start_date=date).values_list('description', flat=True))

    @sync_to_async
    def store_new_tasks(self, user, date, tasks):
        DailyTask.objects.filter(owner=user, start_date__lt=date - timedelta(days=30)).delete()
        daily_task_objects = [DailyTask(owner=user, description=task, start_date=date) for task in tasks]
        DailyTask.objects.bulk_create(daily_task_objects)
        return tasks

    def parse_response(self, response):
        formatted_response = []
        if (match := response_daily.findall(response)) and len(match) > 2:
            formatted_response = [daily for daily in match]
        return formatted_response

    @sync_to_async
    def modify_input(self, input_text):
        return (f"I want to do something new today."
                f"Can you provide me 10 great ideas?"
                f"The task must be reasonable, regarding price and location."
                f"The task must revolve around this topic [{input_text}]."
                f"The answer must not be highlighted with asterisk or other markup."
                f"One task must not exceed 15 words."
                f"Answer in this language [{self.locale}].")

    @sync_to_async
    def ask_google_gemini(self, input_text, history):
        try:
            previous_tasks = [{"parts": [{"text": task}], "role": "model"} for task in history]
            chat_session = model.start_chat(history=previous_tasks)
            response = chat_session.send_message(input_text)
            print('google response')
            print(response)
            return response.text
        except Exception as e:
            print(e)
            raise ValueError("Gemini-Error")


# Helper functions
User = get_user_model()


@sync_to_async
def get_daily_tasks_from_daily_model(user, date):
    return list(DailyTask.objects.filter(owner=user, start_date=date).values_list('description', flat=True))


@sync_to_async
def get_history_tasks(user, category):
    thirty_days_ago = now().date() - timedelta(days=30)
    return list(Task.objects.filter(
        owner=user,
        daily=True,
        start_date__gte=thirty_days_ago,
        category=category
    ).values_list('description', flat=True))
