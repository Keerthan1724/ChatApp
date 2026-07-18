from rest_framework import serializers
from apps.users.models import User
from apps.chat.models import Message
from apps.chat.services import UserPresenceService


class UserChatProfileSerializer(serializers.ModelSerializer):
    
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", 
            "full_name", 
            "mobile_number", 
            "profile_picture", 
            "bio",
            "is_online",    # Changed from is_active
            "last_seen"
        ]
        read_only_fields = fields

    def get_profile_picture(self, obj):
        if obj.profile_picture:
            return obj.profile_picture.url
        return None
    
    def get_is_online(self, obj):
        return UserPresenceService.is_user_online(obj.id)


class StartConversationSerializer(serializers.Serializer):
    
    mobile_number = serializers.CharField(max_length=10)

    def validate_mobile_number(self, value):
        try:
            user = User.objects.get(
                mobile_number=value,
                is_active=True,
            )
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this mobile number.")

        self.context["recipient_user"] = user

        return value


class MessageSerializer(serializers.ModelSerializer):
    
    sender_id = serializers.UUIDField(source="sender.id", read_only=True)

    class Meta:
        model = Message
        fields = [
            "id", 
            "sender_id", 
            "content", 
            "is_delivered", 
            "is_read", 
            "created_at"
        ]
        read_only_fields = ["id", "conversation", "sender_id", "is_delivered", "is_read", "created_at"]


class SendMessageSerializer(serializers.Serializer):

    content = serializers.CharField(max_length=5000, trim_whitespace=True)

    def validate_content(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError("Message cannot be empty.")

        return value