import React from 'react';

const AVATAR_COLORS = [
  // Slate & Cool Grays
  { bg: 'bg-[#f1f5f9]', text: 'text-[#475569]' },
  { bg: 'bg-[#e2e8f0]', text: 'text-[#334155]' },
  
  // Vibrant Blues & Cyans
  { bg: 'bg-[#e0f2fe]', text: 'text-[#0369a1]' },
  { bg: 'bg-[#dbeafe]', text: 'text-[#1d4ed8]' },
  { bg: 'bg-[#eff6ff]', text: 'text-[#2563eb]' },
  { bg: 'bg-[#ecfeff]', text: 'text-[#0e7490]' },
  
  // Emerald, Mint & Teals
  { bg: 'bg-[#e6fffa]', text: 'text-[#047481]' },
  { bg: 'bg-[#e0f2f1]', text: 'text-[#004d40]' },
  { bg: 'bg-[#dcfce7]', text: 'text-[#15803d]' },
  { bg: 'bg-[#f0fdf4]', text: 'text-[#16a34a]' },
  
  // Warm Ambers, Oranges & Yellows
  { bg: 'bg-[#ffedd5]', text: 'text-[#c2410c]' },
  { bg: 'bg-[#fff7ed]', text: 'text-[#ea580c]' },
  { bg: 'bg-[#fef9c3]', text: 'text-[#a16207]' },
  { bg: 'bg-[#fef08a]', text: 'text-[#854d0e]' },
  
  // Premium Purples, Indigo & Lavenders
  { bg: 'bg-[#f3e8ff]', text: 'text-[#7e22ce]' },
  { bg: 'bg-[#fae8ff]', text: 'text-[#a21caf]' },
  { bg: 'bg-[#e0e7ff]', text: 'text-[#4338ca]' },
  { bg: 'bg-[#eef2ff]', text: 'text-[#4f46e5]' },
  
  // Pinks, Roses & Red-Tones
  { bg: 'bg-[#fce7f3]', text: 'text-[#be185d]' },
  { bg: 'bg-[#ffe4e6]', text: 'text-[#b91c1c]' },
  { bg: 'bg-[#fff1f2]', text: 'text-[#e11d48]' },
  
  // Earthy Tones & Olives
  { bg: 'bg-[#f5f5f4]', text: 'text-[#44403c]' },
  { bg: 'bg-[#fcf8e3]', text: 'text-[#8a6d3b]' },
  { bg: 'bg-[#f4f7f6]', text: 'text-[#3a4f41]' }
];

const Avatar = ({ src, name, fallbackText, size = "md" }) => {
  
  const sizeClasses = {
    sm: "w-8 h-8 text-xs font-medium",
    md: "w-12 h-12 text-sm font-semibold",
    lg: "w-20 h-20 text-xl font-semibold",
    xl: "w-24 h-24 text-2xl font-bold"
  }[size] || "w-12 h-12 text-sm";

  const getInitials = () => {
    const targetString = (name || fallbackText || "").trim();
    if (!targetString) return "?";

    if (!isNaN(targetString.charAt(0))) {
      return targetString.slice(0, 2);
    }

    const parts = targetString.split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }

    if (targetString.length >= 2) {
      return targetString.slice(0, 2).toUpperCase();
    }

    return targetString.charAt(0).toUpperCase();
  };

  const getColorTheme = () => {
    const identifier = name || fallbackText || "default";
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
  };

  if (src) {
    return (
      <div className={`${sizeClasses} rounded-full overflow-hidden flex-shrink-0 bg-[#e9edef]`}>
        <img 
          src={src} 
          alt={name || "User Profile"} 
          className="w-full h-full object-cover select-none"
          onError={(e) => { 
            e.target.style.display = 'none'; 
          }} 
        />
      </div>
    );
  }

  const theme = getColorTheme();
  
  return (
    <div className={`${sizeClasses} rounded-full flex items-center justify-center select-none flex-shrink-0 ${theme.bg} ${theme.text}`}>
      {getInitials()}
    </div>
  );
};

export default Avatar;