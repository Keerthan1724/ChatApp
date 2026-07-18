import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ChatLayout from "@/layouts/ChatLayout";
import ChatList from "@/components/chat/ChatList";
import ChatWindow from "@/components/chat/ChatWindow";
import ReceiverInfo from "@/components/chat/ReceiverInfo";
import ChatSearchDrawer from "@/components/chat/ChatSearchDrawer"; 
import EmptySection from "@/components/common/EmptySection";

import useChat from "@/hooks/useChat";
import useSocket from "@/hooks/useSocket";

const ChatPage = () => {
  const {
    currentUser,
    conversations,
    fetchConversations,
    searchResults,
    searchUsers,
    clearSearch,
    selectedConversation,
    selectConversation,
    startConversation,
    messages,
    fetchMessages,
    appendMessage,
    loadingConversations,
    loadingMessages,
    loadingSearch,
    
    // --- NEW: Extracting historical message elements from context hook ---
    messageSearchResults,
    searchHistoricalMessages,
    clearMessageSearch,
  } = useChat();

  const [searchQuery, setSearchQuery] = useState("");
  const [receiverPanelOpen, setReceiverPanelOpen] = useState(false);
  const [messageText, setMessageTextState] = useState("");
  const [previewUser, setPreviewUser] = useState(null);
  const [pendingMessage, setPendingMessage] = useState(null);

  // --- NEW IN-CHAT SEARCH CONTROLLERS ---
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [inChatSearchQuery, setInChatSearchQuery] = useState("");
  const [inChatSelectedDate, setInChatSelectedDate] = useState("");

  const navigate = useNavigate();
  const { conversationId } = useParams();
  const authToken = localStorage.getItem("access") || sessionStorage.getItem("access");

  const activeConversationIdRef = useRef(selectedConversation?.conversation_id);
  useEffect(() => {
    activeConversationIdRef.current = selectedConversation?.conversation_id;
  }, [selectedConversation]);

  const {
    socketRef,
    isReady: socketReady,
    sendMessage: sendSocketMessage,
  } = useSocket(
    conversationId || selectedConversation?.conversation_id,
    authToken,
    appendMessage,
    (presenceData) => {
      const { user_id, is_online, last_seen } = presenceData;
      selectConversation((prev) => {
        if (prev && String(prev.other_user?.id) === String(user_id)) {
          return {
            ...prev,
            other_user: { ...prev.other_user, is_online, last_seen },
          };
        }
        return prev;
      });
    },
  );

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Reset local active conversation search contexts when switching chat rooms
  useEffect(() => {
    setIsSearchDrawerOpen(false);
    setInChatSearchQuery("");
    setInChatSelectedDate("");
    clearMessageSearch();
  }, [conversationId, clearMessageSearch]);

  useEffect(() => {
    if (!conversationId || !conversations.length) return;

    const loadConversation = async () => {
      const targetConversation = conversations.find(
        (c) => String(c.conversation_id) === String(conversationId)
      );
      if (!targetConversation) return;

      setPreviewUser(null);
      if (String(activeConversationIdRef.current) !== String(conversationId)) {
        await fetchMessages(targetConversation.conversation_id);
        selectConversation(targetConversation);
      }
    };
    loadConversation();
  }, [conversationId, conversations, fetchMessages, selectConversation]);

  useEffect(() => {
    const value = searchQuery.trim();
    if (!value) {
      clearSearch();
      return;
    }
    if (/^\d{10}$/.test(value)) {
      searchUsers(value);
      return;
    }
    clearSearch();
  }, [searchQuery, searchUsers, clearSearch]);

  // --- NEW: Trigger Backend Historical API request instead of running client-side filtering ---
  useEffect(() => {
    const currentConvId = conversationId || selectedConversation?.conversation_id;
    if (!currentConvId) return;

    if (!inChatSearchQuery.trim() && !inChatSelectedDate) {
      clearMessageSearch();
      return;
    }

    // Optional: Add a short debounce here if typing triggers too many network requests
    searchHistoricalMessages(currentConvId, inChatSearchQuery, inChatSelectedDate);
  }, [inChatSearchQuery, inChatSelectedDate, conversationId, selectedConversation, searchHistoricalMessages, clearMessageSearch]);

  // --- CLICK ACTIONS FOR MATCH INSTANCES (SCROLL TO ELEMENT) ---
  // Replace this function implementation inside ChatPage.jsx
const handleJumpToMessageResult = (msgId) => {
  const targetEl = document.getElementById(`msg-node-${msgId}`);
  if (targetEl) {
    targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
    
    // Check if the matching bubble component is wrapped by an active handler window context
    // Instead of using yellow highlights, leverage the select UI toggles
    if (typeof selectConversation === "function") {
      const msgNode = messages.find(m => String(m.id) === String(msgId));
      // Triggers temporary backdrop highlighting overlay context safely
      targetEl.classList.add("bg-primary/10", "scale-[1.01]");
      setTimeout(() => {
        targetEl.classList.remove("bg-primary/10", "scale-[1.01]");
      }, 2000);
    }
  } else {
    alert("This message is older and not loaded in the active cache container window viewport yet.");
  }
};

  const handleConversationSelect = async (id) => {
    setPreviewUser(null);
    const conversation = conversations.find((c) => String(c.conversation_id) === String(id));
    if (!conversation) return;

    await fetchMessages(id);
    selectConversation(conversation);
    navigate(`/chat/${id}`);
  };

  const handleSearchResultSelect = async (user) => {
    const existingConversation = conversations.find((c) => String(c.other_user?.id) === String(user.id));
    if (existingConversation) {
      setPreviewUser(null);
      setSearchQuery("");
      clearSearch();
      selectConversation(existingConversation);
      navigate(`/chat/${existingConversation.conversation_id}`);
      return;
    }
    setPreviewUser(user);
    setSearchQuery("");
    clearSearch();
    selectConversation(null);
  };

  const handleSendMessage = async () => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage) return;

    if (previewUser && !selectedConversation) {
      setPendingMessage(trimmedMessage);
      setMessageTextState("");
      const newId = await startConversation(previewUser.mobile_number);
      if (!newId) {
        setPendingMessage(null);
        return;
      }
      await fetchConversations();
      navigate(`/chat/${newId}`);
      return;
    }

    if (!selectedConversation || !socketReady) return;
    sendSocketMessage(trimmedMessage);
    setMessageTextState("");
  };

  const handleBackNavigation = () => {
    selectConversation(null);
    setPreviewUser(null);
    navigate("/chat");
  };

  const isChatActive = !!(conversationId || previewUser);
  const isRightSidePanelOpen = receiverPanelOpen || isSearchDrawerOpen;

  return (
    <ChatLayout
      isDetailOpen={isRightSidePanelOpen}
      isChatActive={isChatActive}
      onBack={handleBackNavigation}
      listPanel={
        <ChatList
          conversations={conversations}
          searchResults={searchResults}
          searchQuery={searchQuery}
          currentUserId={currentUser?.id}
          activeConversationId={selectedConversation?.conversation_id}
          isLoadingSearch={loadingSearch}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onClearSearch={() => {
            setSearchQuery("");
            clearSearch();
          }}
          onSelectConversation={handleConversationSelect}
          onSelectSearchResult={handleSearchResultSelect}
          loading={loadingConversations}
        />
      }
      mainPanel={
        selectedConversation || previewUser ? (
          // Find this inside your mainPanel section in ChatPage.jsx
<ChatWindow
  activeChat={selectedConversation}
  previewUser={previewUser}
  messages={messages}
  currentUserId={currentUser?.id}
  messageText={messageText}
  loadingMessages={loadingMessages}
  onTextChange={(e) => setMessageTextState(e.target.value)}
  onSendMessage={handleSendMessage}
  onHeaderClick={() => {
    setIsSearchDrawerOpen(false);
    setReceiverPanelOpen(!receiverPanelOpen);
  }}
  onSearchClick={() => {
    setReceiverPanelOpen(false);
    setIsSearchDrawerOpen(!isSearchDrawerOpen);
  }}
  searchQuery={inChatSearchQuery} // <-- ADD THIS LINE HERE
/>
        ) : (
          <EmptySection
            title="Welcome to QuickChat"
            description="Search a mobile number or select an existing conversation to start chatting."
          />
        )
      }
      detailPanel={
        receiverPanelOpen ? (
          <ReceiverInfo 
            user={selectedConversation?.other_user || previewUser} 
            onClose={() => setReceiverPanelOpen(false)} 
          />
        ) : isSearchDrawerOpen ? (
          <ChatSearchDrawer
            searchQuery={inChatSearchQuery}
            onSearchChange={setInChatSearchQuery}
            selectedDate={inChatSelectedDate}
            onDateChange={setInChatSelectedDate}
            onClearSearch={() => setInChatSearchQuery("")}
            results={messageSearchResults} // <-- Updated data prop linkage pointing to full history backend response array
            onResultClick={handleJumpToMessageResult}
            onClose={() => setIsSearchDrawerOpen(false)}
          />
        ) : null
      }
    />
  );
};

export default ChatPage;