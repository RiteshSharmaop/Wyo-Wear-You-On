import React, { useState } from 'react';
import { User, Image, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} h-screen border-l ${isDark ? 'border-gray-700' : 'border-gray-200'} flex flex-col ml-auto`}>
      {/* Logo Section */}
      <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-800'} flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">FA</span>
            </div>
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>FashionApp</span>
          </div>
        )}
        {isCollapsed && (
          <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-800'} flex items-center justify-center mx-auto`}>
            <span className="text-white font-bold text-sm">FA</span>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-3">
        {/* Show Image Button */}
        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>
          <Image size={20} />
          {!isCollapsed && <span className="font-medium">My Photo</span>}
        </button>

        {/* Profile Button */}
        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>
          <User size={20} />
          {!isCollapsed && <span className="font-medium">Profile</span>}
        </button>
      </div>

      {/* Bottom Section - Theme Toggle and Collapse */}
      <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} space-y-3`}>
        {/* Theme Toggle */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          {!isCollapsed && <span className="font-medium">{isDark ? 'Light' : 'Dark'}</span>}
        </button>

        {/* Collapse Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
        >
          {isCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          {!isCollapsed && <span className="font-medium ml-3">Collapse</span>}
        </button>
      </div>
    </div>
  );
}