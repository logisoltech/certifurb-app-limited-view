import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MagnifyingGlassIcon,
  SunIcon,  
  BellIcon,
  Squares2X2Icon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { Geist } from "next/font/google";
import NotificationDropdown from '../UI/NotificationDropdown';

const font = Geist({
  subsets: ["latin"],
});

const Navbar = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const cmsUser = localStorage.getItem('cmsUser');
    if (cmsUser) {
      setUser(JSON.parse(cmsUser));
    }
  }, []);

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.removeItem('cmsUser');
    localStorage.clear();
    
    // Reset user state
    setUser(null);
    
    // Redirect to CMS login page
    router.push('/cms');
  };
  return (
    <nav className={`${font.className} bg-white border-b border-gray-200 px-4 py-3`}>
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <img 
            src="/certifurb.png" 
            alt="Certifurb Logo" 
            className="h-8 w-auto"
          />
          {/* <span className="text-xl font-semibold text-gray-800">certifurb</span> */}
        </div>

        {/* Search Bar - Center */}
        <div className="flex-1 max-w-lg mx-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          {/* <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <SunIcon className="h-5 w-5" />
          </button> */}

          {/* Notifications */}
          <NotificationDropdown />

          {/* Apps Grid */}
          {/* <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Squares2X2Icon className="h-5 w-5" />
          </button> */}

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role || 'Role'}
              </p>
            </div>
            <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
              <UserCircleIcon className="h-8 w-8" />
            </button>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;