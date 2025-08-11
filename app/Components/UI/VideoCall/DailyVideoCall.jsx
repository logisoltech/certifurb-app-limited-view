'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useDailyContext } from '../../../context/DailyContext';

const DailyVideoCall = ({ sessionId, userEmail, targetUserEmail, isAgent = false, onCallEnd }) => {
  const {
    dailyCall,
    roomUrl,
    roomName,
    isJoined,
    isConnecting,
    connectionState,
    localParticipant,
    remoteParticipants,
    isLocalVideoEnabled,
    isLocalAudioEnabled,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
    toggleVideo,
    toggleAudio,
  } = useDailyContext();

  const [isInitialized, setIsInitialized] = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Initialize room and join call
  useEffect(() => {
    const initializeCall = async () => {
      if (!dailyCall || !sessionId || !userEmail || !targetUserEmail || isInitialized) return;

      try {
        console.log('🎬 Initializing Daily.co call...', { sessionId, userEmail, targetUserEmail, isAgent });
        
        // Create room (only one participant needs to create it)
        if (!roomCreated) {
          console.log('🏠 Creating Daily.co room...');
          const roomData = await createRoom(sessionId, userEmail, targetUserEmail);
          setRoomCreated(true);
          
          // Wait a moment for room to be ready
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Join the room
          console.log('🚪 Joining Daily.co room...');
          await joinRoom(roomData.url, userEmail, isAgent);
          
          setIsInitialized(true);
        }
        
      } catch (error) {
        console.error('❌ Error initializing Daily.co call:', error);
      }
    };

    initializeCall();
  }, [dailyCall, sessionId, userEmail, targetUserEmail, isAgent, isInitialized, roomCreated, createRoom, joinRoom]);

  // Handle local video stream
  useEffect(() => {
    if (!dailyCall || !isJoined || !localParticipant) return;

    const updateLocalVideo = async () => {
      if (localVideoRef.current) {
        const videoTrack = localParticipant.videoTrack;
        if (videoTrack) {
          const stream = new MediaStream([videoTrack]);
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(console.error);
          console.log('📹 Local video stream assigned');
        }
      }
    };

    updateLocalVideo();
  }, [dailyCall, isJoined, localParticipant, localVideoRef]);

  // Handle remote video streams
  useEffect(() => {
    if (!dailyCall || !isJoined || !remoteVideoRef.current) return;

    const remoteParticipantsList = Object.values(remoteParticipants);
    if (remoteParticipantsList.length > 0) {
      const remoteParticipant = remoteParticipantsList[0]; // Get first remote participant
      const videoTrack = remoteParticipant.videoTrack;
      
      if (videoTrack) {
        const stream = new MediaStream([videoTrack]);
        remoteVideoRef.current.srcObject = stream;
        remoteVideoRef.current.play().catch(console.error);
        console.log('📹 Remote video stream assigned');
      }
    }
  }, [dailyCall, isJoined, remoteParticipants, remoteVideoRef]);

  // Auto-enable video for agents
  useEffect(() => {
    if (isAgent && isJoined && !isLocalVideoEnabled) {
      console.log('🎥 Auto-enabling video for agent');
      toggleVideo();
    }
  }, [isAgent, isJoined, isLocalVideoEnabled, toggleVideo]);

  const handleEndCall = async () => {
    try {
      await leaveRoom();
      // Call the parent's onCallEnd if provided
      if (onCallEnd) {
        onCallEnd();
      }
    } catch (error) {
      console.error('❌ Error ending call:', error);
    }
  };

  const remoteParticipantsList = Object.values(remoteParticipants);
  const hasRemoteParticipants = remoteParticipantsList.length > 0;

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Live Store Session (Daily.co)</h2>
          <p className="text-sm text-gray-300">
            {isAgent ? `Helping: ${targetUserEmail}` : `Agent: ${targetUserEmail}`}
          </p>
          <p className="text-xs text-gray-400">
            Status: {connectionState} | Room: {roomName}
          </p>
        </div>
        <button
          onClick={handleEndCall}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
        >
          ❌ End Call
        </button>
      </div>

      {/* Video Grid */}
      <div className="flex-1 flex">
        {/* Remote Video (Main) */}
        <div className="flex-1 relative bg-gray-800 flex items-center justify-center">
          {hasRemoteParticipants ? (
            <video
              ref={remoteVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted={false}
            />
          ) : (
            <div className="text-center text-white">
              <div className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">👤</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {isAgent ? targetUserEmail : "Agent"}
              </h3>
              <p className="text-gray-300">
                {isConnecting ? "Connecting..." : "Waiting to join..."}
              </p>
            </div>
          )}

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted={true}
            />
            <div className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
              You ({isLocalVideoEnabled ? 'Camera On' : 'Camera Off'})
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-80 bg-gray-800 text-white p-4 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Call Information</h3>
          
          {/* Camera Status */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Camera Status</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Your camera:</span>
                <span className={isLocalVideoEnabled ? 'text-green-400' : 'text-red-400'}>
                  {isLocalVideoEnabled ? 'On' : 'Off'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{isAgent ? 'Customer' : 'Agent'} camera:</span>
                <span className={hasRemoteParticipants ? 'text-green-400' : 'text-yellow-400'}>
                  {hasRemoteParticipants ? 'Connected' : 'Waiting'}
                </span>
              </div>
            </div>
          </div>

          {/* Audio Status */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Audio Status</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Your microphone:</span>
                <span className={isLocalAudioEnabled ? 'text-green-400' : 'text-red-400'}>
                  {isLocalAudioEnabled ? 'On' : 'Off'}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-2">
            <button
              onClick={toggleVideo}
              className={`w-full py-2 px-4 rounded-lg font-medium ${
                isLocalVideoEnabled
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isLocalVideoEnabled ? '📹 Turn Off Camera' : '📹 Turn On Camera'}
            </button>
            
            <button
              onClick={toggleAudio}
              className={`w-full py-2 px-4 rounded-lg font-medium ${
                isLocalAudioEnabled
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isLocalAudioEnabled ? '🎤 Mute Microphone' : '🎤 Unmute Microphone'}
            </button>
          </div>

          {/* Live Store Info */}
          <div className="mt-6 p-3 bg-green-900 rounded-lg">
            <h4 className="text-sm font-medium mb-1">Live Store Active</h4>
            <p className="text-xs text-green-300">
              {isAgent
                ? 'You can help the customer browse products live from our store.'
                : 'The agent can show you products live from our store.'}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-900 rounded-lg">
              <h4 className="text-sm font-medium mb-1">Error</h4>
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {/* Debug Info */}
          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            <h4 className="text-sm font-medium mb-1">Debug Info</h4>
            <div className="text-xs text-gray-300 space-y-1">
              <div>Room URL: {roomUrl ? '✅ Created' : '❌ Not created'}</div>
              <div>Joined: {isJoined ? '✅ Yes' : '❌ No'}</div>
              <div>Participants: {Object.keys(remoteParticipants).length + (isJoined ? 1 : 0)}</div>
              <div>Connection: {connectionState}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyVideoCall; 