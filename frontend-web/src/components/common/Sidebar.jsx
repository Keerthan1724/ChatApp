import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { FiMessageSquare } from "react-icons/fi";
import { ChatContext } from "@/context/ChatContext";
import Avatar from "@/components/common/Avatar";
import Tooltip from "@/components/ui/Tooltip"; 

const SIDEBAR_NAV_ITEMS = [
  {
    path: "/chat",
    label: "Chats",
    icon: <FiMessageSquare size={22} />,
  },
];

const Sidebar = () => {
  const { currentUser } = useContext(ChatContext);

  return (
    /* Responsive Layout:
      - Mobile/Tablet: Horizontal strip at the bottom (flex-row, justify-center)
      - Desktop (md:): Vertical strip on the left (flex-col, justify-between)
    */
    <div className="flex flex-row md:flex-col justify-around md:justify-between items-center py-2 md:py-4 px-6 md:px-0 w-full md:w-15 h-12 md:h-full bg-background border-t md:border-t-0 md:border-r border-border/40">
      
      {/* Navigation items container */}
      <div className="flex flex-row md:flex-col items-center gap-3">
        {SIDEBAR_NAV_ITEMS.map((item) => (
          <Tooltip key={item.path} text={item.label} position="right">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-muted hover:bg-primary/10 hover:text-primary"
                }`
              }
            >
              {item.icon}
            </NavLink>
          </Tooltip>
        ))}
      </div>

      {/* Profile Avatar Section: Visible ONLY on desktop screens */}
      <div className="hidden md:flex flex-col items-center">
        <Tooltip
          text={currentUser?.full_name || currentUser?.mobile_number || "Profile"}
          position="right"
        >
          <button className="rounded-full focus:outline-none transition-transform hover:scale-105 active:scale-95">
            <Avatar
              src={currentUser?.profile_picture}
              name={currentUser?.full_name || currentUser?.mobile_number}
              size="sm"
            >
              {/* Fallback to profile initals */}
            </Avatar>
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Sidebar;