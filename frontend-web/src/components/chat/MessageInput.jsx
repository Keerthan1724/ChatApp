import React, { useRef, useEffect, useState } from "react";
import { IoHappyOutline, IoSend } from "react-icons/io5";
import { FaRegKeyboard } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

const MessageInput = ({
  value,
  onChange,
  onSend,
  placeholder = "Type a message...",
  disabled = false,
}) => {
  const textareaRef = useRef(null);
  const [isEmojiMode, setIsEmojiMode] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 375
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = `${Math.min(scrollHeight, 120)}px`;
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  const handleIconToggle = () => {
    setIsEmojiMode((prev) => !prev);
  };

  const handleEmojiClick = (emojiData) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextText = value.substring(0, start) + emojiData.emoji + value.substring(end);

    onChange({ target: { value: nextText } });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emojiData.emoji.length, start + emojiData.emoji.length);
    }, 10);
  };

  return (
    <div className="relative w-full flex flex-col bg-transparent">
      
      {/* Responsive Emoji Picker */}
      {isEmojiMode && !disabled && (
        <>
          <div 
            className="fixed inset-0 z-40 sm:hidden bg-black/20" 
            onClick={() => setIsEmojiMode(false)}
          />
          
          <div className="fixed bottom-0 left-0 right-0 z-50 sm:absolute sm:bottom-16 sm:left-6 sm:right-auto shadow-2xl border-t sm:border border-border/40 rounded-t-2xl sm:rounded-2xl overflow-hidden bg-white animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 duration-200">
            <EmojiPicker 
              onEmojiClick={handleEmojiClick}
              width={windowWidth < 640 ? "100%" : 340}
              height={windowWidth < 640 ? 300 : 380}
              previewConfig={{ showPreview: false }}
              skinTonesDisabled
              searchDisabled={windowWidth < 480}
            />
          </div>
        </>
      )}

      {/* Main Bottom Bar (select-none removed to allow typing) */}
      <div className="w-full px-3 sm:px-4 md:px-6 py-2 flex items-end space-x-2 sm:space-x-3 bg-[#efeae2]/10 backdrop-blur-sm border-t border-gray-200/40">
        
        {/* Emoji Button */}
        <button
          type="button"
          onClick={handleIconToggle}
          disabled={disabled}
          className="p-1.5 sm:p-2 text-text-muted rounded-full hover:bg-secondary transition-all duration-200 flex-shrink-0 mb-0.5 sm:mb-1 focus:outline-none hover:text-primary"
        >
          {isEmojiMode ? (
            <FaRegKeyboard className="w-5 sm:w-5.5 h-5 sm:h-5.5" />
          ) : (
            <IoHappyOutline className="w-5 sm:w-5.5 h-5 sm:h-5.5" />
          )}
        </button>

        {/* Dynamic Input Bubble */}
        <div className="flex-1 bg-white border border-border/40 rounded-[20px] md:rounded-full px-4 sm:px-5 py-1.5 sm:py-2 flex items-center transition-all shadow-sm focus-within:border-primary/20 focus-within:shadow-md min-h-[38px] sm:min-h-[40px]">
          <textarea
            ref={textareaRef}
            rows="1"
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full bg-transparent text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none resize-none max-h-[120px] leading-5 align-middle disabled:opacity-50 custom-scrollbar mx-0.5 sm:mx-1 py-0.5 select-text"
          />
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={() => {
            onSend();
            setIsEmojiMode(false); 
          }}
          disabled={!value.trim() || disabled}
          className={`p-2 sm:p-2.5 rounded-full flex items-center justify-center transition-all duration-200 mb-0.5 flex-shrink-0 focus:outline-none ${
            value.trim() && !disabled
              ? "bg-primary text-white shadow-md shadow-primary/10 hover:bg-primary-hover hover:scale-[1.02] active:scale-95"
              : "text-text-muted/40 bg-secondary cursor-not-allowed"
          }`}
        >
          <IoSend className="w-4 sm:w-4.5 h-4 sm:h-4.5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;