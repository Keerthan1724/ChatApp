import React, { useRef, useEffect } from "react";

const ContextMenu = ({ x, y, options, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      style={{ top: `${y}px`, left: `${x}px` }}
      className="fixed z-[9999] w-48 bg-white border border-gray-200/60 rounded-xl shadow-xl py-1.5 animate-in fade-in duration-100 zoom-in-95"
    >
      {options.map((option, index) => (
        <button
          key={index}
          type="button"
          onClick={() => {
            option.onClick();
            onClose();
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors focus:outline-none ${
            option.className || "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
          }`}
        >
          {option.icon && <span className="text-gray-400 text-base">{option.icon}</span>}
          <span className="font-medium flex-grow">{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;