import React, { useState } from 'react';

const Tooltip = ({ children, text, position = 'right' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  }[position] || "left-full top-1/2 -translate-y-1/2 ml-2";

  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {isVisible && text && (
        <div className={`absolute ${positionClasses} pointer-events-none z-50 px-3 py-2 text-xs font-medium text-white bg-[#111b21] rounded-sm shadow-md whitespace-nowrap opacity-80 transition-opacity duration-150`}>
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;