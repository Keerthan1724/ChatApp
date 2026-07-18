from django.db.models import Q, Prefetch
from django.db import IntegrityError
from django.core.cache import cache
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from apps.users.models import User
from apps.chat.models import Conversation, Message


class UserService:
    
    @staticmethod
    def search_users(current_user, query_string):
        
        if not query_string:
            return User.objects.none()
            
        query_string = query_string.strip()
        
        return User.objects.filter(
            Q(full_name__icontains=query_string) | 
            Q(mobile_number__contains=query_string),
            is_active=True
        ).exclude(id=current_user.id).only(
            'id', 'full_name', 'email', 'mobile_number', 'profile_picture', 'bio'
        )


class ConversationService:

    @staticmethod
    def start_conversation(current_user, other_user):
        
        if current_user == other_user:
            raise ValidationError({"detail": "You cannot start a conversation with yourself."})

        sorted_users = sorted(
            [current_user, other_user],
            key=lambda user: str(user.id)
        )

        try:
            conversation, created = Conversation.objects.get_or_create(
                initiator=sorted_users[0],
                recipient=sorted_users[1],
            )
        except IntegrityError:
            conversation = Conversation.objects.get(
                initiator=sorted_users[0],
                recipient=sorted_users[1],
            )

        return conversation

    @staticmethod
    def get_user_conversations_list(user):
        
        newest_messages_prefetch = Prefetch(
            'messages',
            queryset=Message.objects.order_by('-created_at'),
            to_attr='prefetched_newest_messages'
        )

        conversations = Conversation.objects.filter(
            Q(initiator=user) | Q(recipient=user)
        ).select_related('initiator', 'recipient').prefetch_related(newest_messages_prefetch).order_by('-updated_at')
        
        conversation_data_list = []
        
        for convo in conversations:
            other_user = convo.recipient if convo.initiator == user else convo.initiator
            
            last_message = convo.prefetched_newest_messages[0] if convo.prefetched_newest_messages else None

            unread_count = convo.messages.filter(is_read=False).exclude(sender=user).count()
            
            conversation_data_list.append({
                "conversation_id": convo.id,
                "updated_at": convo.updated_at,
                "unread_count": unread_count,
                "other_user": {
                    "id": str(other_user.id),
                    "full_name": other_user.full_name,
                    "profile_picture": other_user.profile_picture.url if other_user.profile_picture else None,
                    "bio": other_user.bio,
                    "mobile_number": other_user.mobile_number,
                    "is_online": UserPresenceService.is_user_online(other_user.id), 
                    "last_seen": other_user.last_seen.isoformat() if other_user.last_seen else None, 
                },
                "last_message": {
                    "id": str(last_message.id),
                    "content": last_message.content,
                    "sender_id": str(last_message.sender_id),
                    "is_read": last_message.is_read,
                    "is_delivered": last_message.is_delivered,
                    "created_at": last_message.created_at,
                } if last_message else None
            })
            
        return conversation_data_list


class MessageService:

    @staticmethod
    def send_message(conversation, sender, content):
        
        if not content or not content.strip():
            raise ValidationError({ "content": "Message content cannot be empty." })

        message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            content=content.strip(),
        )

        conversation.save(update_fields=["updated_at"])

        return message

    @staticmethod
    def get_messages(conversation):
        
        return (
            Message.objects
            .filter(conversation=conversation)
            .select_related("sender")
            .order_by("created_at")
        )

    @staticmethod
    def mark_messages_read(conversation, user):
        
        return (
            Message.objects
            .filter(conversation=conversation, is_read=False)
            .exclude(sender=user)
            .update(is_read=True)
        )
    
    @staticmethod
    def search_messages(conversation, query_string):
        if not query_string or not query_string.strip():
            return Message.objects.none()
            
        return (
            Message.objects
            .filter(conversation=conversation, content__icontains=query_string.strip())
            .select_related("sender")
            .order_by("-created_at") 
        )


class UserPresenceService:
    @staticmethod
    def set_user_online(user_id):
        cache.key = f"user_online_{user_id}"
        cache.set(cache.key, True, 60 * 60 * 24) 

    @staticmethod
    def set_user_offline(user_id):
        cache.delete(f"user_online_{user_id}")
        User.objects.filter(id=user_id).update(last_seen=timezone.now())

    @staticmethod
    def is_user_online(user_id):
        return cache.get(f"user_online_{user_id}") is not None