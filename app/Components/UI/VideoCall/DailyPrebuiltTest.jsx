'use client';

import React, { useState } from 'react';
import DailyPrebuiltCall from './DailyPrebuiltCall';

const DailyPrebuiltTest = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [testConfig, setTestConfig] = useState({
    sessionId: 'test-session-' + Date.now(),
    userEmail: 'testuser@example.com',
    targetUserEmail: 'testagent@example.com',
    isAgent: false,
  });

  const startCall = () => {
    console.log('🎬 Starting Daily.co prebuilt call...', testConfig);
    setIsCallActive(true);
  };

  const endCall = () => {
    console.log('🏁 Ending Daily.co prebuilt call...');
    setIsCallActive(false);
  };

  const toggleRole = () => {
    setTestConfig(prev => ({ ...prev, isAgent: !prev.isAgent }));
  };

  if (isCallActive) {
    return (
      <DailyPrebuiltCall
        sessionId={testConfig.sessionId}
        userEmail={testConfig.userEmail}
        targetUserEmail={testConfig.targetUserEmail}
        isAgent={testConfig.isAgent}
        onCallEnd={endCall}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Daily.co Prebuilt Video Call</h1>
        
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
            <label className="block text-sm font-medium mb-2">Your Email</label>
            <input
              type="email"
              value={testConfig.userEmail}
              onChange={(e) => setTestConfig(prev => ({ ...prev, userEmail: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Target Email</label>
            <input
              type="email"
              value={testConfig.targetUserEmail}
              onChange={(e) => setTestConfig(prev => ({ ...prev, targetUserEmail: e.target.value }))}
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
            📹 Start Video Call (Prebuilt UI)
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">✅ Ready to Use:</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Uses Daily.co's built-in prebuilt UI</li>
            <li>• No backend configuration needed</li>
            <li>• Direct API calls to Daily.co</li>
            <li>• Professional video interface</li>
          </ul>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">🎯 Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Built-in camera/microphone controls</li>
            <li>• Screen sharing capability</li>
            <li>• Professional video quality</li>
            <li>• Mobile responsive design</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DailyPrebuiltTest; 