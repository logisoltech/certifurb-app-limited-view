'use client';

import React from 'react';
import { font } from '../../Font/font';

const ConnectionRequestPopup = ({ isOpen, onClose, status }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999999]">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          <div className="mb-4">
            {status === 'connecting' && (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <h3 className={`${font.className} text-xl font-semibold text-gray-800 mb-2`}>
                  Connecting to Live Store
                </h3>
                <p className="text-gray-600">
                  An agent will connect with you shortly...
                </p>
              </>
            )}
            
            {status === 'connected' && (
              <>
                <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className={`${font.className} text-xl font-semibold text-gray-800 mb-2`}>
                  Agent Connected!
                </h3>
                <p className="text-gray-600">
                  Starting video call...
                </p>
              </>
            )}
            
            {status === 'no_agents' && (
              <>
                <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className={`${font.className} text-xl font-semibold text-gray-800 mb-2`}>
                  No Agents Available
                </h3>
                <p className="text-gray-600">
                  All our agents are currently busy. Please try again later.
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="h-12 w-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className={`${font.className} text-xl font-semibold text-gray-800 mb-2`}>
                  Connection Error
                </h3>
                <p className="text-gray-600 mb-3">
                  Unable to connect to Live Store service. Please try again later.
                </p>
                <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                  <p><strong>For developers:</strong></p>
                  <p>• Make sure backend server is running</p>
                  <p>• Install dependencies: <code>npm install</code></p>
                  <p>• Check console for more details</p>
                </div>
              </>
            )}
          </div>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className={`${font.className} px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors`}
            >
              {status === 'connecting' ? 'Cancel' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionRequestPopup; 