import React from 'react';
import { IoClose, IoCallOutline, IoInformationCircleOutline } from 'react-icons/io5';
import Avatar from '../common/Avatar';

const ReceiverInfo = ({
  user,
  onClose
}) => {
  if (!user) return null;

  const displayName = user.full_name || user.mobile_number || "User Details";

  return (
    /* 
      Container classes modified for responsiveness:
      - Mobile & Tablet: Takes up full width, positioned absolute, sliding over the screen.
      - Desktop (md:): Resolves back to standard static panel within your dashboard grid.
    */
    <div className="fixed inset-0 z-50 md:relative md:inset-auto w-full h-full md:w-[350px] lg:w-[380px] bg-white flex flex-col border-l border-gray-200 shadow-2xl md:shadow-none animate-in slide-in-from-right duration-200">
      
      {/* Header bar: Responsive height matching our ChatHeader heights */}
      <div className="h-[60px] sm:h-[64px] md:h-[68px] px-4 sm:px-5 flex items-center justify-between border-b border-gray-100 bg-[#f0f2f5]/50 flex-shrink-0 select-none">
        <h3 className="text-[14.5px] md:text-[15px] font-semibold text-gray-800">Contact Info</h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 sm:p-2 rounded-full text-gray-500 hover:bg-gray-200 active:bg-gray-300 transition-colors duration-150 flex items-center justify-center focus:outline-none"
        >
          <IoClose className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 md:p-6 flex flex-col items-center">
        
        {/* Responsive Avatar Wrapper */}
        <div className="mb-3.5 mt-2 md:mb-4 select-none">
          <Avatar 
            src={user.profile_picture} 
            name={displayName} 
            /* 
               If your Avatar supports dynamic size classes, 
               you can pass 'xl' or let it auto-scale. 
            */
            size="xl" 
          />
        </div>

        {/* User Name & Phone Header */}
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center truncate w-full mb-1 select-text px-2">
          {user.full_name || "Account User"}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 text-center font-semibold select-text mb-5 md:mb-6">
          {user.mobile_number}
        </p>

        <hr className="w-full border-t border-gray-100 mb-4 md:mb-5" />

        {/* Info Cards */}
        <div className="w-full space-y-3 sm:space-y-4">
          {/* About / Bio card */}
          <div className="bg-gray-50 rounded-xl p-3 sm:p-3.5 border border-gray-100 transition-all duration-200 hover:shadow-sm">
            <div className="flex items-center text-gray-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1 sm:mb-1.5 select-none">
              <IoInformationCircleOutline className="w-4 h-4 mr-1.5 text-gray-500" />
              About / Bio
            </div>
            <p className="text-[13px] sm:text-[14px] text-gray-700 leading-relaxed whitespace-pre-wrap select-text">
              {user.bio || "Hey there! I am using this app."}
            </p>
          </div>

          {/* Phone Details card */}
          <div className="bg-gray-50 rounded-xl p-3 sm:p-3.5 border border-gray-100 transition-all duration-200 hover:shadow-sm">
            <div className="flex items-center text-gray-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1 sm:mb-1.5 select-none">
              <IoCallOutline className="w-4 h-4 mr-1.5 text-gray-500" />
              Phone Identifier
            </div>
            <p className="text-[13px] sm:text-[14px] text-gray-700 font-mono select-text">
              {user.mobile_number || "No direct phone verified"}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReceiverInfo;