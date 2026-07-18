import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

const ChatLayout = ({
  listPanel,
  mainPanel,
  detailPanel,
  isDetailOpen,
  isChatActive,
  onBack,
}) => {
  const [listWidth, setListWidth] = useState(360);
  const [detailWidth, setDetailWidth] = useState(320);

  const MIN_LIST_WIDTH = 280;
  const MAX_LIST_WIDTH = 500;
  const MIN_DETAIL_WIDTH = 260;
  const MAX_DETAIL_WIDTH = 450;

  const handleListResize = (mouseDownEvent) => {
    mouseDownEvent.preventDefault();
    const startX = mouseDownEvent.clientX;
    const startWidth = listWidth;

    const doResize = (mouseMoveEvent) => {
      const deltaX = mouseMoveEvent.clientX - startX;
      const calculatedWidth = startWidth + deltaX;
      if (
        calculatedWidth >= MIN_LIST_WIDTH &&
        calculatedWidth <= MAX_LIST_WIDTH
      ) {
        setListWidth(calculatedWidth);
      }
    };

    const stopResize = () => {
      document.removeEventListener("mousemove", doResize);
      document.removeEventListener("mouseup", stopResize);
    };

    document.addEventListener("mousemove", doResize);
    document.addEventListener("mouseup", stopResize);
  };

  const handleDetailResize = (mouseDownEvent) => {
    mouseDownEvent.preventDefault();
    const startX = mouseDownEvent.clientX;
    const startWidth = detailWidth;

    const doResize = (mouseMoveEvent) => {
      const deltaX = startX - mouseMoveEvent.clientX;
      const calculatedWidth = startWidth + deltaX;
      if (
        calculatedWidth >= MIN_DETAIL_WIDTH &&
        calculatedWidth <= MAX_DETAIL_WIDTH
      ) {
        setDetailWidth(calculatedWidth);
      }
    };

    const stopResize = () => {
      document.removeEventListener("mousemove", doResize);
      document.removeEventListener("mouseup", stopResize);
    };

    document.addEventListener("mousemove", doResize);
    document.addEventListener("mouseup", stopResize);
  };

  return (
    <div className="w-screen h-[100dvh] flex flex-col overflow-hidden bg-white select-none">
      {/* 1. TOP NAVBAR: Hidden on Mobile & Tablets */}
      <div className="hidden md:block w-full h-[60px] flex-shrink-0 z-50">
        <Navbar />
      </div>

      {/* Page Body Wrap */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 w-full relative z-40">
        
        {/* 2. SIDEBAR / BOTTOM NAVIGATION */}
        {/* FIX: Added `order-last md:order-first`
          - On mobile: Pushes the navigation bar to the absolute bottom of the column flow.
          - On desktop: Pulls it back to the far left side of the row layout.
        */}
        <div
          className={`w-full md:w-auto flex-shrink-0 z-50 order-last md:order-first ${
            isChatActive ? "hidden md:block" : "block"
          }`}
        >
          <Sidebar />
        </div>

        {/* 3. LIST PANEL (Conversations Panel) */}
        <div
          style={{ width: window.innerWidth < 768 ? "100%" : `${listWidth}px` }}
          className={`h-full flex-1 md:flex-none flex-shrink-0 flex flex-col border-r border-gray-200/80 bg-white
            ${isChatActive ? "hidden md:flex" : "flex"}
          `}
        >
          {listPanel}
        </div>

        {/* List panel resizer bar (Hidden on mobile) */}
        <div
          onMouseDown={handleListResize}
          className="hidden md:block w-1 h-full cursor-col-resize hover:bg-[#00a884]/40 active:bg-[#00a884] bg-transparent transition-colors duration-200 z-30 flex-shrink-0"
        />

        {/* 4. MAIN PANEL (Active Chat Window) */}
        <div
          className={`flex-1 h-full min-w-0 bg-[#efeae2] relative ${
            !isChatActive ? "hidden md:block" : "block"
          }`}
        >
          {React.cloneElement(mainPanel, { onBackClick: onBack })}
        </div>

        {/* 5. USER CONTACT PROFILE INFO SIDEBAR/DRAWER */}
        {isDetailOpen && detailPanel && (
          <>
            <div
              onMouseDown={handleDetailResize}
              className="hidden md:block w-1 h-full cursor-col-resize hover:bg-[#00a884]/40 active:bg-[#00a884] bg-transparent transition-colors duration-200 z-30 flex-shrink-0"
            />
            <div
              style={{
                width: window.innerWidth < 768 ? "100%" : `${detailWidth}px`,
              }}
              className="h-full flex-shrink-0 flex flex-col bg-white border-l border-gray-200/80 fixed inset-0 md:relative z-50 md:z-10"
            >
              {detailPanel}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default ChatLayout;