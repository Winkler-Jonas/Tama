import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import google.generativeai as genai
from decouple import config
import regex as re

response_pattern = re.compile(r"\*\*(?P<issue>.+?)\*\*", re.DOTALL | re.MULTILINE)

# Configure the AI model
genai.configure(api_key=config('DJANGO_GEMINI_AI_KEY'))

generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 100,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)


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
            print(response)
            return response.text
        except Exception as e:
            raise ValueError("Gemini-Error")
