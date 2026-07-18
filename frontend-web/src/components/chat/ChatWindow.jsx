import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import ContextMenu from "../common/ContextMenu";
import BGIMAGE from "@/assets/chat_bg.png";

import { FiCopy, FiTrash2, FiX, FiCheckSquare, FiLogOut } from "react-icons/fi";

const MessageSkeleton = () => (
  <div className="space-y-4 animate-pulse select-none">
    <div className="flex justify-start px-4 sm:px-6">
      <div className="bg-white/60 h-12 w-[70%] sm:w-[55%] rounded-2xl rounded-tl-none shadow-sm border border-border/20" />
    </div>
    <div className="flex justify-end px-4 sm:px-6">
      <div className="bg-amber-50/50 h-16 w-[60%] sm:w-[40%] rounded-2xl rounded-tr-none shadow-sm border border-border/10" />
    </div>
  </div>
);

const ChatWindow = ({
  activeChat,
  previewUser,
  messages = [],
  currentUserId,
  messageText,
  onTextChange, // Direct explicit binding
  onSendMessage,
  onHeaderClick,
  onBackClick,
  loadingMessages = false,
  onSearchClick,
  searchQuery
}) => {
  const scrollRef = useRef(null);
  const chatAreaRef = useRef(null);

  const [displayMessages, setDisplayMessages] = useState(messages);
  const [displayUser, setDisplayUser] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState([]);

  const targetUser =
    previewUser ||
    activeChat?.other_user ||
    (activeChat?.user1?.id === currentUserId
      ? activeChat.user2
      : activeChat.user1);

  useEffect(() => {
    if (!loadingMessages) {
      setDisplayMessages(messages);
      setDisplayUser(targetUser);
    }
  }, [messages, loadingMessages, targetUser]);

  useLayoutEffect(() => {
    const showSkeleton = loadingMessages && displayMessages.length === 0;
    if (scrollRef.current && !showSkeleton) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayMessages, loadingMessages]);

  if (!activeChat && !previewUser) return null;

  const getDateLabel = (isoString) => {
    if (!isoString) return "";
    try {
      const messageDate = new Date(isoString);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (messageDate.toDateString() === today.toDateString()) return "Today";
      if (messageDate.toDateString() === yesterday.toDateString())
        return "Yesterday";

      return messageDate.toLocaleDateString([], {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const handleContextMenu = (e) => {
    if (
      e.target.closest(".chat-header-ignore") ||
      e.target.closest(".chat-input-ignore")
    ) {
      return;
    }
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleToggleSelectMessage = (msgId) => {
    setSelectedMessageIds((prev) =>
      prev.includes(msgId)
        ? prev.filter((id) => id !== msgId)
        : [...prev, msgId],
    );
  };

  const handleCopySelected = () => {
    const selectedTexts = displayMessages
      .filter((msg) => selectedMessageIds.includes(msg.id))
      .map((msg) => msg.content)
      .join("\n");

    navigator.clipboard.writeText(selectedTexts);
    alert("Copied selected messages to clipboard!");
    handleCancelSelection();
  };

  const handleDeleteSelected = () => {
    setDisplayMessages((prev) =>
      prev.filter((msg) => !selectedMessageIds.includes(msg.id)),
    );
    handleCancelSelection();
  };

  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedMessageIds([]);
  };

  const selectionActions = [
    {
      icon: <FiCopy className="w-5 h-5" />,
      onClick: handleCopySelected,
      label: "Copy",
      className: "text-gray-600 hover:bg-gray-100",
    },
    {
      icon: <FiTrash2 className="w-5 h-5" />,
      onClick: handleDeleteSelected,
      label: "Delete",
      className: "text-red-500 hover:bg-red-50",
    },
    {
      icon: <FiX className="w-5 h-5" />,
      onClick: handleCancelSelection,
      label: "Close",
      className: "text-gray-600 hover:bg-gray-100",
    },
  ];

  const contextMenuOptions = [
    {
      label: "Select Messages",
      icon: <FiCheckSquare />,
      onClick: () => setIsSelectionMode(true),
    },
    {
      label: "Close Chat",
      icon: <FiLogOut />,
      onClick: () => {
        if (onBackClick) onBackClick();
      },
      className: "text-red-600 hover:bg-red-50",
    },
  ];

  const generalHeaderOptions = [
    {
      label: "Clear Chat",
      icon: <FiTrash2 />,
      onClick: () => {
        if (
          window.confirm("Are you sure you want to clear this chat history?")
        ) {
          setDisplayMessages([]);
        }
      },
    },
    {
      label: "Close Chat",
      icon: <FiLogOut />,
      onClick: () => {
        if (onBackClick) onBackClick();
      },
    },
  ];

  const selectionHeaderOptions = [
    { label: "Copy", icon: <FiCopy />, onClick: handleCopySelected },
    {
      label: "Delete",
      icon: <FiTrash2 />,
      onClick: handleDeleteSelected,
      className: "text-red-600 hover:bg-red-50",
    },
    { label: "Cancel", icon: <FiX />, onClick: handleCancelSelection },
  ];

  const activeHeaderOptions = isSelectionMode
    ? selectionHeaderOptions
    : generalHeaderOptions;
  const displayedHeaderUser = displayUser || targetUser;
  const firstDisplayedMsg = displayMessages[0];

  const isDataMismatched =
    firstDisplayedMsg &&
    displayedHeaderUser &&
    String(firstDisplayedMsg.sender_id) !== String(displayedHeaderUser.id) &&
    String(firstDisplayedMsg.receiver_id) !== String(displayedHeaderUser.id) &&
    String(firstDisplayedMsg.sender_id) !== String(currentUserId);

  const showSkeleton = loadingMessages && displayMessages.length === 0;

  const groupedMessages = [];
  let lastDateLabel = "";

  if (!isDataMismatched) {
    displayMessages.forEach((message) => {
      const currentDateLabel = getDateLabel(message.created_at);
      if (currentDateLabel && currentDateLabel !== lastDateLabel) {
        groupedMessages.push({ type: "dateDivider", label: currentDateLabel });
        lastDateLabel = currentDateLabel;
      }
      groupedMessages.push({ type: "message", data: message });
    });
  }

  return (
    <div
      ref={chatAreaRef}
      onContextMenu={handleContextMenu}
      className="w-full h-full flex flex-col bg-[#efeae2] relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.45] pointer-events-none select-none z-0"
        style={{
          backgroundColor: "#efeae2",
          backgroundImage: `url(${BGIMAGE})`,
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative z-30 flex-shrink-0 chat-header-ignore">
        <ChatHeader
          user={displayedHeaderUser}
          onHeaderClick={onHeaderClick}
          onBackClick={onBackClick}
          onSearchClick={onSearchClick}
          menuOptions={activeHeaderOptions}
        />
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto min-h-0 py-4 sm:py-6 px-4 sm:px-6 md:px-10 relative z-10 custom-scrollbar space-y-2 sm:space-y-3"
      >
        {showSkeleton ? (
          <MessageSkeleton />
        ) : groupedMessages.length > 0 ? (
          groupedMessages.map((item, index) => {
            if (item.type === "dateDivider") {
              return (
                <div
                  key={`divider-${index}`}
                  className="flex justify-center my-3 sm:my-4 select-none animate-in fade-in duration-200"
                >
                  <div className="bg-white/90 shadow-sm px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10.5px] sm:text-[11.5px] font-semibold text-text-muted uppercase tracking-wider">
                    {item.label}
                  </div>
                </div>
              );
            }

            const msg = item.data;
            return (
              <MessageBubble
                key={`msg-${msg.id}`}
                id={msg.id}
                content={msg.content}
                senderId={msg.sender_id}
                createdAt={msg.created_at}
                isRead={msg.is_read}
                isDelivered={msg.is_delivered}
                currentUserId={currentUserId}
                isSelectionMode={isSelectionMode}
                isSelected={selectedMessageIds.includes(msg.id)}
                onToggleSelect={() => handleToggleSelectMessage(msg.id)}
                onLongPress={() => setIsSelectionMode(true)}
                searchQuery={searchQuery} // <-- ADD THIS LINE
              />
            );
          })
        ) : (
          <div className="h-full flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-200">
            <div className="bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-medium text-text-muted text-center shadow-sm border border-border/40 max-w-[85%]">
              This is the beginning of your chat history. Say hello!
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 flex-shrink-0 chat-input-ignore">
        {isSelectionMode ? (
          <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-between bg-white border-t border-gray-200 shadow-lg animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-xs sm:text-sm">
                {selectedMessageIds.length} selected
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3">
              {selectionActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.onClick}
                  className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${action.className}`}
                  title={action.label}
                >
                  {action.icon}
                  <span className="hidden sm:inline">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <MessageInput
            value={messageText}
            onChange={onTextChange} // Fixed mapping
            onSend={onSendMessage}
            placeholder="Type a message..."
          />
        )}
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={contextMenuOptions}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

export default React.memo(ChatWindow);
