"use client";

import React, { useRef, useEffect, useState } from "react";
import { font } from "../../Font/font";
import {
  createPeerConnection,
  handleOffer,
  handleAnswer,
  handleIceCandidate,
} from "../../../utils/webrtc";

const VideoCallInterface = ({
  isOpen,
  onEndCall,
  isAgent,
  otherUserName,
  sessionId,
  socket,
  otherUserEmail,
}) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false); // Both start with video off initially
  const [remoteVideoOn, setRemoteVideoOn] = useState(false); // Track remote user's video state
  const [isConnecting, setIsConnecting] = useState(true);
  const [showCameraHelp, setShowCameraHelp] = useState(false);
  const [mediaDevicesAvailable, setMediaDevicesAvailable] = useState(false);
  const [callConnectedReceived, setCallConnectedReceived] = useState(false);
  const [offerSentSuccessfully, setOfferSentSuccessfully] = useState(false);
  const [answerSentSuccessfully, setAnswerSentSuccessfully] = useState(false);
  const peerConnectionRef = useRef(null);

  // Debug effect to track connecting state changes
  useEffect(() => {
    console.log(`🔄 CRITICAL: Connection state changed - ${isAgent ? 'AGENT' : 'USER'}: ${isConnecting ? 'CONNECTING' : 'CONNECTED'}`);
  }, [isConnecting, isAgent]);

  useEffect(() => {
    // Check media device availability
    setMediaDevicesAvailable(
      !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    );

    if (isOpen) {
      // Reset call state flags when call interface opens
      setCallConnectedReceived(false);
      setOfferSentSuccessfully(false);
      setAnswerSentSuccessfully(false);
      console.log("🔄 CRITICAL: Call interface opened - reset all state flags");
      
      startLocalStream();
      setupSocketListeners();
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  // Effect to ensure video element gets the stream
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
      console.log("📺 Updated local video element with stream", {
        streamId: localStream.id,
        videoTracks: localStream.getVideoTracks().length,
        elementSrc: localVideoRef.current.srcObject,
      });
    }
  }, [localStream]);

  // Additional effect to force video element update when video state changes
  useEffect(() => {
    if (isVideoOn && localStream && localVideoRef.current) {
      // Force reassign the stream when video is turned on
      if (!localVideoRef.current.srcObject) {
        localVideoRef.current.srcObject = localStream;
        console.log("🔄 Force-assigned stream to video element");
      }
    }
  }, [isVideoOn, localStream]);

  // Effect to assign remoteStream to video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      console.log("📺 Assigned remoteStream to video element");
    }
  }, [remoteStream]);

  const setupSocketListeners = () => {
    if (!socket || !sessionId) return;

    // Remote camera state changes
    socket.on("camera-state-changed", (data) => {
      if (data.sessionId === sessionId) {
        setRemoteVideoOn(data.isVideoOn);
      }
    });

    // Remote audio state changes
    socket.on("audio-state-changed", (data) => {
      if (data.sessionId === sessionId) {
        // You can optionally show mic state here
        console.log(
          `${data.userType} mic is now ${data.isMuted ? "muted" : "unmuted"}`
        );
      }
    });

    // ===== CRITICAL: MINIMAL WEBRTC SETUP =====
    // This follows the exact working structure from your reference code
    
    // Handle call-connected event (triggers WebRTC setup)
    socket.on("call-connected", async ({ sessionId: receivedSessionId }) => {
      console.log("🔗 CRITICAL: call-connected event received:", {
        receivedSessionId,
        currentSessionId: sessionId,
        isAgent,
        sessionMatches: receivedSessionId === sessionId
      });

      if (receivedSessionId !== sessionId) {
        console.error("❌ Session ID mismatch in call-connected");
        return;
      }

      setCallConnectedReceived(true);
      
      // 🔧 1. Create peerConnection FIRST
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });
      
      peerConnectionRef.current = peerConnection;
      console.log("✅ CRITICAL: Peer connection created");

      // 🔧 2. Set ontrack BEFORE offer/answer
      peerConnection.ontrack = (event) => {
        console.log("🎥 CRITICAL: ontrack fired with stream", event.streams);
        const [incomingStream] = event.streams;
        if (incomingStream) {
          setRemoteStream(incomingStream);
          setIsConnecting(false);
          console.log("✅ CRITICAL: Remote stream received and set");
        }
      };

      // 🔧 3. ICE candidate handling
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("📡 CRITICAL: Sending ICE candidate");
          socket.emit("webrtc-ice-candidate", { 
            candidate: event.candidate, 
            sessionId: receivedSessionId
          });
        }
      };

      // 🔧 4. Add local tracks to peer connection
      if (localStream) {
        console.log("📡 CRITICAL: Adding local tracks to peer connection");
        localStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream);
          console.log("✅ CRITICAL: Added track:", track.kind, "enabled:", track.enabled);
        });
      }

      // 🔧 5. Agent creates offer, User waits for offer
      if (isAgent) {
        console.log("🤝 CRITICAL: Agent creating offer");
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        socket.emit("webrtc-offer", { 
          offer: offer, 
          sessionId: receivedSessionId 
        });
        
        setOfferSentSuccessfully(true);
        console.log("✅ CRITICAL: Agent offer sent");
      }
    });

    // 🔧 6. Handle WebRTC offer (USER SIDE)
    socket.on("webrtc-offer", async ({ offer, sessionId: receivedSessionId }) => {
      console.log("📥 CRITICAL: User received WebRTC offer:", {
        receivedSessionId,
        currentSessionId: sessionId,
        sessionMatches: receivedSessionId === sessionId,
        isAgent,
        offerType: offer?.type
      });

      if (receivedSessionId !== sessionId) {
        console.error("❌ Session ID mismatch in webrtc-offer");
        return;
      }

      if (isAgent) {
        console.log("⚠️ Agent received offer - ignoring (agents don't handle offers)");
        return;
      }

      try {
        // User creates peer connection when receiving offer
        if (!peerConnectionRef.current) {
          const peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
          });
          
          peerConnectionRef.current = peerConnection;
          console.log("✅ CRITICAL: User peer connection created");

          // Set ontrack handler
          peerConnection.ontrack = (event) => {
            console.log("🎥 CRITICAL: User ontrack fired", event.streams);
            const [incomingStream] = event.streams;
            if (incomingStream) {
              setRemoteStream(incomingStream);
              setIsConnecting(false);
              console.log("✅ CRITICAL: User received remote stream");
            }
          };

          // ICE candidate handling
          peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
              console.log("📡 CRITICAL: User sending ICE candidate");
              socket.emit("webrtc-ice-candidate", { 
                candidate: event.candidate, 
                sessionId: receivedSessionId
              });
            }
          };

          // Add local tracks
          if (localStream) {
            console.log("📡 CRITICAL: User adding local tracks");
            localStream.getTracks().forEach((track) => {
              peerConnection.addTrack(track, localStream);
              console.log("✅ CRITICAL: User added track:", track.kind);
            });
          }
        }

        // Process offer and create answer
        console.log("🤝 CRITICAL: User processing offer and creating answer");
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        
        socket.emit("webrtc-answer", { 
          answer: answer, 
          sessionId: receivedSessionId 
        });
        
        setAnswerSentSuccessfully(true);
        console.log("✅ CRITICAL: User answer sent");
        
      } catch (error) {
        console.error("❌ CRITICAL: User failed to process offer:", error);
      }
    });

    // 🔧 7. Handle WebRTC answer (AGENT SIDE)
    socket.on("webrtc-answer", async ({ answer, sessionId: receivedSessionId }) => {
      console.log("📥 CRITICAL: Agent received WebRTC answer:", {
        receivedSessionId,
        currentSessionId: sessionId,
        sessionMatches: receivedSessionId === sessionId,
        isAgent,
        answerType: answer?.type
      });

      if (receivedSessionId !== sessionId) {
        console.error("❌ Session ID mismatch in webrtc-answer");
        return;
      }

      if (!isAgent) {
        console.log("⚠️ User received answer - ignoring (users don't handle answers)");
        return;
      }

      try {
        console.log("🤝 CRITICAL: Agent processing answer");
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        
        console.log("✅ CRITICAL: Agent answer processed successfully");
        
      } catch (error) {
        console.error("❌ CRITICAL: Agent failed to process answer:", error);
      }
    });

    // 🔧 8. Handle ICE candidates (BOTH SIDES)
    socket.on("webrtc-ice-candidate", async ({ candidate, sessionId: receivedSessionId }) => {
      console.log("🧊 CRITICAL: ICE candidate received:", {
        receivedSessionId,
        currentSessionId: sessionId,
        sessionMatches: receivedSessionId === sessionId,
        candidateType: candidate?.type
      });

      if (receivedSessionId !== sessionId) {
        console.error("❌ Session ID mismatch in ICE candidate");
        return;
      }

      try {
        console.log("🧊 CRITICAL: Processing ICE candidate");
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        
        console.log("✅ CRITICAL: ICE candidate processed successfully");
        
      } catch (error) {
        console.error("❌ CRITICAL: Failed to process ICE candidate:", error);
      }
    });

    // Old complex call-connected handler removed - using minimal structure above
  }; // Missing closing brace for setupSocketListeners function

  const startLocalStream = async () => {
    try {
      // Check if mediaDevices API is available (requires HTTPS or localhost)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          "Media devices not available. Please use HTTPS or localhost."
        );
      }

      console.log("🎥 Requesting camera and microphone access...");

      // Always request both video and audio, but keep video disabled initially
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      console.log("✅ Got media stream:", {
        videoTracks: stream.getVideoTracks().length,
        audioTracks: stream.getAudioTracks().length,
        streamId: stream.id,
      });

      // 🧪 Agent side debugging - LOG ALL TRACKS
      console.log("📡 Agent Video Tracks:", stream?.getVideoTracks());
      console.log("📡 All Agent Tracks:", stream?.getTracks());
      stream?.getVideoTracks().forEach((track, index) => {
        console.log(`📡 Agent Video Track ${index}:`, {
          id: track.id,
          enabled: track.enabled,
          kind: track.kind,
          readyState: track.readyState,
          label: track.label
        });
      });

      // CRITICAL: For agents, FORCE enable video immediately
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        if (isAgent) {
          videoTrack.enabled = true;
          setIsVideoOn(true);
          console.log("🎥 CRITICAL: Agent camera FORCE-ENABLED for transmission:", {
            trackId: videoTrack.id,
            enabled: videoTrack.enabled,
            readyState: videoTrack.readyState,
            streamId: stream.id
          });
          
          // 🧪 Agent debugging - check if peer connection exists and add tracks
          if (peerConnectionRef.current) {
            console.log("📡 CRITICAL: Agent adding tracks to existing peer connection");
            peerConnectionRef.current.getSenders().forEach(sender => {
              console.log("🎯 CRITICAL: Existing Sender:", sender.track?.kind, sender.track?.enabled);
            });
          }
          
          // CRITICAL: Verify video track is actually enabled
          setTimeout(() => {
            if (videoTrack.enabled) {
              console.log("✅ CRITICAL: Agent video track confirmed enabled after timeout");
            } else {
              console.error("❌ CRITICAL ERROR: Agent video track failed to enable!");
            }
          }, 100);
        } else {
          videoTrack.enabled = false;
          console.log("📹 User video track disabled initially for privacy");
        }
      } else {
        console.error("❌ CRITICAL ERROR: No video track found in agent's stream!");
      }

      setLocalStream(stream);

      // Set stream to video element immediately
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log("📺 Stream set to local video element");
      }

      return stream; // Return the stream for immediate use
    } catch (error) {
      console.error("Error accessing media devices:", error);

      // Show user-friendly error message
      if (error.message.includes("Media devices not available")) {
        alert(
          "⚠️ Camera/Microphone Not Available\n\n" +
            "The video calling feature requires a secure connection (HTTPS) or localhost.\n\n" +
            "Current solutions:\n" +
            "• Access via localhost:3000 instead of IP address\n" +
            "• Use HTTPS (requires SSL certificate)\n\n" +
            "Audio-only mode will still work for the call."
        );
      } else if (error.name === "NotAllowedError") {
        alert(
          "❌ Permission Denied\n\n" +
            "Please allow camera and microphone access to use video calling.\n\n" +
            "You can change this in your browser settings."
        );
      } else if (error.name === "NotFoundError") {
        alert(
          "📹 No Camera Found\n\n" +
            "No camera or microphone was detected on your device.\n\n" +
            "Please check your device connections."
        );
      } else {
        alert("❌ Media Access Error\n\n" + error.message);
      }
    }
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);

        // Notify remote user about audio state
        if (socket && sessionId) {
          socket.emit("audio-state-changed", {
            sessionId,
            isMuted: !audioTrack.enabled,
            userType: isAgent ? "agent" : "user",
          });
        }
      }
    }
  };

  const toggleVideo = () => {
    // Check if media devices are available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert(
        "⚠️ Video Not Available\n\n" +
          "Camera access requires HTTPS or localhost.\n" +
          "Please access the site via localhost:3000"
      );
      return;
    }

    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);

        console.log(`📹 Video toggled: ${videoTrack.enabled ? "ON" : "OFF"}`, {
          trackEnabled: videoTrack.enabled,
          trackReadyState: videoTrack.readyState,
          streamActive: localStream.active,
        });

        // Update peer connection with new track state
        if (peerConnectionRef.current) {
          const senders = peerConnectionRef.current.getSenders();
          const videoSender = senders.find((s) => s.track?.kind === "video");
          if (videoSender) {
            // Replace the track with the updated one
            videoSender
              .replaceTrack(videoTrack)
              .then(() => {
                console.log("✅ Video track updated in peer connection");
              })
              .catch((err) => {
                console.error("❌ Failed to update video track:", err);
              });
          }
        }

        // Notify remote user about camera state
        if (socket && sessionId) {
          socket.emit("camera-state-changed", {
            sessionId,
            isVideoOn: videoTrack.enabled,
            userType: isAgent ? "agent" : "user",
          });
          console.log(
            "📡 Sent camera state to remote user:",
            videoTrack.enabled
          );
        }
      } else {
        console.warn("❌ No video track found in stream");
      }
    } else {
      console.log("🔄 No stream available, requesting new stream...");
      // No stream available, try to get one
      enableCamera();
    }
  };

  const enableCamera = async () => {
    console.log("🎥 Enable camera requested");

    let streamToUse = localStream;

    if (!streamToUse) {
      console.log("📺 No existing stream, creating new one...");
      await startLocalStream();
      // After async operation, get the updated stream from state
      // Note: This might not immediately reflect due to React state timing
      streamToUse = localStream;
    }

    // Use a short delay to ensure state is updated
    setTimeout(() => {
      const currentStream = localVideoRef.current?.srcObject || localStream;
      if (currentStream) {
        const videoTrack = currentStream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = true;
          setIsVideoOn(true);
          console.log("✅ Camera enabled directly", {
            trackEnabled: videoTrack.enabled,
            trackReadyState: videoTrack.readyState,
          });

          // Notify remote user
          if (socket && sessionId) {
            socket.emit("camera-state-changed", {
              sessionId,
              isVideoOn: true,
              userType: isAgent ? "agent" : "user",
            });
          }
        } else {
          console.warn("❌ No video track found after stream creation");
        }
      } else {
        console.warn("❌ No stream available after enable camera");
      }
    }, 100); // Small delay to handle async state updates
  };

  // Create a simulated remote stream for demo purposes
  // const createSimulatedRemoteStream = () => {
  //   console.log('🎭 Creating simulated remote stream for demo');

  //   // In a real WebRTC implementation, this would be the actual remote user's stream
  //   // For demo, we'll set a flag to show the remote video area differently
  //   setRemoteVideoOn(true);

  //   // Create a canvas-based stream as a placeholder
  //   try {
  //     const canvas = document.createElement('canvas');
  //     canvas.width = 640;
  //     canvas.height = 480;
  //     const ctx = canvas.getContext('2d');

  //     // Create a simple animated background
  //     const animate = () => {
  //       if (!remoteVideoOn) return;

  //       // Create gradient background
  //       const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  //       gradient.addColorStop(0, '#1e3a8a'); // blue-800
  //       gradient.addColorStop(1, '#3730a3'); // purple-800
  //       ctx.fillStyle = gradient;
  //       ctx.fillRect(0, 0, canvas.width, canvas.height);

  //       // Add text
  //       ctx.fillStyle = 'white';
  //       ctx.font = '24px Arial';
  //       ctx.textAlign = 'center';
  //       ctx.fillText('🎥 Remote User Video', canvas.width/2, canvas.height/2 - 20);
  //       ctx.font = '16px Arial';
  //       ctx.fillText('(In real WebRTC this would show actual video)', canvas.width/2, canvas.height/2 + 20);

  //       requestAnimationFrame(animate);
  //     };

  //     animate();

  //     // Create stream from canvas
  //     const simulatedStream = canvas.captureStream(30);
  //     setRemoteStream(simulatedStream);

  //     if (remoteVideoRef.current) {
  //       remoteVideoRef.current.srcObject = simulatedStream;
  //       console.log('📺 Set simulated remote stream to video element');
  //     }

  //   } catch (error) {
  //     console.error('❌ Error creating simulated stream:', error);
  //     // Fallback: just set the remote video state
  //     setRemoteVideoOn(true);
  //   }
  // };

  // CRITICAL Debug function to check video state
  const checkVideoState = () => {
    const debugInfo = {
      // Connection states
      isConnecting,
      sessionId,
      isAgent,
      userType: isAgent ? 'AGENT' : 'USER',
      
      // Local stream info
      isVideoOn,
      hasLocalStream: !!localStream,
      localStreamActive: localStream?.active,
      localVideoTracks: localStream?.getVideoTracks().length || 0,
      localVideoTrackEnabled: localStream?.getVideoTracks()[0]?.enabled,
      localVideoTrackReadyState: localStream?.getVideoTracks()[0]?.readyState,
      localVideoElementSrc: localVideoRef.current?.srcObject ? "ASSIGNED" : "NOT_ASSIGNED",

      // Remote stream info
      remoteVideoOn,
      hasRemoteStream: !!remoteStream,
      remoteStreamActive: remoteStream?.active,
      remoteVideoTracks: remoteStream?.getVideoTracks().length || 0,
      remoteVideoTrackEnabled: remoteStream?.getVideoTracks()[0]?.enabled,
      remoteVideoTrackReadyState: remoteStream?.getVideoTracks()[0]?.readyState,
      remoteVideoElementSrc: remoteVideoRef.current?.srcObject ? "ASSIGNED" : "NOT_ASSIGNED",

      // Technical info
      mediaDevicesAvailable,
      peerConnectionState: peerConnectionRef.current?.connectionState,
      iceConnectionState: peerConnectionRef.current?.iceConnectionState,
      signalingState: peerConnectionRef.current?.signalingState,

      // Video element states
      localVideoExists: !!localVideoRef.current,
      remoteVideoExists: !!remoteVideoRef.current,
      localVideoPlaying: localVideoRef.current ? !localVideoRef.current.paused : 'NO_ELEMENT',
      remoteVideoPlaying: remoteVideoRef.current ? !remoteVideoRef.current.paused : 'NO_ELEMENT',
      localVideoSize: localVideoRef.current ? `${localVideoRef.current.videoWidth}x${localVideoRef.current.videoHeight}` : 'NO_ELEMENT',
      remoteVideoSize: remoteVideoRef.current ? `${remoteVideoRef.current.videoWidth}x${remoteVideoRef.current.videoHeight}` : 'NO_ELEMENT',
      
      // Peer connection senders/receivers
      senderCount: peerConnectionRef.current?.getSenders().length || 0,
      receiverCount: peerConnectionRef.current?.getReceivers().length || 0,
      videoSenders: peerConnectionRef.current?.getSenders().filter(s => s.track?.kind === 'video').length || 0,
      videoReceivers: peerConnectionRef.current?.getReceivers().filter(r => r.track?.kind === 'video').length || 0,
    };
    
    console.log("🔍 CRITICAL: Complete Video State Debug:", debugInfo);
    
    // 🔍 DEBUG: Send debug info to backend
    socket.emit('debug-log', {
      sessionId,
      userType: isAgent ? 'agent' : 'user',
      event: 'video-state-debug',
      timestamp: Date.now(),
      debugInfo: debugInfo
    });
    
    // Additional detailed logging for critical issues
    if (!remoteStream && !isConnecting) {
      console.error("❌ CRITICAL ISSUE: No remote stream and not connecting!");
    }
    
    if (remoteStream && !remoteVideoRef.current?.srcObject) {
      console.error("❌ CRITICAL ISSUE: Remote stream exists but not assigned to video element!");
    }
    
    if (isAgent && (!localStream || !localStream.getVideoTracks()[0]?.enabled)) {
      console.error("❌ CRITICAL ISSUE: Agent doesn't have enabled video track!");
    }
    
    if (peerConnectionRef.current?.iceConnectionState === 'failed') {
      console.error("❌ CRITICAL ISSUE: ICE connection failed!");
    }
  };
  
  // 🔧 Comprehensive debugging checklist
  const runDebugChecklist = () => {
    console.log("🔧 CRITICAL: Running comprehensive debug checklist...");
    
    const checklist = {
      // Step 1: call-connected received
      callConnectedReceived,
      
      // Step 2: sessionId match
      sessionIdValid: !!sessionId,
      
      // Step 3: local stream ready
      localStreamReady: !!localStream && localStream.active,
      
      // Step 4: agent video track enabled
      agentVideoEnabled: isAgent ? (localStream?.getVideoTracks()[0]?.enabled || false) : true,
      
      // Step 5: peer connection created
      peerConnectionCreated: !!peerConnectionRef.current,
      
      // Step 6: offer created and sent (agent)
      offerSent: !isAgent || offerSentSuccessfully,
      
      // Step 7: answer created and sent (user)
      answerSent: isAgent || answerSentSuccessfully,
      
      // Step 8: ICE candidates exchanged
      iceConnected: peerConnectionRef.current?.iceConnectionState === 'connected' || 
                   peerConnectionRef.current?.iceConnectionState === 'completed',
      
      // Step 9: remote stream received
      remoteStreamReceived: !!remoteStream && remoteStream.active,
      
      // Step 10: video elements assigned
      videoElementsAssigned: localVideoRef.current?.srcObject && 
                            (remoteVideoRef.current?.srcObject || !remoteStream),
      
      // Step 11: video elements playing
      videoElementsPlaying: (!localVideoRef.current || !localVideoRef.current.paused) &&
                           (!remoteVideoRef.current || !remoteVideoRef.current.paused),
      
      // Overall connection state
      connectionEstablished: !isConnecting,
    };
    
    console.log("✅ CRITICAL: Debug checklist results:", checklist);
    
    // Count passed checks
    const passedChecks = Object.values(checklist).filter(Boolean).length;
    const totalChecks = Object.keys(checklist).length;
    
    console.log(`📊 CRITICAL: Checklist score: ${passedChecks}/${totalChecks} checks passed`);
    
    // 🔍 DEBUG: Send checklist to backend
    socket.emit('debug-log', {
      sessionId,
      userType: isAgent ? 'agent' : 'user',
      event: 'debug-checklist',
      timestamp: Date.now(),
      checklist: checklist,
      score: `${passedChecks}/${totalChecks}`
    });
    
    // Highlight failed checks
    Object.entries(checklist).forEach(([check, passed]) => {
      if (!passed) {
        console.error(`❌ CRITICAL FAILURE: ${check} - FAILED`);
      } else {
        console.log(`✅ ${check} - PASSED`);
      }
    });
    
    return checklist;
  };

  // Call debug function every 3 seconds during development
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        checkVideoState();
        runDebugChecklist();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, isConnecting, localStream, remoteStream]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-[9999999] flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className={`${font.className} text-lg font-semibold`}>
            Live Store Session
          </h2>
          <p className="text-sm text-gray-300">
            {isAgent
              ? `Helping: ${otherUserName || "Customer"}`
              : `Agent: ${otherUserName || "Agent"}`}
          </p>
          {isConnecting && (
            <p className="text-xs text-yellow-400">Connecting...</p>
          )}
        </div>
        <button
          onClick={onEndCall}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          End Call
        </button>
      </div>

      {/* Video Area */}
      <div className="flex-1 flex">
        {/* Main Video Area - Split view */}
        <div className="flex-1 flex flex-col">
          {/* Remote User Video (Top 75%) */}
          <div className="h-3/4 relative bg-gray-800 border-b border-gray-600">
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              {isAgent ? "Customer" : "Agent"}{" "}
              {remoteVideoOn ? "(Camera On)" : "(Camera Off)"}
            </div>
            {/* Debug logs for remoteStream */}
            {console.log("🧪 remoteStream", remoteStream)}
            {console.log("🎥 videoTracks", remoteStream?.getVideoTracks())}
            {console.log("📺 Video Element", remoteVideoRef.current)}
            {console.log("🔍 Remote stream details:", {
              streamExists: !!remoteStream,
              streamId: remoteStream?.id,
              videoTracksLength: remoteStream?.getVideoTracks()?.length,
              audioTracksLength: remoteStream?.getAudioTracks()?.length,
              totalTracksLength: remoteStream?.getTracks()?.length,
              videoTrackEnabled: remoteStream?.getVideoTracks()[0]?.enabled,
              videoElementExists: !!remoteVideoRef.current,
              videoElementSrcObject: !!remoteVideoRef.current?.srcObject
            })}
            
            {remoteStream && remoteStream.getVideoTracks().length > 0 ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                onLoadedMetadata={() => {
                  console.log('🎬 onLoadedMetadata triggered');
                  console.log('📺 Remote video metadata loaded');
                  console.log('🔍 Remote stream info:', {
                    streamId: remoteStream.id,
                    videoTracks: remoteStream.getVideoTracks().length,
                    audioTracks: remoteStream.getAudioTracks().length,
                    videoEnabled: remoteStream.getVideoTracks()[0]?.enabled
                  });
                  
                  // Force attach srcObject again when metadata is ready
                  if (remoteVideoRef.current && remoteStream) {
                    remoteVideoRef.current.srcObject = remoteStream; // re-attach
                    remoteVideoRef.current
                      .play()
                      .then(() => console.log("▶️ Video playing"))
                      .catch((e) => console.error("❌ Play error", e));
                  }
                }}
                onError={(e) => console.error('❌ Remote video error:', e)}
                onCanPlay={() => {
                  console.log('✅ Remote video can play');
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <p className={`${font.className} text-lg`}>
                    {otherUserName || (isAgent ? "Customer" : "Agent")}
                  </p>
                  <p className="text-sm text-gray-400">
                    {isConnecting 
                      ? `${isAgent ? "Customer" : "Agent"} is connecting...`
                      : `Waiting for ${isAgent ? "customer" : "agent"} video...`
                    }
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Local User Video (Bottom 25%) */}
          <div className="relative bg-gray-900">
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              You {isVideoOn ? "(Camera On)" : "(Camera Off)"}
            </div>
            {isVideoOn &&
            localStream &&
            localStream.getVideoTracks()[0]?.enabled ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover transform scaleX-[-1]" // Mirror effect for local video
                onLoadedMetadata={() => {
                  console.log("📺 Local video metadata loaded");
                  // Force play if paused
                  if (localVideoRef.current && localVideoRef.current.paused) {
                    localVideoRef.current
                      .play()
                      .catch((e) => console.log("📺 Auto-play failed:", e));
                  }
                }}
                onPlay={() => console.log("▶️ Local video started playing")}
                onError={(e) => console.error("❌ Local video error:", e)}
                onCanPlay={() => {
                  console.log("✅ Local video can play");
                  // Ensure it's actually playing
                  if (localVideoRef.current) {
                    localVideoRef.current
                      .play()
                      .catch((e) =>
                        console.log("📺 Play on canplay failed:", e)
                      );
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <p className={`${font.className} text-lg`}>Your Camera</p>
                  {!mediaDevicesAvailable ? (
                    <div>
                      <p className="text-sm text-yellow-400">
                        Camera unavailable
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Requires HTTPS or localhost
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-400">Camera is off</p>
                      <button
                        onClick={enableCamera}
                        className="mt-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
                      >
                        Turn On Camera
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-gray-900 text-white p-4">
          <div className="mb-6">
            <h3 className={`${font.className} text-lg font-semibold mb-4`}>
              Call Information
            </h3>

            {/* Camera Status */}
            <div className="bg-gray-800 rounded-lg p-3 mb-4">
              <h4 className="font-semibold mb-2 text-sm">Camera Status</h4>

              {!mediaDevicesAvailable && (
                <div className="bg-yellow-900 border border-yellow-600 rounded p-2 mb-2">
                  <div className="text-yellow-200 text-xs">
                    ⚠️ <strong>Video Unavailable</strong>
                    <br />
                    Requires HTTPS or localhost
                  </div>
                </div>
              )}

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Your camera:</span>
                  <span
                    className={isVideoOn ? "text-green-400" : "text-gray-400"}
                  >
                    {isVideoOn ? "On" : "Off"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{isAgent ? "Customer" : "Agent"} camera:</span>
                  <span
                    className={
                      remoteVideoOn ? "text-green-400" : "text-gray-400"
                    }
                  >
                    {remoteVideoOn ? "On" : "Off"}
                  </span>
                </div>
                {!mediaDevicesAvailable && (
                  <div className="text-yellow-400 text-xs mt-1">
                    Audio-only mode available
                  </div>
                )}

                {/* Debug Buttons - remove in production */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={checkVideoState}
                    className="text-xs text-blue-400 hover:text-blue-300"
                    title="Debug video state (check console)"
                  >
                    🔍 Debug Video
                  </button>
                  <button
                    onClick={runDebugChecklist}
                    className="text-xs text-green-400 hover:text-green-300"
                    title="Run comprehensive debug checklist"
                  >
                    ✅ Run Checklist
                  </button>
                </div>
              </div>
            </div>

            {/* Audio Status */}
            <div className="bg-gray-800 rounded-lg p-3 mb-4">
              <h4 className="font-semibold mb-2 text-sm">Audio Status</h4>
              <div className="flex justify-between text-xs">
                <span>Your microphone:</span>
                <span className={!isMuted ? "text-green-400" : "text-red-400"}>
                  {!isMuted ? "On" : "Muted"}
                </span>
              </div>
            </div>
          </div>

          {/* Live Store Info */}
          <div className="bg-green-900 rounded-lg p-4 mb-4">
            <h4 className={`${font.className} font-semibold mb-2`}>
              Live Store Active
            </h4>
            <p className="text-sm text-green-200">
              {isAgent
                ? "You can help the customer browse products in real-time. Turn on your camera to show products."
                : "The agent can show you products live from our store. You can also turn on your camera if you want to show something."}
            </p>
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-900 rounded-lg p-3">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-semibold text-sm">Privacy Notice</h4>
              <button
                onClick={() => setShowCameraHelp(!showCameraHelp)}
                className="text-blue-300 hover:text-white text-xs"
                title="Camera Controls Help"
              >
                {showCameraHelp ? "▼" : "▶"} Help
              </button>
            </div>
            <p className="text-xs text-blue-200 mb-2">
              Your camera and microphone are under your control. You can turn
              them on/off anytime during the call.
            </p>

            {showCameraHelp && (
              <div className="bg-blue-800 rounded p-2 text-xs text-blue-100 mt-2">
                <div className="font-semibold mb-1">Camera Controls:</div>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Both users can control their own cameras</li>
                  <li>Camera starts OFF for privacy by default</li>
                  <li>Click camera button to turn on/off</li>
                  <li>Green status = camera on, Gray = camera off</li>
                  <li>You'll see your own video mirrored</li>
                  <li>Remote user's camera state updates in real-time</li>
                </ul>
                <div className="font-semibold mt-2 mb-1">Permissions:</div>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Browser may ask for camera/mic permissions</li>
                  <li>Allow permissions to use video features</li>
                  <li>You can still use audio-only if camera is denied</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-4">
        <div className="flex justify-center gap-4 mb-2">
          {/* Microphone Control */}
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full ${
              isMuted
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-600 hover:bg-gray-700"
            } transition-colors`}
            title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMuted ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              )}
            </svg>
          </button>

          {/* Camera Control - Available for both users and agents */}
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full ${
              !mediaDevicesAvailable
                ? "bg-gray-500 cursor-not-allowed opacity-50"
                : !isVideoOn
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-600 hover:bg-gray-700"
            } transition-colors`}
            title={
              !mediaDevicesAvailable
                ? "Camera unavailable (requires HTTPS or localhost)"
                : isVideoOn
                ? "Turn Off Camera"
                : "Turn On Camera"
            }
            disabled={!mediaDevicesAvailable}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isVideoOn ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18 21l-4.95-4.95m0 0L5.636 5.636M13.05 16.05L5.636 5.636"
                />
              )}
            </svg>
          </button>

          {/* Screen Share (placeholder for future feature) */}
          <button
            className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors opacity-50 cursor-not-allowed"
            title="Screen Share (Coming Soon)"
            disabled
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>

        {/* Control Labels */}
        <div className="flex justify-center gap-4 text-xs text-gray-400">
          <span>{isMuted ? "Muted" : "Mic On"}</span>
          <span>
            {!mediaDevicesAvailable
              ? "Camera N/A"
              : isVideoOn
              ? "Camera On"
              : "Camera Off"}
          </span>
          <span className="opacity-50">Screen Share</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCallInterface;
