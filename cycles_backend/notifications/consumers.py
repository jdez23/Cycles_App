import json

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

from .credentials import *
from .serializers import *
from .models import *

# from users.models import User


# Receive notifications
class NotificationConsumer(WebsocketConsumer):

    async def connect(self):
        self.accept()
        self.base_send({"type": "websocket.accept",
                       "subprotocol": "my-protocol"})

    def receive(self, text_data):
        data = json.loads(text_data)
        title = data['title']
        body = data['body']
        image = data['image']

        async_to_sync(self.channel_layer.group_send)(
            str(data['to_user']),
            {
                "type": "chat_message",
                "title": json.dumps(title),
                "body": json.dumps(body),
                "image": json.dumps(image)
            }
        )

    def chat_message(self, event):
        self.send(text_data=json.dumps({
            "title": event["title"],
            "body": event["body"],
            "image": event["image"],
        },)
        )

    def disconnect(self, event):
        async_to_sync(self.channel_layer.group_discard)(
            str(self.group_name),
            self.channel_name
        )