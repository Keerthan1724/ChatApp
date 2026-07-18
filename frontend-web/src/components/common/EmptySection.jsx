import React from 'react';
import { IoChatbubblesOutline, IoLockClosedOutline } from 'react-icons/io5';

const EmptySection = ({
  title = "QuickChat Web Messenger",
  description = "Connect. Chat. Share.",
}) => {
  
  return (
    <div className="w-full h-full bg-[#f8f9fa] flex flex-col items-center justify-center p-8 select-none text-center">
      
      <div className="max-w-md flex flex-col items-center justify-center space-y-6">
        
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-gray-100 transition-transform duration-300 hover:scale-105">
          <IoChatbubblesOutline className="w-12 h-12 text-[#00a884]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-medium text-gray-800 tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-[320px] mx-auto">
            {description}
          </p>
        </div>

      </div>

      <div className="absolute bottom-6 flex items-center justify-center space-x-1.5 text-xs text-gray-400 font-medium">
        <IoLockClosedOutline className="w-3.5 h-3.5 text-gray-400" />
        <span>End-to-end encrypted</span>
      </div>

    </div>
  );
};

export default EmptySection;