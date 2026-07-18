from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from apps.chat.models import Conversation
from apps.chat.serializers import (
    UserChatProfileSerializer,
    StartConversationSerializer,
    MessageSerializer
)
from apps.chat.services import UserService, ConversationService, MessageService


class UserSearchAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query_string = request.query_params.get("q", "").strip()
        
        users = UserService.search_users(request.user, query_string)
        serializer = UserChatProfileSerializer(users, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)


class ConversationListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        chat_list = ConversationService.get_user_conversations_list(request.user)

        return Response(chat_list, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = StartConversationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        recipient_user = serializer.context["recipient_user"]
        
        conversation = ConversationService.start_conversation(request.user, recipient_user)
        
        return Response(
            {
                "message": "Conversation loaded successfully.",
                "conversation_id": conversation.id
            },
            status=status.HTTP_200_OK
        )


class MessageHistoryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        try:
            conversation = Conversation.objects.filter(
                id=conversation_id
            ).filter(
                (Q(initiator=request.user) | Q(recipient=request.user))
            ).first()
            
            if not conversation:
                return Response(
                    { "detail": "Conversation not found or access denied." },
                    status=status.HTTP_404_NOT_FOUND
                )
            
            messages = MessageService.get_messages(conversation)
            MessageService.mark_messages_read(conversation, request.user)
            
            serializer = MessageSerializer(messages, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception:
            return Response(
                { "detail": "Invalid conversation reference identifier." },
                status=status.HTTP_400_BAD_REQUEST
            )


class MessageSearchAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        query_string = request.query_params.get("q", "").strip()
        
        conversation = Conversation.objects.filter(id=conversation_id).filter(
            Q(initiator=request.user) | Q(recipient=request.user)
        ).first()
        
        if not conversation:
            return Response(
                { "detail": "Conversation not found or access denied." },
                status=status.HTTP_404_NOT_FOUND
            )
            
        matching_messages = MessageService.search_messages(conversation, query_string)
        
        serializer = MessageSerializer(matching_messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    