'use client';

import React, { useState } from 'react';
import { useLiveStore } from '../../context/LiveStoreContext';
import { font } from '../Font/font';

const TestingPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { 
    socket, 
    isBackendConnected, 
    pendingRequests,
    simulateAgentResponse,
    user,
    connectionStatus,
    currentCall,
    userHasValidId
  } = useLiveStore();

  const [testMode, setTestMode] = useState(false);

  const simulateAgentAccept = () => {
    if (socket && connectionStatus === 'connecting') {
      // Directly trigger the frontend event handler
      const mockData = {
        sessionId: `test_session_${Date.now()}`,
        agentId: 'test_agent_123',
        agentName: 'Test Agent'
      };
      
      // Simulate receiving the event from backend
      setTimeout(() => {
        if (socket.listeners && socket.listeners('connection-accepted')) {
          // Try to manually trigger the handler
          const handlers = socket.listeners('connection-accepted');
          handlers.forEach(handler => handler(mockData));
        } else {
          // Fallback: emit to ourselves
          socket.emit('connection-accepted', mockData);
        }
        console.log('Simulated agent accept:', mockData);
      }, 1000); // Delay to simulate real response time
    }
  };

  const simulateAgentDecline = () => {
    if (socket && connectionStatus === 'connecting') {
      // Directly trigger the frontend event handler
      const mockData = {
        message: 'Agent is currently unavailable'
      };
      
      setTimeout(() => {
        if (socket.listeners && socket.listeners('connection-declined')) {
          const handlers = socket.listeners('connection-declined');
          handlers.forEach(handler => handler(mockData));
        } else {
          socket.emit('connection-declined', mockData);
        }
        console.log('Simulated agent decline:', mockData);
      }, 1000);
    }
  };

  const simulateIncomingRequest = () => {
    if (socket && user?.isAgent) {
      socket.emit('connection-request', {
        requestId: `test_req_${Date.now()}`,
        userId: 'test_user_123',
        userName: 'Test Customer',
        timestamp: new Date()
      });
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-32 left-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors z-50"
        title="Open Testing Panel"
      >
        🧪 Test Panel
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border-2 border-gray-300 rounded-lg p-4 shadow-lg max-w-sm z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className={`${font.className} font-bold text-gray-800`}>Live Store Testing</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Status Info */}
      <div className="mb-4 text-sm">
        <div className={`flex items-center gap-2 mb-1 ${isBackendConnected ? 'text-green-600' : 'text-red-600'}`}>
          <div className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          Backend: {isBackendConnected ? 'Connected' : 'Disconnected'}
        </div>
        <div className={`text-sm ${userHasValidId ? 'text-green-600' : 'text-red-600'}`}>
          User ID: {user?.id || user?.Id || user?.ID || user?.userId || user?.UserId || 'None'} {userHasValidId ? '✅' : '❌'}
        </div>
        <div className="text-gray-600">
          User Type: {user?.isAgent === true || user?.isAgent === 'true' || user?.isAgent === 'True' || user?.isAgent === 'TRUE' ? 'Agent ✅' : 'Customer 👤'}
        </div>
        <div className="text-gray-600">
          User Name: {user?.name || user?.email || 'Not logged in'}
        </div>
        <div className="text-gray-600">
          Status: {connectionStatus}
        </div>
        {currentCall && (
          <div className="text-blue-600">
            <div>Active Call: {currentCall.sessionId}</div>
            <div className="text-xs">
              With: {currentCall.userName || currentCall.agentName || 'Unknown'}
            </div>
          </div>
        )}
      </div>

      {/* Testing Controls */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-gray-700 mb-2">Test Actions:</div>
        
        {!user?.isAgent && (
          <div className="space-y-2">
            <div className="text-xs text-gray-500">Customer Actions:</div>
            <button
              onClick={simulateAgentAccept}
              className="w-full bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600"
              disabled={connectionStatus !== 'connecting'}
            >
              ✅ Simulate Agent Accept
            </button>
            <button
              onClick={simulateAgentDecline}
              className="w-full bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
              disabled={connectionStatus !== 'connecting'}
            >
              ❌ Simulate Agent Decline
            </button>
          </div>
        )}

        {user?.isAgent && (
          <div className="space-y-2">
            <div className="text-xs text-gray-500">Agent Actions:</div>
            <button
              onClick={simulateIncomingRequest}
              className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
            >
              📞 Simulate Incoming Request
            </button>
          </div>
        )}

        {/* Camera Testing */}
        <div className="border-t pt-2 mt-3">
          <div className="text-xs text-gray-500 mb-2">Camera Testing:</div>
          <button
            onClick={async () => {
              try {
                // Check if mediaDevices API is available
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                  alert('⚠️ Media Devices API Not Available\n\n' +
                        'Current URL: ' + window.location.href + '\n\n' +
                        'Camera/microphone access requires:\n' +
                        '• HTTPS connection, OR\n' +
                        '• localhost (127.0.0.1 or localhost)\n\n' +
                        'Solutions:\n' +
                        '• Access via http://localhost:3000\n' +
                        '• Set up HTTPS with SSL certificate\n\n' +
                        'Note: IP addresses (like 192.168.x.x) require HTTPS for media access.');
                  return;
                }

                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                alert('✅ Camera & Microphone permissions granted!\n\nCamera: ' + (stream.getVideoTracks().length > 0 ? 'Available' : 'Not available') + '\nMicrophone: ' + (stream.getAudioTracks().length > 0 ? 'Available' : 'Not available'));
                // Stop the stream after testing
                stream.getTracks().forEach(track => track.stop());
              } catch (error) {
                let errorMessage = '❌ Camera/Microphone access failed:\n\n';
                
                if (error.name === 'NotAllowedError') {
                  errorMessage += 'Permission denied by user.\n' +
                                'Please allow camera/microphone access and try again.';
                } else if (error.name === 'NotFoundError') {
                  errorMessage += 'No camera or microphone found.\n' +
                                'Please check device connections.';
                } else if (error.name === 'NotSupportedError') {
                  errorMessage += 'Media devices not supported in this browser.';
                } else {
                  errorMessage += error.message;
                }
                
                errorMessage += '\n\nCurrent URL: ' + window.location.href;
                errorMessage += '\nProtocol: ' + window.location.protocol;
                errorMessage += '\nMedia API Available: ' + (navigator.mediaDevices ? 'Yes' : 'No');
                
                alert(errorMessage);
                console.error('Media access error:', error);
              }
            }}
            className="w-full bg-purple-500 text-white px-3 py-2 rounded text-sm hover:bg-purple-600 mb-2"
          >
            📹 Test Camera Access
          </button>
          
          <button
            onClick={() => {
              if (socket && currentCall?.sessionId) {
                socket.emit('camera-state-changed', {
                  sessionId: currentCall.sessionId,
                  isVideoOn: true,
                  userType: user?.isAgent ? 'agent' : 'user'
                });
                console.log('🎥 Sent test camera ON signal');
                alert('📹 Test signal sent: Camera ON');
              } else {
                alert('❌ No active call session or WebSocket connection');
              }
            }}
            className="w-full bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 mb-1"
            disabled={!currentCall?.sessionId || !socket}
          >
            🟢 Test Camera ON Signal
          </button>
          
          <button
            onClick={() => {
              if (socket && currentCall?.sessionId) {
                socket.emit('camera-state-changed', {
                  sessionId: currentCall.sessionId,
                  isVideoOn: false,
                  userType: user?.isAgent ? 'agent' : 'user'
                });
                console.log('🎥 Sent test camera OFF signal');
                alert('📹 Test signal sent: Camera OFF');
              } else {
                alert('❌ No active call session or WebSocket connection');
              }
            }}
            className="w-full bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 mb-1"
            disabled={!currentCall?.sessionId || !socket}
          >
            🔴 Test Camera OFF Signal
          </button>
          
          <button
            onClick={() => {
              // Check video elements and streams
              const localVideo = document.querySelector('video[muted]'); // Local video is muted
              const remoteVideo = document.querySelector('video:not([muted])'); // Remote video is not muted
              
              const localStream = localVideo?.srcObject;
              const remoteStream = remoteVideo?.srcObject;
              
              console.log('📹 Video Elements Debug:', {
                localVideoElement: !!localVideo,
                remoteVideoElement: !!remoteVideo,
                localHasStream: !!localStream,
                remoteHasStream: !!remoteStream,
                localVideoTracks: localStream?.getVideoTracks().length || 0,
                remoteVideoTracks: remoteStream?.getVideoTracks().length || 0,
                localTrackEnabled: localStream?.getVideoTracks()[0]?.enabled,
                remoteTrackEnabled: remoteStream?.getVideoTracks()[0]?.enabled,
                localVideoPlaying: !localVideo?.paused && !localVideo?.ended && localVideo?.readyState > 2,
                remoteVideoPlaying: !remoteVideo?.paused && !remoteVideo?.ended && remoteVideo?.readyState > 2
              });
              
              alert('🔍 Video Debug Info logged to console\n\nCheck console for detailed video element and stream information.');
            }}
            className="w-full bg-indigo-500 text-white px-3 py-2 rounded text-sm hover:bg-indigo-600 mb-2"
          >
            🔍 Debug Video Elements
          </button>
        </div>

        {/* Debug Actions */}
        <div className="border-t pt-2 mt-3">
          <div className="text-xs text-gray-500 mb-2">Debug Actions:</div>
          <button
            onClick={async () => {
              const userId = user?.id || user?.Id || user?.ID || user?.userId || user?.UserId;
              if (userId) {
                try {
                  const response = await fetch(`https://api.certifurb.com/api/live-store/check-user/${userId}`);
                  const data = await response.json();
                  console.log('User check result:', data);
                  alert(`User Status:\nID: ${data.data.user?.Id}\nName: ${data.data.user?.Name}\nIs Agent: ${data.data.user?.isAgent}\nSocket Connected: ${data.data.isConnectedViaSocket}\nSocket Type: ${data.data.socketType}`);
                } catch (error) {
                  console.error('Error checking user:', error);
                  alert('Error checking user status. Check console.');
                }
              } else {
                alert('No user ID found');
              }
            }}
            className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 mb-2"
          >
            🔍 Check User Status
          </button>
          
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={testMode}
              onChange={(e) => setTestMode(e.target.checked)}
            />
            Auto-accept mode (for testing)
          </label>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-3 text-xs text-gray-500 border-t pt-2">
        <p><strong>Testing Tips:</strong></p>
        <p>• Use two browsers for full test</p>
        <p>• Chrome: Customer, Edge: Agent</p>
        <p>• Or use these simulate buttons</p>
      </div>
    </div>
  );
};

export default TestingPanel; 