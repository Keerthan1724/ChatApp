import React from "react";
import SearchInput from "../common/SearchInput";
import ChatCard from "./ChatCard";
import logo from "../../assets/logo.png";

const AppLogo = () => (
    <img 
      src={logo} 
      alt="Logo" 
      className="h-8 w-auto object-contain" 
    />
);

const ChatList = ({
  conversations = [],
  searchResults = [],
  searchQuery = "",
  onSearchChange,
  onClearSearch,
  activeConversationId,
  onSelectConversation,
  onSelectSearchResult,
  currentUserId,
  isLoadingSearch = false,
}) => {
  const query = searchQuery.trim();
  const isSearching = query.length > 0;
  const isMobileSearch = /^\d{10}$/.test(query);
  const filteredConversations =
    query.length > 0 && !isMobileSearch
      ? conversations.filter((conversation) => {
          const name = conversation.other_user?.full_name || "";
          const mobile = conversation.other_user?.mobile_number || "";
          return (
            name.toLowerCase().includes(query.toLowerCase()) ||
            mobile.includes(query)
          );
        })
      : conversations;

  const renderConversationList = (list) => {
    if (!list.length) {
      return (
        <div className="flex h-full items-center justify-center px-6 text-center select-none">
          <div className="max-w-[240px]">
            <p className="text-sm font-semibold text-text">
              {isSearching ? "No matching chats found" : "No conversations yet"}
            </p>
            <p className="mt-1.5 text-xs text-text-muted/70 leading-normal">
              {isSearching
                ? "Try a different name or complete a 10 digit number to search new users."
                : "Search any registered user's mobile number to start chatting."}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col space-y-0.5 py-2">
        {list.map((conversation) => (
          <ChatCard
            key={conversation.conversation_id}
            user={conversation.other_user}
            lastMessage={conversation.last_message}
            currentUserId={currentUserId}
            unreadCount={conversation.unread_count || 0} 
            isActive={String(activeConversationId) === String(conversation.conversation_id)}
            onClick={() => onSelectConversation(conversation.conversation_id)}
          />
        ))}
      </div>
    );
  };

  const renderSearchResults = () => {
    if (searchQuery.length < 10) {
      return (
        <div className="flex h-full items-center justify-center px-6 text-center select-none">
          <div>
            <p className="text-sm font-semibold text-text">Search User</p>
            <p className="mt-1 text-xs text-text-muted/70">
              Enter a complete 10 digit mobile number.
            </p>
          </div>
        </div>
      );
    }

    if (isLoadingSearch) {
      return (
        <div className="py-10 text-center text-sm text-text-muted select-none font-sans">
          Searching...
        </div>
      );
    }

    if (!searchResults.length) {
      return (
        <div className="py-10 text-center text-sm text-text-muted select-none font-sans">
          No user found.
        </div>
      );
    }

    return (
      <div className="flex flex-col py-2">
        <div className="mx-4 mb-2 bg-secondary/40 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-text-muted/80 select-none">
          Search Result
        </div>
        {searchResults.map((user) => (
          <ChatCard
            key={user.id}
            user={user}
            lastMessage={null}
            currentUserId={currentUserId}
            unreadCount={0}
            onClick={() => onSelectSearchResult(user)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Top Header Section with dynamic padding adjustments */}
      <div className="border-b border-border/40 bg-white pt-4 pb-2.5 md:pt-5 md:pb-3 flex flex-col space-y-2.5">
        
        {/* Responsive Brand Header Row */}
        <div className="px-4 md:px-5">
          {/* 1. APP LOGO: Visible only on mobile and tablet (hidden on desktop `md:`) */}
          <div className="block md:hidden">
            <AppLogo />
          </div>

          {/* 2. CHATS TEXT TITLE: Hidden on mobile and tablet, visible only on desktop (`md:block`) */}
          <h1 className="hidden md:block text-[22px] font-bold text-text tracking-tight select-none font-display">
            Chats
          </h1>
        </div>

        {/* Search Input Wrapper */}
        <div className="w-full">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            onClear={onClearSearch}
            placeholder="Search or start a new chat..."
          />
        </div>
      </div>

      {/* Conversations / Results list container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-1">
        {isSearching
          ? isMobileSearch
            ? renderSearchResults()
            : renderConversationList(filteredConversations)
          : renderConversationList(conversations)}
      </div>
    </div>
  );
};

export default ChatList;