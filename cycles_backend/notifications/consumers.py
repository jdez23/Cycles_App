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

        # self.group_name = self.scope['user'].id

        # if self.scope['user'].is_anonymous:
        #     self.close()
        # else:
        #     async_to_sync(self.channel_layer.group_add)(
        #         str(self.group_name),
        #         self.channel_name
        #     )
        # self.accept()

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
        # print("Disconnected")
        async_to_sync(self.channel_layer.group_discard)(
            str(self.group_name),
            self.channel_name
        )


# # import json

# # from channels.generic.websocket import AsyncWebsocketConsumer
# # from channels.layers import get_channel_layer


# # class NotificationConsumer(AsyncWebsocketConsumer):

# #     async def connect(self):
# #         if self.scope['user'].is_anonymous:
# #             await self.close()
# #         else:
# #             self.group_name = str(self.scope['user'].id)
# #             await self.channel_layer.group_add(self.group_name, self.channel_name)
# #             await self.accept()

# #     async def disconnect(self, close_code):
# #         await self.channel_layer.group_discard(self.group_name, self.channel_name)

# #     async def receive(self, text_data):
# #         data = json.loads(text_data)
# #         title = data['title']
# #         body = data['body']
# #         image = data['image']
# #         to_user = str(data['to_user'])

# #         await self.channel_layer.group_send(
# #             to_user,
# #             {
# #                 'type': 'chat_message',
# #                 'title': title,
# #                 'body': body,
# #                 'image': image
# #             }
# #         )

# #     async def chat_message(self, event):
# #         title = event['title']
# #         body = event['body']
# #         image = event['image']

# #         await self.send(json.dumps({
# #             'title': title,
# #             'body': body,
# #             'image': image
# #         }))
