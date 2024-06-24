from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async
import google.generativeai as genai
from django.conf import settings
from datetime import datetime
from decouple import config
import regex as re
import traceback
import pytz
import json


response_pattern = re.compile(r"\*\*(?P<issue>.+?)\*\*", re.DOTALL | re.MULTILINE)
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
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)


class FocusUpConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.locale = self.scope['url_route']['kwargs'].get('locale', 'en')
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
        self.locale = self.scope['url_route']['kwargs'].get('locale', 'en')
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
                f"Answer in this language [{self.locale}]. "
                f"This is the topic: [{input_text}]")

    def process_response(self, response):
        formatted_response = {
            'issue1': '',
            'issue2': '',
            'issue3': ''
        }
        if (match := response_pattern.findall(response)) and len(match) > 2:
            formatted_response |= {key: match[idx] for idx, key in enumerate(formatted_response.keys())}
        return formatted_response

    @sync_to_async
    def ask_google_gemini(self, input_text):
        try:
            chat_session = model.start_chat(history=[])
            response = chat_session.send_message(input_text)
            return response.text
        except Exception as e:
            raise ValueError("Gemini-Error")


class GetDaily(AsyncWebsocketConsumer):
    async def connect(self):
        self.locale = self.scope['url_route']['kwargs'].get('locale', 'en')
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            print('received')
            print(text_data_json)
            if not settings.DEBUG:
                if not self.validate_user_time(self.scope['user'].id, text_data['user_time_zone']):
                    raise ValueError('Daily already created')
            user_focus = text_data_json['focus']


            modified_question = await self.modify_input(user_focus)
            print(modified_question)
            response = await self.ask_google_gemini(modified_question)
            print(response)
            final_response = self.process_response(response)
            print(final_response)
            await self.send(text_data=json.dumps({'message': final_response}))
        except json.JSONDecodeError:
            # frontend error
            await self.send(text_data=json.dumps({'error': 'Invalid JSON format.'}))
        except ValueError as e:
            # user error / frontend error
            print('caught valueError')
            await self.send(text_data=json.dumps({'error': str(e)}))
        except Exception as e:
            # who knows
            print(e)
            traceback.print_exc()
            await self.send(text_data=json.dumps({'error': 'An unexpected error occurred.'}))

    async def validate_user_time(self, user_id, time_zone):
        try:
            utc_now = datetime.now(pytz.utc)
            user_tz = pytz.timezone(time_zone)
        except pytz.UnknownTimeZoneError:
            return False

        user_time = utc_now.astimezone(user_tz)
        last_run_date = await get_last_run_date(user_id)

        if last_run_date is None or user_time.date() > last_run_date:
            await update_last_run_date(user_id, user_time.date())
            return True
        return False

    def process_response(self, response):
        formatted_response = dict()
        if (match := response_daily.findall(response)) and len(match) > 2:
            formatted_response = {f'daily_{idx}': val for idx, val in enumerate(match)}
        return formatted_response

    @sync_to_async
    def modify_input(self, input_text):
        return (f"I want to do something new today."
                f"Can you provide me 10 great ideas?"
                f"The task must be reasonable, regarding price and location."
                f"The task must revolve around [{input_text}]."
                f"The answer must not be highlighted with asterisk or other markup."
                f"One task must not exceed 15 words."
                f"Answer in this language [{self.locale}].")

    @sync_to_async
    def ask_google_gemini(self, input_text):
        try:
            chat_session = model.start_chat(history=[])
            response = chat_session.send_message(input_text)
            return response.text
        except Exception as e:
            raise ValueError("Gemini-Error")


# Helper functions
User = get_user_model()


@sync_to_async
def get_last_run_date(user_id):
    try:
        user = User.objects.get(pk=user_id)
        return user.last_run_date
    except User.DoesNotExist:
        return None


@sync_to_async
def update_last_run_date(user_id, date):
    try:
        user = User.objects.get(pk=user_id)
        user.update_run_date(date)
        user.save()
    except User.DoesNotExist:
        return None
