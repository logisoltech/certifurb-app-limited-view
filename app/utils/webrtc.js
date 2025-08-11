export const createPeerConnection = ({
    socket,
    sessionId,
    localStream,
    targetUserEmail,
    onRemoteStream,
  }) => {
    console.log('🔗 Creating new PeerConnection...', {
      sessionId,
      targetUserEmail,
      hasLocalStream: !!localStream,
      localStreamTracks: localStream ? localStream.getTracks().length : 0
    });
    
    let pc;
    try {
      pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' } // Free STUN server for NAT traversal
        ]
      });
      
      console.log('✅ CRITICAL: RTCPeerConnection created successfully:', {
        connectionState: pc.connectionState,
        signalingState: pc.signalingState,
        iceConnectionState: pc.iceConnectionState,
      });
      
    } catch (error) {
      console.error('❌ CRITICAL ERROR: Failed to create RTCPeerConnection:', error);
      console.error('RTCPeerConnection error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        webRTCSupported: typeof RTCPeerConnection !== 'undefined'
      });
      throw error; // Re-throw to let caller handle
    }
  
      // CRITICAL: Add local tracks to the connection
  if (localStream) {
    console.log('🔗 CRITICAL: Adding local stream tracks to PeerConnection:', {
      streamId: localStream.id,
      streamActive: localStream.active,
      totalTracks: localStream.getTracks().length,
      videoTracks: localStream.getVideoTracks().length,
      audioTracks: localStream.getAudioTracks().length,
    });
    
    localStream.getTracks().forEach(track => {
      console.log(`➕ CRITICAL: Adding ${track.kind} track:`, {
        trackId: track.id,
        enabled: track.enabled,
        readyState: track.readyState,
        streamId: localStream.id
      });
      
      // Add track to peer connection
      const sender = pc.addTrack(track, localStream);
      
      console.log(`✅ CRITICAL: ${track.kind} track added to PeerConnection:`, {
        senderExists: !!sender,
        trackKind: track.kind,
        trackEnabled: track.enabled
      });
    });
    
    // CRITICAL: Verify all tracks were added
    const senders = pc.getSenders();
    console.log('📡 CRITICAL: PeerConnection senders after adding tracks:', {
      totalSenders: senders.length,
      videoSenders: senders.filter(s => s.track?.kind === 'video').length,
      audioSenders: senders.filter(s => s.track?.kind === 'audio').length,
    });
  } else {
    console.error('❌ CRITICAL ERROR: No local stream to add to PeerConnection!');
  }
  
    // Handle incoming remote media tracks
    pc.ontrack = (event) => {
      console.log('📹 CRITICAL: Remote track received:', {
        trackKind: event.track.kind,
        trackId: event.track.id,
        enabled: event.track.enabled,
        readyState: event.track.readyState,
        streams: event.streams.length
      });
      
      const [stream] = event.streams;
      if (stream && onRemoteStream) {
        console.log('✅ CRITICAL: Calling onRemoteStream with:', {
          streamId: stream.id,
          videoTracks: stream.getVideoTracks().length,
          audioTracks: stream.getAudioTracks().length,
          videoEnabled: stream.getVideoTracks()[0]?.enabled,
        });
        
        // IMMEDIATE callback to set the remote stream
        onRemoteStream(stream);
        
        console.log('🎬 CRITICAL: Remote stream callback completed');
      }
    };
  
    // Handle ICE candidates and send them to the peer via Socket.IO
    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        console.log('🧊 Sending ICE candidate:', event.candidate.type);
        socket.emit('webrtc-ice-candidate', {
          sessionId,
          candidate: event.candidate,
          targetUserEmail
        });
      } else if (!event.candidate) {
        console.log('🧊 ICE gathering complete');
      }
    };
  
    pc.onconnectionstatechange = () => {
      console.log(`📡 CRITICAL: PeerConnection state changed to: ${pc.connectionState}`);
      if (pc.connectionState === 'connected') {
        console.log('✅ CRITICAL: WebRTC connection FULLY ESTABLISHED!');
      } else if (pc.connectionState === 'connecting') {
        console.log('🔄 CRITICAL: WebRTC connection in progress...');
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        console.warn('⚠️ CRITICAL: Connection lost or failed');
      }
    };
  
    pc.oniceconnectionstatechange = () => {
      console.log(`🧊 ICE connection state: ${pc.iceConnectionState}`);
    };
  
    return pc;
  };
  
  export const handleOffer = async ({
  offer,
  socket,
  sessionId,
  localStream,
  targetUserEmail,
  onRemoteStream,
  onPeerConnectionReady,
  onAnswerSent
}) => {
  console.log('📥 Handling WebRTC offer...', {
    sessionId,
    targetUserEmail,
    hasLocalStream: !!localStream,
    localVideoTracks: localStream?.getVideoTracks().length || 0,
    offerHasVideo: offer.sdp.includes('m=video')
  });
  
  console.log('🔗 CRITICAL: About to create peer connection in handleOffer...', {
    hasSocket: !!socket,
    sessionId,
    hasLocalStream: !!localStream,
    targetUserEmail,
    socketConnected: socket?.connected,
    createPeerConnectionExists: typeof createPeerConnection === 'function'
  });
  
  let pc;
  try {
    pc = createPeerConnection({
      socket,
      sessionId,
      localStream,
      targetUserEmail,
      onRemoteStream
    });
    
    console.log('✅ CRITICAL: Peer connection created successfully in handleOffer:', {
      peerConnectionExists: !!pc,
      connectionState: pc?.connectionState,
      signalingState: pc?.signalingState,
      iceConnectionState: pc?.iceConnectionState,
    });
    
  } catch (error) {
    console.error('❌ CRITICAL ERROR: Failed to create peer connection in handleOffer:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw error; // Re-throw to let caller handle
  }
  
    console.log('🔄 Setting remote description from offer...');
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
  
    console.log('🔄 Creating answer with video constraints...');
    const answer = await pc.createAnswer({
      offerToReceiveVideo: true,
      offerToReceiveAudio: true
    });
    await pc.setLocalDescription(answer);
  
    console.log('📤 Sending WebRTC answer...', {
      answerType: answer.type,
      hasVideo: answer.sdp.includes('m=video'),
      targetUserEmail
    });
    
    // Send the answer back to the initiator
    socket.emit('webrtc-answer', {
      sessionId,
      answer,
      targetUserEmail
    });
    
    // Call answer sent callback
    if (onAnswerSent) {
      console.log('📤 CRITICAL: Calling onAnswerSent callback...');
      onAnswerSent();
      console.log('✅ CRITICAL: onAnswerSent callback completed');
    }
  
      if (onPeerConnectionReady) {
    console.log('🔗 CRITICAL: Calling onPeerConnectionReady callback...', {
      peerConnectionExists: !!pc,
      callbackExists: typeof onPeerConnectionReady === 'function'
    });
    onPeerConnectionReady(pc);
    console.log('✅ CRITICAL: onPeerConnectionReady callback completed');
  } else {
    console.warn('⚠️ WARNING: No onPeerConnectionReady callback provided');
  }
    
    console.log('✅ WebRTC offer handling complete - both sides should see video now');
  };
  
  export const handleAnswer = async ({
    peerConnection,
    answer
  }) => {
    if (peerConnection) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };
  
  export const handleIceCandidate = async ({
    peerConnection,
    candidate
  }) => {
    if (peerConnection) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('❌ Failed to add ICE candidate:', error);
      }
    }
  };
  