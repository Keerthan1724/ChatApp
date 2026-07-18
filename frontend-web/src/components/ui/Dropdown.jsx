import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";

const Dropdown = ({
  options = [],
  trigger,
  position = "right-0", // Positions: "right-0" or "left-0"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Hook to close the dropdown if you click outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      
      {/* Trigger Button: If no custom trigger is passed, default to the 3-dot icon */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none"
      >
        {trigger || (
          <div className="p-1.5 sm:p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 active:scale-95 transition-all duration-150 cursor-pointer">
            <FiMoreVertical className="w-5 h-5" />
          </div>
        )}
      </button>

      {/* Options Panel Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute ${position} mt-1.5 w-48 rounded-xl bg-white border border-gray-200/60 shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-100 origin-top-right`}
        >
          {options.map((option, index) => {
            // Render a horizontal separator line if requested
            if (option.divider) {
              return (
                <div key={`divider-${index}`} className="border-t border-gray-100 my-1" />
              );
            }

            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  option.onClick?.();
                  setIsOpen(false); // Auto-close menu after selecting an action
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors focus:outline-none ${
                  option.className || "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                }`}
              >
                {/* Optional Icon */}
                {option.icon && (
                  <span className="text-gray-400 flex-shrink-0 text-base">
                    {option.icon}
                  </span>
                )}
                {/* Option Label */}
                <span className="font-medium flex-grow">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;