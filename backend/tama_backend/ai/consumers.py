import os
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import google.generativeai as genai
from decouple import config
from transformers import pipeline

genai.configure(api_key=config('DJANGO_GEMINI_AI_KEY'))
nlp = pipeline("text-classification", model="unitary/toxic-bert")

generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)


class AskAIConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.locale = self.scope['url_route']['kwargs'].get('locale', 'en')

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({'error': 'Invalid JSON format.'}))
            return
        try:
            user_question = text_data_json['question']
            modified_question = self.modify_input(user_question)
            response = await self.ask_google_gemini(modified_question)
            final_response = self.process_response(response)
            await self.send(text_data=json.dumps({'message': final_response}))
        except Exception as e:
            await self.send(text_data=json.dumps({'error': str(e)}))

    @sync_to_async
    def modify_input(self, input_text):
        result = nlp(input_text)
        if any([r['label'] == 'LABEL_1' and r['score'] > 0.5 for r in result]):  # Check for offensive content
            raise ValueError("Behave yourself!")
        if not input_text.strip():
            raise ValueError("Input text is empty.")
        if len(input_text) > 300:
            raise ValueError("Input text is too long.")

        return (f"I want to do something and need 3 good ideas. "
                f"One idea should not contain more than 10 words. "
                f"Can you split the ideas with a '@' character. "
                f"Also could you provide the answer in this language [{self.locale}]. "
                f"This is the topic: [{input_text}]")

    def process_response(self, response):
        topics = response.split('@')

        if len(topics) >= 3:
            formatted_response = {
                'issue1': topics[0],
                'issue2': topics[1],
                'issue3': topics[2]
            }
        else:
            formatted_response = {
                'issue1': topics[0] if len(topics) > 0 else "Not provided",
                'issue2': topics[1] if len(topics) > 1 else "Not provided",
                'issue3': topics[2] if len(topics) > 2 else "Not provided"
            }
        return formatted_response

    @sync_to_async
    def ask_google_gemini(self, input_text):
        try:
            # Start a chat session
            chat_session = model.start_chat(history=[])

            # Send message to the model and get response
            response = chat_session.send_message(input_text)
            return response.text
        except Exception as e:
            # Handle specific exceptions or a general one
            print(f"Error during API request: {str(e)}")
            # Return a meaningful error message or use a fallback mechanism
            return "We encountered an issue processing your request."
