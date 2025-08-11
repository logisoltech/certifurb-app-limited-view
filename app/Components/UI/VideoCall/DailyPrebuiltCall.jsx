'use client';

import React, { useEffect, useRef, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';

const DailyPrebuiltCall = ({ sessionId, userEmail, targetUserEmail, isAgent = false, onCallEnd }) => {
  const callFrameRef = useRef(null);
  const [roomUrl, setRoomUrl] = useState(null);
  const [callFrame, setCallFrame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create room using Daily.co REST API directly
  const createRoom = async () => {
    try {
      console.log('🏠 Creating Daily.co room directly via API...');
      
      const roomName = `livestore-${sessionId}-${Date.now()}`;
      const DAILY_API_KEY = '27281fe8c466d46acfeef75346e6d404b23dab1dea61c3d421dfb51ac449de39';
      
      const response = await fetch('https://api.daily.co/v1/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DAILY_API_KEY}`,
        },
        body: JSON.stringify({
          name: roomName,
          properties: {
            max_participants: 2,
            enable_chat: false,
            enable_screenshare: true,
            enable_recording: false,
            exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.info || 'Failed to create room');
      }

      const roomData = await response.json();
      console.log('✅ Room created:', roomData);
      
      return roomData.url;
    } catch (error) {
      console.error('❌ Error creating room:', error);
      throw error;
    }
  };

  // Initialize Daily.co call
  useEffect(() => {
    const initCall = async () => {
      try {
        setIsLoading(true);
        
        // Create room
        const url = await createRoom();
        setRoomUrl(url);
        
        // Create call frame with prebuilt UI
        const frame = DailyIframe.createFrame(callFrameRef.current, {
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '8px',
          },
          showLeaveButton: true,
          showFullscreenButton: true,
        });
        
        setCallFrame(frame);
        
        // Event listeners
        frame.on('joined-meeting', () => {
          console.log('✅ Joined meeting');
          setIsLoading(false);
        });
        
        frame.on('left-meeting', () => {
          console.log('🚪 Left meeting');
          if (onCallEnd) onCallEnd();
        });
        
        frame.on('error', (error) => {
          console.error('❌ Daily.co error:', error);
          setError(error.errorMsg || 'Call error occurred');
          setIsLoading(false);
        });
        
        // Join the room
        await frame.join({
          url: url,
          userName: userEmail,
          startVideoOff: !isAgent, // Agents start with video on
          startAudioOff: false,
        });
        
      } catch (error) {
        console.error('❌ Error initializing call:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    initCall();

    // Cleanup
    return () => {
      if (callFrame) {
        callFrame.destroy();
      }
    };
  }, [sessionId, userEmail, targetUserEmail, isAgent, onCallEnd]);

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Call Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => onCallEnd && onCallEnd()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Live Store Video Call</h2>
          <p className="text-sm text-gray-300">
            {isAgent ? `Helping: ${targetUserEmail}` : `Agent: ${targetUserEmail}`}
          </p>
        </div>
        <button
          onClick={() => {
            if (callFrame) callFrame.leave();
          }}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
        >
          End Call
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-10">
          <div className="bg-white p-8 rounded-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700">Setting up video call...</p>
          </div>
        </div>
      )}

      {/* Daily.co Prebuilt UI */}
      <div className="flex-1 relative">
        <div
          ref={callFrameRef}
          className="w-full h-full"
          style={{ minHeight: '500px' }}
        />
      </div>
    </div>
  );
};

export default DailyPrebuiltCall; 