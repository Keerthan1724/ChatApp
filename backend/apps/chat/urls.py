from django.urls import path

from apps.chat.views import (
    UserSearchAPIView,
    ConversationListAPIView, 
    MessageHistoryAPIView,
    MessageSearchAPIView # 1. IMPORT THE NEW SEARCH VIEW
)

urlpatterns = [
    path("search/", UserSearchAPIView.as_view(), name="user-search"),
    path("conversations/", ConversationListAPIView.as_view(), name="conversation-list"),
    path("conversations/<uuid:conversation_id>/messages/", MessageHistoryAPIView.as_view(), name="message-history"),
    path("conversations/<uuid:conversation_id>/search/", MessageSearchAPIView.as_view(), name="message-text-search"),
]