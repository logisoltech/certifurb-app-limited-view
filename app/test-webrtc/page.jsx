'use client';

import React, { useState } from 'react';
import { LiveStoreProvider } from '../context/LiveStoreContext';
import VideoCallInterface from '../Components/UI/VideoCall/VideoCallInterface';

const TestWebRTCPage = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [testConfig, setTestConfig] = useState({
    sessionId: 'webrtc-test-' + Date.now(),
    userEmail: 'testuser@example.com',
    agentEmail: 'testagent@example.com',
    isAgent: false,
  });

  const startCall = () => {
    console.log('🎬 Starting WebRTC call test...', testConfig);
    setIsCallActive(true);
  };

  const endCall = () => {
    console.log('🏁 Ending WebRTC call test...');
    setIsCallActive(false);
  };

  const toggleRole = () => {
    setTestConfig(prev => ({ ...prev, isAgent: !prev.isAgent }));
  };

  if (isCallActive) {
    return (
      <LiveStoreProvider>
        <VideoCallInterface
          isVisible={true}
          sessionId={testConfig.sessionId}
          userEmail={testConfig.userEmail}
          agentEmail={testConfig.agentEmail}
          isAgent={testConfig.isAgent}
          onClose={endCall}
        />
      </LiveStoreProvider>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">WebRTC Video Call Test</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Session ID</label>
            <input
              type="text"
              value={testConfig.sessionId}
              onChange={(e) => setTestConfig(prev => ({ ...prev, sessionId: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">User Email</label>
            <input
              type="email"
              value={testConfig.userEmail}
              onChange={(e) => setTestConfig(prev => ({ ...prev, userEmail: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Agent Email</label>
            <input
              type="email"
              value={testConfig.agentEmail}
              onChange={(e) => setTestConfig(prev => ({ ...prev, agentEmail: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Role:</span>
            <button
              onClick={toggleRole}
              className={`px-4 py-2 rounded-lg font-medium ${
                testConfig.isAgent
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {testConfig.isAgent ? '👨‍💼 Agent' : '👤 Customer'}
            </button>
          </div>
          
          <button
            onClick={startCall}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            📹 Start WebRTC Call
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">🎯 Custom WebRTC Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Custom video calling interface</li>
            <li>• Socket.IO real-time communication</li>
            <li>• Peer-to-peer WebRTC connections</li>
            <li>• Camera/microphone controls</li>
            <li>• Live Store integration ready</li>
          </ul>
        </div>
        
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">✅ Ready Components:</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• VideoCallInterface.jsx</li>
            <li>• LiveStoreContext.js</li>
            <li>• webrtc.js utilities</li>
            <li>• Backend Socket.IO handlers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestWebRTCPage; 