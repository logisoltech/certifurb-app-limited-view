'use client';

import React from 'react';
import { font } from '../../Font/font';

const AgentNotificationPopup = ({ isOpen, onAccept, onDecline, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999999]">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl border-l-4 border-green-500">
        <div className="text-center">
          <div className="mb-4">
            <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className={`${font.className} text-xl font-semibold text-gray-800 mb-2`}>
              Live Store Request
            </h3>
            <p className="text-gray-600 mb-1">
              <strong>{userName || 'A customer'}</strong> wants to connect for live shopping assistance
            </p>
            <p className="text-sm text-gray-500">
              Accept to start a video call
            </p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={onDecline}
              className={`${font.className} px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Decline
            </button>
            <button
              onClick={onAccept}
              className={`${font.className} px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentNotificationPopup; 