import React from 'react';
import { IoSearchOutline, IoArrowBack } from 'react-icons/io5';
import Avatar from '../common/Avatar';
import Dropdown from '../ui/Dropdown'; 

const ChatHeader = ({ 
  user, 
  onHeaderClick, 
  onBackClick,
  onSearchClick, // NEW CALLBACK
  menuOptions = []
}) => {
  if (!user) return null;

  const displayName = user.full_name || user.mobile_number || "Chat Partner";
  const isOnline = user.is_online; 

  const formatLastSeen = (isoString) => {
    if (!isoString) return "offline";
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `last seen ${diffMins}m ago`;
      
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (date.toDateString() === now.toDateString()) {
        return `last seen today at ${timeStr}`;
      }
      if (date.toDateString() === yesterday.toDateString()) {
        return `last seen yesterday at ${timeStr}`;
      }
      
      return `last seen on ${date.toLocaleDateString([], { day: 'numeric', month: 'short' })} at ${timeStr}`;
    } catch {
      return "offline";
    }
  };

  return (
    <div 
      onClick={onHeaderClick}
      className="h-[60px] sm:h-[64px] md:h-[68px] px-3 sm:px-4 md:px-6 bg-white border-b border-border/60 flex items-center justify-between cursor-pointer select-none flex-shrink-0 transition-colors duration-200 hover:bg-secondary/30"
    >
      <div className="flex items-center min-w-0 space-x-2 sm:space-x-3 md:space-x-3.5">
        
        {onBackClick && (
          <button
            type="button"
            className="md:hidden p-2 -ml-1.5 rounded-full text-text-muted hover:bg-secondary hover:text-primary transition-colors focus:outline-none"
            onClick={(e) => {
              e.stopPropagation(); 
              onBackClick();
            }}
          >
            <IoArrowBack className="w-5 h-5" />
          </button>
        )}

        <div className="flex-shrink-0">
          <Avatar src={user.profile_picture} name={displayName} size="md" />
        </div>

        <div className="flex flex-col min-w-0">
          <h3 className="text-[13.5px] sm:text-sm font-semibold text-text truncate leading-tight">
            {displayName}
          </h3>
          <span 
            className={`text-[11px] sm:text-xs truncate transition-all duration-500 ease-in-out ${
              isOnline ? 'text-primary font-medium animate-pulse' : 'text-text-muted/70'
            }`}
          >
            {isOnline ? 'online' : formatLastSeen(user.last_seen)}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-0.5 sm:space-x-1 text-text-muted/80" onClick={(e) => e.stopPropagation()}>
        {/* CLICK ACTION TRIGGERS IN-CHAT SEARCH SIDEBAR */}
        <button 
          type="button"
          onClick={onSearchClick}
          className="p-2 rounded-full hover:bg-secondary transition-colors duration-150 focus:outline-none hover:text-primary"
        >
          <IoSearchOutline className="w-[19px] h-[19px] sm:w-5 sm:h-5" />
        </button>

        <Dropdown 
          options={menuOptions} 
          position="right-0" 
        />
      </div>
    </div>
  );
};

const MemoizedChatHeader = React.memo(ChatHeader, (prevProps, nextProps) => {
  return (
    prevProps.user?.id === nextProps.user?.id &&
    prevProps.user?.is_online === nextProps.user?.is_online &&
    prevProps.user?.last_seen === nextProps.user?.last_seen &&
    prevProps.user?.profile_picture === nextProps.user?.profile_picture &&
    prevProps.user?.full_name === nextProps.user?.full_name &&
    prevProps.onSearchClick === nextProps.onSearchClick && // Added
    prevProps.menuOptions === nextProps.menuOptions 
  );
});

export default MemoizedChatHeader;