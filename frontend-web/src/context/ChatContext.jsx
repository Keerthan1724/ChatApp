  import {
    createContext,
    useCallback,
    useMemo,
    useState,
    useEffect,
    useRef,
  } from "react";
  import chatService from "@/services/chatServices";

  export const ChatContext = createContext();

  export function ChatProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isHydrated, setIsHydrated] = useState(false);

    const [conversationList, setConversationList] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);

    const [messagesCache, setMessagesCache] = useState({});
    const [searchResults, setSearchResults] = useState([]);

    // --- NEW: Context States for Message Searching ---
    const [messageSearchResults, setMessageSearchResults] = useState([]);
    const [loadingMessageSearch, setLoadingMessageSearch] = useState(false);

    const [isReceiverInfoOpen, setIsReceiverInfoOpen] = useState(false);
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [chatError, setChatError] = useState("");

    const messagesCacheRef = useRef({});

    useEffect(() => {
      messagesCacheRef.current = messagesCache;
    }, [messagesCache]);

    const selectedConversationRef = useRef(selectedConversation);

    useEffect(() => {
      selectedConversationRef.current = selectedConversation;
    }, [selectedConversation]);

    const messages = useMemo(() => {
      if (!selectedConversation) return [];
      const id = selectedConversation.conversation_id || selectedConversation.id;
      return messagesCache[id] || [];
    }, [selectedConversation, messagesCache]);

    const clearSearch = useCallback(() => {
      setSearchResults([]);
    }, []);

    // --- NEW: Clear Historical Message Results Panel Context ---
    const clearMessageSearch = useCallback(() => {
      setMessageSearchResults([]);
    }, []);

    const loadConversations = useCallback(async () => {
      setLoadingConversations(true);
      setChatError("");
      try {
        const data = await chatService.getConversationList();
        const formattedData = data.map((c) => ({
          ...c,
          unread_count: c.unread_count || 0,
        }));
        setConversationList(formattedData);
      } catch (error) {
        setChatError(
          error?.response?.data?.detail || "Unable to load conversations.",
        );
      } finally {
        setLoadingConversations(false);
      }
    }, []);

    const searchUsers = useCallback(async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      setSearchLoading(true);
      setChatError("");
      try {
        const data = await chatService.searchUsers(query);
        setSearchResults(data);
      } catch (error) {
        setChatError(error?.response?.data?.detail || "Unable to search users.");
      } finally {
        setSearchLoading(false);
      }
    }, []);

    // --- NEW: Hit Backend Search Endpoint Engine Async Hook ---
    const searchHistoricalMessages = useCallback(
      async (conversationId, textQuery, dateQuery) => {
        if (!conversationId || (!textQuery?.trim() && !dateQuery)) {
          setMessageSearchResults([]);
          return;
        }
        setLoadingMessageSearch(true);
        try {
          const data = await chatService.searchMessages(
            conversationId,
            textQuery,
            dateQuery,
          );
          setMessageSearchResults(data);
        } catch (error) {
          console.error("Historical message search failed:", error);
        } finally {
          setLoadingMessageSearch(false);
        }
      },
      [],
    );

    const loadMessages = useCallback(async (conversationId) => {
      if (!conversationId) return;
      if (messagesCacheRef.current[conversationId]) {
        return messagesCacheRef.current[conversationId];
      }
      setLoadingMessages(true);
      try {
        const data = await chatService.getMessages(conversationId);
        const cleanMessages = Array.isArray(data) ? data : [];
        setMessagesCache((prev) => ({
          ...prev,
          [conversationId]: cleanMessages,
        }));
        return cleanMessages;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setLoadingMessages(false);
      }
    }, []);

    const openConversation = useCallback(
      async (mobileNumber) => {
        setChatError("");
        try {
          const response = await chatService.startConversation(mobileNumber);
          await loadConversations();
          return response.conversation_id;
        } catch (error) {
          setChatError(
            error?.response?.data?.detail || "Failed to start conversation.",
          );
          throw error;
        }
      },
      [loadConversations],
    );

    const appendMessage = useCallback((conversationId, message) => {
      if (!message) return;

      const activeChat = selectedConversationRef.current;
      const isCurrentActiveChat =
        activeChat &&
        String(activeChat.conversation_id) === String(conversationId);

      setMessagesCache((prev) => {
        const currentChatMessages = prev[conversationId] || [];
        if (currentChatMessages.some((item) => item.id === message.id))
          return prev;
        return {
          ...prev,
          [conversationId]: [...currentChatMessages, message],
        };
      });

      setConversationList((prev) => {
        const updatedList = prev.map((conversation) => {
          if (String(conversation.conversation_id) === String(conversationId)) {
            return {
              ...conversation,
              last_message: {
                id: String(message.id),
                content: message.content,
                sender_id: String(message.sender_id),
                is_read: isCurrentActiveChat ? true : message.is_read,
                is_delivered: message.is_delivered,
                created_at: message.created_at,
              },
              updated_at: message.created_at ?? new Date().toISOString(),
              unread_count: isCurrentActiveChat
                ? 0
                : (Number(conversation.unread_count) || 0) + 1,
            };
          }
          return conversation;
        });

        return [...updatedList].sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
        );
      });
    }, []);

    const selectConversation = useCallback(
      (conversationOrId) => {
        if (!conversationOrId) {
          setSelectedConversation(null);
          setIsReceiverInfoOpen(false);
          return;
        }

        let conversationItem = null;
        if (
          typeof conversationOrId === "string" ||
          typeof conversationOrId === "number"
        ) {
          conversationItem = conversationList.find(
            (item) => String(item.conversation_id) === String(conversationOrId),
          );
        } else {
          conversationItem = conversationOrId;
        }

        if (conversationItem) {
          const cleanItem = { ...conversationItem, unread_count: 0 };
          setSelectedConversation(cleanItem);
          setIsReceiverInfoOpen(false);

          setConversationList((prev) =>
            prev.map((c) =>
              String(c.conversation_id) === String(cleanItem.conversation_id)
                ? { ...c, unread_count: 0 }
                : c,
            ),
          );
        }
        setSearchResults([]);
      },
      [conversationList],
    );

    useEffect(() => {
      try {
        const storedUser =
          sessionStorage.getItem("user") || localStorage.getItem("user");
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to parse user storage", e);
      } finally {
        setIsHydrated(true);
      }
    }, []);

    const value = useMemo(
      () => ({
        currentUser,
        setCurrentUser,
        isHydrated,

        conversationList,
        conversations: conversationList,

        selectedConversation,
        setSelectedConversation,
        selectConversation,

        messages,
        setMessages: (newMsgs) => {
          if (selectedConversation) {
            const id =
              selectedConversation.conversation_id || selectedConversation.id;
            setMessagesCache((prev) => ({ ...prev, [id]: newMsgs }));
          }
        },
        appendMessage,

        searchResults,
        clearSearch,

        // --- NEW Expose Search Variables ---
        messageSearchResults,
        loadingMessageSearch,
        searchHistoricalMessages,
        clearMessageSearch,

        isReceiverInfoOpen,
        setIsReceiverInfoOpen,

        loadingConversations,
        loadingMessages,
        searchLoading,
        loadingSearch: searchLoading,
        chatError,

        loadConversations,
        fetchConversations: loadConversations,
        searchUsers,
        openConversation,
        startConversation: openConversation,
        loadMessages,
        fetchMessages: loadMessages,
      }),
      [
        currentUser,
        isHydrated,
        conversationList,
        selectedConversation,
        messages,
        searchResults,
        messageSearchResults,
        loadingMessageSearch,
        searchHistoricalMessages,
        clearMessageSearch,
        isReceiverInfoOpen,
        loadingConversations,
        loadingMessages,
        searchLoading,
        chatError,
        loadConversations,
        searchUsers,
        openConversation,
        loadMessages,
        appendMessage,
        selectConversation,
      ],
    );

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
  }
