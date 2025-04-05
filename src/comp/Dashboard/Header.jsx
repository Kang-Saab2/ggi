import React from 'react';
import { Search, Bell, Menu, ChevronLeft } from 'lucide-react';

const Header = ({ userData, toggleSidebar, isSidebarCollapsed }) => {
  return (
    <header className={`bg-white border-b border-gray-200 p-4 flex justify-between items-center fixed top-0 right-0 left-0 z-10 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
      <div className="flex items-center">
        <button
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          onClick={toggleSidebar}
        >
          {isSidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
        
        <div className="relative ml-2">
          <Search className="absolute top-2 left-2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
          />
        </div>
      </div>
      
      <div className="flex items-center">
        <button className="relative mr-4">
          <Bell className="text-gray-500" size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
          {userData.name.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default Header; 