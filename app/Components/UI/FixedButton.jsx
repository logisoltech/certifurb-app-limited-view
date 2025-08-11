'use client';

import React from 'react';
import { font } from '../Font/font';
import { useLiveStore } from '../../context/LiveStoreContext';

const FixedButton = () => {
  const { requestConnection, isConnecting, user } = useLiveStore();

  const handleClick = () => {
    console.log('Live Store button clicked. User:', user);
    
    if (!user) {
      console.log('No user found in auth context');
      alert('Please log in to use Live Store');
      return;
    }
    
    if (!isConnecting) {
      requestConnection();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isConnecting}
      className={`${font.className} fixed bottom-6 left-6 z-50 custom-green-bg hover:bg-green-400 text-white font-semibold py-3 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
      style={{
        zIndex: 999999,
      }}
      title="View Products Live"
    >
      {isConnecting ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Connecting...</span>
        </div>
      ) : (
        'Live Store'
      )}
    </button>
  );
};

export default FixedButton; 