import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db.models import Q
from apps.chat.models import Conversation
from apps.chat.services import (
    MessageService, 
    UserPresenceService
)


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user = self.scope.get("user")
        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.room_group_name = f"chat_{self.conversation_id}"

        if not self.user or self.user.is_anonymous:
            await self.close(code=4003)  
            return

        if not await self.is_user_in_conversation():
            await self.close(code=4003)
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        await self.update_user_presence(is_online=True)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "presence_update",
                "user_id": str(self.user.id),
                "is_online": True,
                "last_seen": None
            }
        )

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            last_seen_time = await self.update_user_presence(is_online=False)
            
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "presence_update",
                    "user_id": str(self.user.id),
                    "is_online": False,
                    "last_seen": last_seen_time
                }
            )

            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def presence_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "presence_change",
            "presence": {
                "user_id": event["user_id"],
                "is_online": event["is_online"],
                "last_seen": event["last_seen"]
            }
        }))

    @database_sync_to_async
    def update_user_presence(self, is_online):
        from django.utils import timezone
        if is_online:
            UserPresenceService.set_user_online(self.user.id)
            return None
        else:
            UserPresenceService.set_user_offline(self.user.id)
            return timezone.now().isoformat()

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            return

        event_type = data.get("type")

        if event_type == "send_message":
            content = data.get("content", "").strip()
            if not content:
                return

            message = await self.save_message(content)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "id": str(message.id),
                    "sender_id": str(self.user.id),
                    "content": message.content,
                    "is_delivered": message.is_delivered,
                    "is_read": message.is_read,
                    "created_at": str(message.created_at),
                }
            )

    async def chat_message(self, event):
        data = event.copy()
        data.pop("type", None)  

        await self.send(text_data=json.dumps({
            "type": "new_message",
            "message": data
        }))


    @database_sync_to_async
    def is_user_in_conversation(self):
        return Conversation.objects.filter(
            id=self.conversation_id
        ).filter(
            Q(initiator=self.user) | Q(recipient=self.user)
        ).exists()

    @database_sync_to_async
    def save_message(self, content):
        conversation = Conversation.objects.get(id=self.conversation_id)

        return MessageService.send_message(
            conversation=conversation,
            sender=self.user,
            content=content,
        )