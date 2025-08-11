'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import DailyIframe from '@daily-co/daily-js';

const DailyContext = createContext();

// Global singleton to prevent multiple instances
let globalDailyCall = null;

// Daily.co state management
const initialState = {
  // Daily.co specific state
  dailyCall: null,
  roomUrl: null,
  roomName: null,
  isJoined: false,
  isConnecting: false,
  
  // User and session info
  currentUser: null,
  sessionId: null,
  
  // Participants
  localParticipant: null,
  remoteParticipants: {},
  
  // Media states
  isLocalVideoEnabled: false,
  isLocalAudioEnabled: false,
  
  // Connection state
  connectionState: 'idle', // idle, connecting, connected, error
  error: null,
  
  // Agent/User roles
  isAgent: false,
  targetUserEmail: null,
};

const dailyReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DAILY_CALL':
      return { ...state, dailyCall: action.payload };
    
    case 'SET_ROOM_INFO':
      return { 
        ...state, 
        roomUrl: action.payload.roomUrl,
        roomName: action.payload.roomName 
      };
    
    case 'SET_CONNECTION_STATE':
      return { ...state, connectionState: action.payload };
    
    case 'SET_JOINING_STATE':
      return { ...state, isConnecting: action.payload };
    
    case 'SET_JOINED_STATE':
      return { ...state, isJoined: action.payload };
    
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    
    case 'SET_SESSION_ID':
      return { ...state, sessionId: action.payload };
    
    case 'SET_LOCAL_PARTICIPANT':
      return { ...state, localParticipant: action.payload };
    
    case 'UPDATE_REMOTE_PARTICIPANTS':
      return { ...state, remoteParticipants: action.payload };
    
    case 'SET_LOCAL_VIDEO':
      return { ...state, isLocalVideoEnabled: action.payload };
    
    case 'SET_LOCAL_AUDIO':
      return { ...state, isLocalAudioEnabled: action.payload };
    
    case 'SET_TARGET_USER':
      return { ...state, targetUserEmail: action.payload };
    
    case 'SET_IS_AGENT':
      return { ...state, isAgent: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
};

export const DailyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dailyReducer, initialState);

  // Initialize Daily.co call instance
  const createDailyCall = useCallback(() => {
    // Check if we already have a global call instance
    if (globalDailyCall) {
      console.log('🎬 Daily.co call instance already exists globally, using existing one');
      dispatch({ type: 'SET_DAILY_CALL', payload: globalDailyCall });
      return globalDailyCall;
    }
    
    // Check if we already have a local call instance
    if (state.dailyCall) {
      console.log('🎬 Daily.co call instance already exists locally, using existing one');
      globalDailyCall = state.dailyCall;
      return state.dailyCall;
    }
    
    console.log('🎬 Creating NEW Daily.co call instance...');
    const call = DailyIframe.createCallObject({
      videoSource: true,
      audioSource: true,
    });
    
    globalDailyCall = call;
    dispatch({ type: 'SET_DAILY_CALL', payload: call });
    return call;
  }, [state.dailyCall]);

  // Create a room via backend API
  const createRoom = useCallback(async (sessionId, userEmail, targetUserEmail) => {
    try {
      console.log('🏠 Creating Daily.co room...', { sessionId, userEmail, targetUserEmail });
      
      const response = await fetch('https://api.certifurb.com/api/daily/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          userEmail,
          targetUserEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      const roomData = await response.json();
      console.log('✅ Room created successfully:', roomData);
      
      dispatch({ 
        type: 'SET_ROOM_INFO', 
        payload: { 
          roomUrl: roomData.url, 
          roomName: roomData.name 
        } 
      });
      
      return roomData;
    } catch (error) {
      console.error('❌ Error creating room:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  // Join a Daily.co room
  const joinRoom = useCallback(async (roomUrl, userEmail, isAgent = false) => {
    try {
      console.log('🚪 Joining Daily.co room...', { roomUrl, userEmail, isAgent });
      
      if (!state.dailyCall) {
        console.error('❌ No Daily.co call instance available');
        return;
      }

      dispatch({ type: 'SET_JOINING_STATE', payload: true });
      dispatch({ type: 'SET_CONNECTION_STATE', payload: 'connecting' });

      const joinOptions = {
        url: roomUrl,
        userName: userEmail,
        videoSource: isAgent, // Agents start with video enabled
        audioSource: true,
      };

      console.log('🎬 Daily.co join options:', joinOptions);
      
      await state.dailyCall.join(joinOptions);
      
      dispatch({ type: 'SET_JOINED_STATE', payload: true });
      dispatch({ type: 'SET_CONNECTION_STATE', payload: 'connected' });
      dispatch({ type: 'SET_CURRENT_USER', payload: userEmail });
      dispatch({ type: 'SET_IS_AGENT', payload: isAgent });
      
      console.log('✅ Successfully joined Daily.co room');
      
    } catch (error) {
      console.error('❌ Error joining room:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_CONNECTION_STATE', payload: 'error' });
    } finally {
      dispatch({ type: 'SET_JOINING_STATE', payload: false });
    }
  }, [state.dailyCall]);

  // Leave the room
  const leaveRoom = useCallback(async () => {
    try {
      console.log('🚪 Leaving Daily.co room...');
      
      if (state.dailyCall) {
        await state.dailyCall.leave();
        await state.dailyCall.destroy();
        globalDailyCall = null; // Clear global reference
      }
      
      dispatch({ type: 'RESET_STATE' });
      console.log('✅ Successfully left Daily.co room');
      
    } catch (error) {
      console.error('❌ Error leaving room:', error);
    }
  }, [state.dailyCall]);

  // Toggle local video
  const toggleVideo = useCallback(async () => {
    try {
      if (!state.dailyCall) return;
      
      const newVideoState = !state.isLocalVideoEnabled;
      await state.dailyCall.setLocalVideo(newVideoState);
      dispatch({ type: 'SET_LOCAL_VIDEO', payload: newVideoState });
      
      console.log(`🎥 Video ${newVideoState ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('❌ Error toggling video:', error);
    }
  }, [state.dailyCall, state.isLocalVideoEnabled]);

  // Toggle local audio
  const toggleAudio = useCallback(async () => {
    try {
      if (!state.dailyCall) return;
      
      const newAudioState = !state.isLocalAudioEnabled;
      await state.dailyCall.setLocalAudio(newAudioState);
      dispatch({ type: 'SET_LOCAL_AUDIO', payload: newAudioState });
      
      console.log(`🎤 Audio ${newAudioState ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('❌ Error toggling audio:', error);
    }
  }, [state.dailyCall, state.isLocalAudioEnabled]);

  // Set up Daily.co event listeners
  useEffect(() => {
    if (!state.dailyCall) return;

    const call = state.dailyCall;

    // Participant events
    call.on('participant-joined', (event) => {
      console.log('👤 Participant joined:', event.participant);
      dispatch({ 
        type: 'UPDATE_REMOTE_PARTICIPANTS', 
        payload: { 
          ...state.remoteParticipants, 
          [event.participant.session_id]: event.participant 
        } 
      });
    });

    call.on('participant-left', (event) => {
      console.log('👤 Participant left:', event.participant);
      const updatedParticipants = { ...state.remoteParticipants };
      delete updatedParticipants[event.participant.session_id];
      dispatch({ type: 'UPDATE_REMOTE_PARTICIPANTS', payload: updatedParticipants });
    });

    call.on('participant-updated', (event) => {
      console.log('👤 Participant updated:', event.participant);
      if (event.participant.local) {
        dispatch({ type: 'SET_LOCAL_PARTICIPANT', payload: event.participant });
        dispatch({ type: 'SET_LOCAL_VIDEO', payload: event.participant.video });
        dispatch({ type: 'SET_LOCAL_AUDIO', payload: event.participant.audio });
      } else {
        dispatch({ 
          type: 'UPDATE_REMOTE_PARTICIPANTS', 
          payload: { 
            ...state.remoteParticipants, 
            [event.participant.session_id]: event.participant 
          } 
        });
      }
    });

    // Connection events
    call.on('joined-meeting', (event) => {
      console.log('✅ Joined meeting:', event);
      dispatch({ type: 'SET_LOCAL_PARTICIPANT', payload: event.participants.local });
      dispatch({ type: 'SET_JOINED_STATE', payload: true });
      dispatch({ type: 'SET_CONNECTION_STATE', payload: 'connected' });
    });

    call.on('left-meeting', (event) => {
      console.log('🚪 Left meeting:', event);
      dispatch({ type: 'RESET_STATE' });
    });

    call.on('error', (event) => {
      console.error('❌ Daily.co error:', event);
      dispatch({ type: 'SET_ERROR', payload: event.errorMsg });
      dispatch({ type: 'SET_CONNECTION_STATE', payload: 'error' });
    });

    // Cleanup function
    return () => {
      call.off('participant-joined');
      call.off('participant-left');
      call.off('participant-updated');
      call.off('joined-meeting');
      call.off('left-meeting');
      call.off('error');
    };
  }, [state.dailyCall, state.remoteParticipants]);

  // Initialize Daily.co call on mount
  useEffect(() => {
    let isMounted = true;
    
    if (!state.dailyCall && isMounted) {
      console.log('🎬 Initializing Daily.co call for the first time...');
      createDailyCall();
    }
    
    return () => {
      isMounted = false;
      // Clean up call instance on unmount
      if (state.dailyCall) {
        console.log('🧹 Cleaning up Daily.co call instance...');
        state.dailyCall.destroy().catch(console.error);
        globalDailyCall = null; // Clear global reference
      }
    };
  }, [createDailyCall, state.dailyCall]);

  const value = {
    ...state,
    createRoom,
    joinRoom,
    leaveRoom,
    toggleVideo,
    toggleAudio,
    createDailyCall,
  };

  return (
    <DailyContext.Provider value={value}>
      {children}
    </DailyContext.Provider>
  );
};

export const useDailyContext = () => {
  const context = useContext(DailyContext);
  if (!context) {
    throw new Error('useDailyContext must be used within a DailyProvider');
  }
  return context;
};

export default DailyContext; 