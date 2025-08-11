'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWebSocketUrl, getApiUrl, getFrontendOrigins } from '../config/environment';
import { useAuth } from '../cms/context/AuthContext';

const LiveStoreContext = createContext();

export function LiveStoreProvider({ children }) {
  const { user: cmsUser } = useAuth();
  const [regularUser, setRegularUser] = useState(null);
  
  // Check for regular user authentication
  useEffect(() => {
    const checkRegularAuth = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser && (parsedUser.userId || parsedUser.useremail || parsedUser.email)) {
            setRegularUser(parsedUser);
          } else {
            setRegularUser(null);
          }
        } else {
          setRegularUser(null);
        }
      } catch (error) {
        console.error('Error parsing regular user data:', error);
        setRegularUser(null);
      }
    };

    checkRegularAuth();

    // Listen for storage changes (login/logout events)
    const handleStorageChange = () => {
      checkRegularAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  // Use regular user if available, otherwise fall back to CMS user
  const user = regularUser || cmsUser;
  
  // Connection states
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('idle'); // idle, connecting, connected, no_agents, error
  const [showConnectionPopup, setShowConnectionPopup] = useState(false);
  const [showAgentNotification, setShowAgentNotification] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  
  // Call participants
  const [currentCall, setCurrentCall] = useState(null);
  const [incomingRequest, setIncomingRequest] = useState(null);
  
  // WebSocket connection
  const [socket, setSocket] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  useEffect(() => {
    // Check if Socket.IO client is available
    if (typeof window !== 'undefined') {
      // Only initialize WebSocket connection if user is logged in and has valid email
      if (user && (user.useremail || user.email || user.Email)) {
        // console.log('Initializing WebSocket for user:', user);
        initializeWebSocket();
      } else if (user) {
        // console.log('User object exists but no valid email found:', user);
        // console.log('Available user fields:', Object.keys(user));
      }
    }
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  const initializeWebSocket = () => {
    try {
      // Check if socket.io-client is available
      if (typeof window === 'undefined') return;
      
      // Dynamically import socket.io-client to avoid SSR issues
      import('socket.io-client').then(({ io }) => {
        const newSocket = io(getWebSocketUrl(), {
          cors: {
            origin: getFrontendOrigins(),
            methods: ["GET", "POST"]
          },
          timeout: 5000,
          autoConnect: true
        });

        newSocket.on('connect', () => {
          // console.log('🔗 Connected to WebSocket server - Socket ID:', newSocket.id);
          // console.log('Full user object for WebSocket:', user);
          // console.log('User object keys:', user ? Object.keys(user) : 'no user');
          setIsBackendConnected(true);
          
          // Register user/agent using email
          const userEmail = user?.useremail || user?.email || user?.Email;
          const isAgent = user?.isAgent === true || user?.isAgent === 'true' || user?.isAgent === 'True' || user?.isAgent === 'TRUE' || user?.isAgent === '1';
          
          // console.log('WebSocket registration data:', { userEmail, isAgent, userObject: user });
          // console.log('🔍 isAgent check details:', {
          //   'user.isAgent': user?.isAgent,
          //   'typeof user.isAgent': typeof user?.isAgent,
          //   'final isAgent value': isAgent,
          //   'full user object': user,
          //   'user object keys': user ? Object.keys(user) : 'no user'
          // });
          
          if (userEmail) {
            newSocket.emit('register-user', {
              UserEmail: userEmail,
              isAgent: isAgent
            });
            // console.log('✅ User registered with WebSocket:', { userEmail, isAgent });
            if (isAgent) {
              // console.log('🎯 AGENT REGISTERED! This user is an agent and should be available for Live Store connections.');
            } else {
              // console.log('👤 Regular user registered.');
            }
          } else {
            console.error('❌ Cannot register user: No valid userEmail found');
            console.error('Available user fields:', user ? Object.keys(user) : 'no user object');
          }
        });

        newSocket.on('connect_error', (error) => {
          // console.log('WebSocket connection failed:', error);
          setIsBackendConnected(false);
        });

        // Connection request will be handled directly

            // Agent receives connection request
    newSocket.on('connection-request', (data) => {
      // console.log('📥 Received connection-request event:', data);
      const isUserAgent = user?.isAgent === true || user?.isAgent === 'true' || user?.isAgent === 'True' || user?.isAgent === 'TRUE' || user?.isAgent === '1';
      // console.log('🔍 Agent check:', { isUserAgent, userIsAgent: user?.isAgent });
      
      if (isUserAgent) {
            // console.log('✅ Agent showing notification popup');
            setIncomingRequest({
              requestId: data.requestId,
              userEmail: data.userEmail,
              userName: data.userName,
              timestamp: data.timestamp
            });
            setShowAgentNotification(true);
          } else {
            // console.log('❌ User is not an agent, ignoring connection request');
          }
        });

                    // User receives connection acceptance
    newSocket.on('connection-accepted', (data) => {
      // console.log('🎉 Received connection-accepted event:', data);
      
      const isUserAgent = user?.isAgent === true || user?.isAgent === 'true' || user?.isAgent === 'True' || user?.isAgent === 'TRUE' || user?.isAgent === '1';
      // console.log('🔍 User agent check:', { isUserAgent, userIsAgent: user?.isAgent });
      
      if (!isUserAgent) {
        // console.log('✅ User connection accepted, setting up call...');
        setConnectionStatus('connected');
        
        setTimeout(() => {
          // console.log('📺 Opening video call interface...');
          setShowConnectionPopup(false);
          setShowVideoCall(true);
          
          const callData = {
            userEmail: user?.useremail || user?.email || user?.Email,
            userName: user?.username || user?.name || user?.Name || 'User',
            agentEmail: data.agentEmail,
            agentName: data.agentName,
            sessionId: data.sessionId,
            startTime: new Date(),
          };
          
          // console.log('✅ User setting call data:', callData);
          setCurrentCall(callData);
          
          // Note: Backend will automatically send call-connected event
          //  console.log('⏳ Waiting for call-connected event from backend...');
          
        }, 1500);
      } else {
        // console.log('✅ Agent connection accepted, updating call data with sessionId...');
        
        // Update the current call with the sessionId from backend
        if (currentCall) {
          const updatedCallData = {
            ...currentCall,
            sessionId: data.sessionId,
          };
          
          // console.log('✅ Agent updating call data with sessionId:', updatedCallData);
          setCurrentCall(updatedCallData);
        } else if (incomingRequest) {
          // Fallback: create call data if currentCall doesn't exist yet
          const callData = {
            userEmail: incomingRequest.userEmail,
            userName: incomingRequest.userName,
            agentEmail: user?.useremail || user?.email || user?.Email,
            agentName: user?.username || user?.name || user?.Name || 'Agent',
            startTime: new Date(),
            sessionId: data.sessionId,
          };
          
          // console.log('✅ Agent creating call data with sessionId (fallback):', callData);
          setCurrentCall(callData);
        } else {
          // console.error('❌ Agent received connection-accepted but no current call or incoming request');
        }
      }
    });

            // User receives connection declined
    newSocket.on('connection-declined', (data) => {
      const isUserAgent = user?.isAgent === true || user?.isAgent === 'true' || user?.isAgent === 'True' || user?.isAgent === 'TRUE' || user?.isAgent === '1';
      if (!isUserAgent) {
            setConnectionStatus('no_agents');
            setTimeout(() => {
              setShowConnectionPopup(false);
              setConnectionStatus('idle');
            }, 3000);
          }
        });

        // Call ended
        newSocket.on('call-ended', (data) => {
          setShowVideoCall(false);
          setCurrentCall(null);
          setConnectionStatus('idle');
        });

        newSocket.on('disconnect', () => {
          // console.log('🔌 Disconnected from WebSocket server - Socket ID:', newSocket.id);
          setIsBackendConnected(false);
        });

        // console.log('🔄 Setting new socket instance - Socket ID:', newSocket.id);
        setSocket(newSocket);
      }).catch(error => {
        // console.log('Socket.IO not available, using mock mode:', error);
        setIsBackendConnected(false);
      });
      
    } catch (error) {
      // console.log('WebSocket initialization failed:', error);
      setIsBackendConnected(false);
    }
  };

  const requestConnection = async () => {
    // console.log('Full user object:', user);
    // console.log('User keys:', user ? Object.keys(user) : 'no user');
    
    if (!user) {
      alert('Please log in to use Live Store');
      return;
    }

    const userEmail = user?.useremail || user?.email || user?.Email;
    const userName = user?.username || user?.name || user?.Name || 'User';
    
    // console.log('Extracted values:', { userEmail, userName });
    
    if (!userEmail) {
      alert('User email not found. Please log out and log back in.');
      console.error('User object missing email field:', user);
      return;
    }

    setIsConnecting(true);
    setConnectionStatus('connecting');
    setShowConnectionPopup(true);

    try {
      // Check for available agents
      const response = await fetch(getApiUrl('/api/live-store/request-connection'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: userEmail,
          userName: userName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (!data.agentsAvailable) {
          setConnectionStatus('no_agents');
          setTimeout(() => {
            setShowConnectionPopup(false);
            setConnectionStatus('idle');
          }, 3000);
        } else {
          // Agents are available, trigger WebSocket connection request
          // console.log('🎯 Agents available, sending WebSocket request...');
          // console.log('🔍 Socket state check:', {
          //   hasSocket: !!socket,
          //   isConnected: socket?.connected,
          //   socketId: socket?.id,
          //   readyState: socket?.readyState
          // });
          
          if (socket && socket.connected) {
            // console.log('📤 Sending request-connection event...');
            socket.emit('request-connection', { userEmail, userName });
            // console.log('✅ request-connection event sent!');
          } else {
            console.error('❌ WebSocket not connected when trying to send request');
            console.error('Socket details:', {
              hasSocket: !!socket,
              isConnected: socket?.connected,
              socketId: socket?.id
            });
            
            // Try to wait a bit and retry
            // console.log('🔄 Retrying connection request in 1 second...');
            setTimeout(() => {
              console.log('🔄 Retry attempt - Socket state:', {
                hasSocket: !!socket,
                isConnected: socket?.connected,
                socketId: socket?.id
              });
              
              if (socket && socket.connected) {
                // console.log('📤 Retry: Sending request-connection event...');
                socket.emit('request-connection', { userEmail, userName });
                // console.log('✅ Retry: request-connection event sent!');
              } else {
                console.error('❌ Retry failed: Socket still not connected');
                setConnectionStatus('error');
              }
            }, 1000);
          }
        }
      } else {
        setConnectionStatus('no_agents');
        setTimeout(() => {
          setShowConnectionPopup(false);
          setConnectionStatus('idle');
        }, 3000);
      }
    } catch (error) {
      console.error('Connection request failed:', error);
      setConnectionStatus('error');
      setTimeout(() => {
        setShowConnectionPopup(false);
        setConnectionStatus('idle');
      }, 3000);
    } finally {
      setIsConnecting(false);
    }
  };

  const acceptConnection = () => {
    // console.log('🤝 Agent accepting connection...', { incomingRequest, hasSocket: !!socket });
    
    if (incomingRequest && socket) {
      // console.log('📤 Sending accept-connection event:', { requestId: incomingRequest.requestId });
      
      socket.emit('accept-connection', {
        requestId: incomingRequest.requestId
      });
      
      setShowAgentNotification(false);
      setShowVideoCall(true);
      
      const callData = {
        userEmail: incomingRequest.userEmail,
        userName: incomingRequest.userName,
        agentEmail: user?.useremail || user?.email || user?.Email,
        agentName: user?.username || user?.name || user?.Name || 'Agent',
        startTime: new Date(),
        sessionId: null, // Will be updated when connection-accepted event is received
      };
      
      // console.log('✅ Agent setting initial call data (sessionId will be added later):', callData);
      setCurrentCall(callData);
      
      // console.log('⏳ Agent waiting for connection-accepted event with sessionId...');
      
    } else {
      console.error('❌ Cannot accept connection:', { 
        hasIncomingRequest: !!incomingRequest, 
        hasSocket: !!socket 
      });
    }
  };

  const declineConnection = () => {
    if (incomingRequest && socket) {
      socket.emit('decline-connection', {
        requestId: incomingRequest.requestId
      });
    }
    
    setShowAgentNotification(false);
    setIncomingRequest(null);
  };

  const endCall = () => {
    if (currentCall && socket) {
      socket.emit('end-call', {
        sessionId: currentCall.sessionId
      });
    }
    
    setShowVideoCall(false);
    setCurrentCall(null);
    setIncomingRequest(null);
    setConnectionStatus('idle');
  };

  const closeConnectionPopup = () => {
    setShowConnectionPopup(false);
    setConnectionStatus('idle');
    setIsConnecting(false);
  };

  const value = {
    // States
    isConnecting,
    connectionStatus,
    showConnectionPopup,
    showAgentNotification,
    showVideoCall,
    currentCall,
    incomingRequest,
    socket,
    isBackendConnected,
    
    // Actions
    requestConnection,
    acceptConnection,
    declineConnection,
    endCall,
    closeConnectionPopup,
    
    // User info
    isAgent: user?.isAgent === true || user?.isAgent === 'true' || user?.isAgent === 'True' || user?.isAgent === 'TRUE' || user?.isAgent === '1',
    user,
    // Debug info
    userHasValidEmail: !!(user?.useremail || user?.email || user?.Email),
  };

  return (
    <LiveStoreContext.Provider value={value}>
      {children}
    </LiveStoreContext.Provider>
  );
}

export function useLiveStore() {
  const context = useContext(LiveStoreContext);
  if (context === undefined) {
    throw new Error('useLiveStore must be used within a LiveStoreProvider');
  }
  return context;
}

// Mock API endpoint for checking agent availability
// You'll implement this in your backend
export const checkAgentAvailability = async () => {
  // Mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        agentsAvailable: Math.random() > 0.3, // 70% chance agents are available
        agentId: 'agent-123',
        agentName: 'Agent Smith',
      });
    }, 1000);
  });
}; 