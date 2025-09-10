import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Chat_Message, Tracking
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from .models import Package, User

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.package_id = self.scope['url_route']['kwargs']['package_id']
        self.partner_id = self.scope['url_route']['kwargs']['partner_id']
        self.user_id = str(self.scope['user'].id)

        # Always build room using BOTH user ids (order independent)
        ids = sorted([self.user_id, self.partner_id])
        self.room_group_name = f"chat_{self.package_id}_{ids[0]}_{ids[1]}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message")

        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "chat.message", "message": message, "sender": self.scope["user"].username},
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"]
        }))


# class TrackingConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.package_id = self.scope["url_route"]["kwargs"]["package_id"]
#         self.room_group_name = f"tracking_{self.package_id}"

#         await self.channel_layer.group_add(self.room_group_name, self.channel_name)
#         await self.accept()

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         latitude = data["latitude"]
#         longitude = data["longitude"]

#         await self.save_location(latitude, longitude)

#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {
#                 "type": "location_update",
#                 "latitude": latitude,
#                 "longitude": longitude,
#             }
#         )

#     async def location_update(self, event):
#         await self.send(text_data=json.dumps({
#             "latitude": event["latitude"],
#             "longitude": event["longitude"],
#         }))

#     @database_sync_to_async
#     def save_location(self, latitude, longitude):

#         package = Package.objects.get(id=self.package_id)
#         tracking, created = Tracking.objects.get_or_create(package=package)
#         tracking.latitude = latitude
#         tracking.longitude = longitude
#         tracking.save()
