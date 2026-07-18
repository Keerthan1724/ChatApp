import React, { useRef } from "react";
import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";

const MessageBubble = ({
  id,
  content,
  senderId,
  createdAt,
  isRead,
  isDelivered,
  currentUserId,
  isSelectionMode,
  isSelected,
  onToggleSelect,
  onLongPress,
}) => {
  const isMe = String(senderId) === String(currentUserId);
  const timerRef = useRef(null);

  const formatTime = (isoString) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const handleTouchStart = () => {
    if (isSelectionMode) return;
    timerRef.current = setTimeout(() => {
      if (onLongPress) onLongPress();
    }, 600);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };
  const handleTouchMove = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <div
      id={`msg-node-${id}`}
      onClick={isSelectionMode ? onToggleSelect : undefined}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      className={`flex w-full items-center transition-all duration-150 select-none ${
        isSelectionMode ? "cursor-pointer" : ""
      } ${
        isSelectionMode
          ? "py-2 px-4 sm:px-6 md:px-10"
          : "py-1.5 px-4 sm:px-6 md:px-10"
      } ${
        isSelected
          ? "bg-primary/15 backdrop-blur-[0.5px]"
          : isSelectionMode
            ? "hover:bg-gray-50/10"
            : ""
      }`}
    >
      <div className={`flex-1 flex ${isMe ? "justify-end" : "justify-start"}`}>
        <div
          className={`relative rounded-2xl select-text font-sans text-text transition-all duration-200
            max-w-[85%] sm:max-w-[75%] md:max-w-[70%]
            px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 
            text-[13.5px] sm:text-[14px] md:text-[15px] leading-relaxed shadow-sm md:shadow-md
            ${
              isMe
                ? "border-r-[3px] md:border-r-4 border-r-accent border-y-border/40 border-l-border/40 rounded-tr-none bg-amber-50"
                : "border-l-[3px] md:border-l-4 border-l-primary border-y-border/40 border-r-border/40 rounded-tl-none bg-white"
            }
            ${isSelected ? "opacity-60 shadow-none scale-[0.99]" : ""} 
          `}
        >
          <div className="block">
            <span className="whitespace-pre-wrap break-words inline">
              {content}
            </span>

            <span className="inline-flex items-center align-bottom whitespace-nowrap ml-2.5 md:ml-3 translate-y-[3px] md:translate-y-[4px] float-right select-none text-[10px] sm:text-[11px] md:text-[11.5px] text-text-muted/80 space-x-1">
              <span className="font-sans">{formatTime(createdAt)}</span>
              {isMe && (
                <span className="flex items-center">
                  {isRead ? (
                    <IoCheckmarkDone className="w-[15px] h-[15px] md:w-[18px] md:h-[18px] text-seen-blue" />
                  ) : isDelivered ? (
                    <IoCheckmarkDone className="w-[15px] h-[15px] md:w-[18px] md:h-[18px] text-text-muted/50" />
                  ) : (
                    <IoCheckmark className="w-[15px] h-[15px] md:w-[18px] md:h-[18px] text-text-muted/50" />
                  )}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {isSelectionMode && (
        <div
          className="flex-shrink-0 ml-3 sm:ml-4 flex items-center justify-center animate-in fade-in zoom-in-75 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className={`w-5 h-5 rounded-full cursor-pointer transition-all duration-150 appearance-none border-2 focus:outline-none ${
              isSelected
                ? "bg-primary border-primary"
                : "bg-transparent border-gray-400 hover:border-primary"
            }`}
          />
        </div>
      )}
    </div>
  );
};

const MemoizedMessageBubble = React.memo(
  MessageBubble,
  (prevProps, nextProps) => {
    return (
      prevProps.isSelectionMode === nextProps.isSelectionMode &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.content === nextProps.content &&
      prevProps.isRead === nextProps.isRead &&
      prevProps.isDelivered === nextProps.isDelivered &&
      String(prevProps.senderId) === String(nextProps.senderId) &&
      String(prevProps.currentUserId) === String(nextProps.currentUserId) &&
      prevProps.createdAt === nextProps.createdAt &&
      prevProps.searchQuery === nextProps.searchQuery
    );
  },
);

export default MemoizedMessageBubble;
