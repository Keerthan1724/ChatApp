import React from "react";
import { IoSearch, IoClose } from "react-icons/io5";

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search or start a new chat...",
  disabled = false,
  onClear,
}) => {
  
  return (
    <div className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-transparent select-none">
      <div 
        className="relative flex items-center bg-[#f0f2f5] border border-transparent rounded-full 
                   px-3 sm:px-4 py-1 sm:py-1.5 transition-all duration-200 
                   focus-within:bg-white focus-within:border-primary/20 focus-within:shadow-md focus-within:shadow-primary/5"
      >
        {/* Search icon - resized smoothly using standard Tailwind classes */}
        <IoSearch className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px] text-gray-500 mr-2 sm:mr-2.5 flex-shrink-0 transition-colors duration-200 focus-within:text-primary" />

        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent text-[13.5px] sm:text-[14px] text-gray-800 placeholder-gray-500 outline-none border-none py-1 disabled:opacity-50"
        />

        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors duration-150 flex-shrink-0 flex items-center justify-center focus:outline-none"
          >
            <IoClose className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;