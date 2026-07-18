import uuid
from django.db import models
from apps.users.models import User


class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    initiator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="initiated_conversations",
    )
    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="received_conversations",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "conversations"
        ordering = ["-updated_at"]
        verbose_name = "Conversation"
        verbose_name_plural = "Conversations"

        indexes = [
            models.Index(fields=["initiator"]),
            models.Index(fields=["recipient"]),
            models.Index(fields=["-updated_at"]),
        ]
        
        constraints = [
            models.UniqueConstraint(
                fields=["initiator", "recipient"],
                name="unique_conversation_combination"
            )
        ]

    def __str__(self):
        return f"{self.initiator.full_name} ↔ {self.recipient.full_name}"


class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages",
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="sent_messages",
    )
    content = models.TextField()    
    is_delivered = models.BooleanField(default=False)  
    is_read = models.BooleanField(default=False)       
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "messages"
        ordering = ["created_at"]  
        verbose_name = "Message"
        verbose_name_plural = "Messages"

        indexes = [
            models.Index(fields=["conversation"]),
            models.Index(fields=["sender"]),
            models.Index(fields=["created_at"]),
            models.Index(fields=["is_read"]),
            models.Index(fields=["is_delivered"]),
        ]

    def __str__(self):
        return f"{self.sender.full_name}: {self.content[:30]}"