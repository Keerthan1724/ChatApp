import React from "react";
import { IoCheckmark, IoCheckmarkDone, IoChevronDown } from "react-icons/io5";
import Avatar from "../common/Avatar";

const ChatCard = ({
  user,
  lastMessage,
  currentUserId,
  isActive = false,
  unreadCount = 0,
  onClick,
}) => {
  const isExistingChat = !!lastMessage;
  const isSentByMe =
    isExistingChat && String(lastMessage.sender_id) === String(currentUserId);

  const displayName = user?.full_name || user?.mobile_number || "Unknown User";

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

  return (
    <div
      onClick={onClick}
      className={`group flex items-center cursor-pointer select-none rounded-xl md:rounded-2xl transition-all duration-200
        /* Padding and Margins scale with screen size */
        px-3 py-2.5 mx-1 my-0.5 
        sm:px-3.5 sm:py-3 sm:mx-1.5 
        md:px-4 md:py-3.5 md:mx-2 md:my-1 
        ${
          isActive ? "bg-active-item shadow-sm" : "hover:bg-hover-item bg-white"
        }`}
    >
      {/* Avatar Container: tighter margin on mobile */}
      <div className="mr-2.5 sm:mr-3 md:mr-3.5 flex-shrink-0">
        <Avatar src={user?.profile_picture} name={displayName} size="md" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between space-y-0.5 md:space-y-1">
        {/* Top Row: Name and Time */}
        <div className="flex items-center justify-between">
          <h4 className="text-[13.5px] sm:text-[14.5px] md:text-[15px] font-semibold text-text truncate pr-2 font-sans">
            {displayName}
          </h4>
          {isExistingChat && (
            <span
              className={`text-[10.5px] sm:text-[11.5px] md:text-[12px] flex-shrink-0 font-medium ${
                unreadCount > 0 ? "text-emerald-600" : "text-text-muted/60"
              }`}
            >
              {formatTime(lastMessage.created_at)}
            </span>
          )}
        </div>

        {/* Bottom Row: Message preview and Unread/Chevron */}
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center text-xs sm:text-[13px] md:text-[13.5px] text-text-muted/80 truncate pr-2 min-w-0">
            {isSentByMe && (
              <span className="mr-1 sm:mr-1.5 flex-shrink-0 flex items-center">
                {lastMessage.is_read ? (
                  <IoCheckmarkDone className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] text-seen-blue" />
                ) : lastMessage.is_delivered ? (
                  <IoCheckmarkDone className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] text-text-muted/40" />
                ) : (
                  <IoCheckmark className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] text-text-muted/40" />
                )}
              </span>
            )}

            <p className="truncate font-sans text-text-muted">
              {isExistingChat
                ? lastMessage.content
                : user?.bio || "Hey there! I am using this app."}
            </p>
          </div>

          {/* Unread Badge / Hover Chevron */}
          <div className="flex-shrink-0 flex items-center justify-center min-w-[18px] h-[18px] md:min-w-[20px] md:h-5 ml-2">
            {unreadCount > 0 ? (
              <div
                className={`text-white text-[10px] md:text-[11px] font-bold rounded-full min-w-[18px] h-[18px] md:min-w-[20px] md:h-5 px-1 md:px-1.5 flex items-center justify-center shadow-sm animate-in fade-in zoom-in-75 duration-200 ${
                  user?.is_muted ? "bg-orange-500" : "bg-emerald-500"
                }`}
              >
                {unreadCount}
              </div>
            ) : (
              /* Chevron hidden on mobile (touch devices) as hover doesn't exist, only visible on larger screen hovers */
              <IoChevronDown className="hidden md:block w-4 h-4 text-text-muted/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatCard);