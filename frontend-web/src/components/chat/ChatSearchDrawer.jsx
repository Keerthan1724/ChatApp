import React from "react";
import { IoClose, IoCalendarOutline, IoSearch } from "react-icons/io5";
import SearchInput from "../common/SearchInput";

const ChatSearchDrawer = ({
  onClose,
  searchQuery,
  onSearchChange,
  selectedDate,
  onDateChange,
  onClearSearch,
  results = [],
  onResultClick,
}) => {
  const formatResultTime = (isoString) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-l border-gray-200 shadow-sm animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="h-[60px] sm:h-[64px] md:h-[68px] px-4 flex items-center border-b border-gray-100 flex-shrink-0 bg-gray-50/50">
        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200 transition-colors mr-2 focus:outline-none"
        >
          <IoClose className="w-5 h-5" />
        </button>
        <h3 className="text-sm font-semibold text-gray-700">Search Messages</h3>
      </div>

      {/* Control Area: Search Bar + Independent Date Action */}
      <div className="p-3 border-b border-gray-100 space-y-2 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search messages..."
              onClear={onClearSearch}
            />
          </div>

          {/* Clean date picker trigger layout button wrapper outside SearchInput */}
          <div className="relative flex items-center justify-center p-2 rounded-full border border-gray-200 bg-[#f0f2f5] hover:bg-white hover:border-primary/30 transition-all cursor-pointer text-gray-500 hover:text-primary">
            <IoCalendarOutline className="w-[18px] h-[18px]" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </div>
        </div>

        {/* Date Filter Badge Display indicator */}
        {selectedDate && (
          <div className="flex items-center justify-between px-3 py-1 bg-primary/10 rounded-lg text-xs font-medium text-primary">
            <span>Filtering Date: {selectedDate}</span>
            <button
              onClick={() => onDateChange("")}
              className="hover:text-red-500 text-sm font-bold ml-2"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Results Flow List Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 bg-gray-50/30">
        {results.length > 0 ? (
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
              {results.length} messages found
            </p>
            {results.map((msg) => {
  // Safe extraction of text properties if they arrive under data schemas
  const messageData = msg.data || msg;
  return (
    <div
      key={messageData.id}
      onClick={() => onResultClick(messageData.id)}
      className="w-full text-left p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-primary/30 hover:shadow transition-all cursor-pointer block"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-400">
          {formatResultTime(messageData.created_at)}
        </span>
      </div>
      <p className="text-xs sm:text-[13px] text-gray-700 truncate line-clamp-2 whitespace-pre-wrap">
        {messageData.content}
      </p>
    </div>
  );
})}
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-center p-4">
            <p className="text-xs sm:text-sm text-gray-400 font-medium">
              {searchQuery || selectedDate
                ? "No matching instances found"
                : "Search history by entering text phrase or selecting calendar target"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSearchDrawer;