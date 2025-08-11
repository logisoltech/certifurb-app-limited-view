"use client";

import React, { useState, useEffect } from "react";
import { useLiveStore } from "../../context/LiveStoreContext";
import ConnectionRequestPopup from "./VideoCall/ConnectionRequestPopup";
import AgentNotificationPopup from "./VideoCall/AgentNotificationPopup";
import VideoCallInterface from "./VideoCall/VideoCallInterface";

const LiveStore = () => {
  const {
    showConnectionPopup,
    showAgentNotification,
    showVideoCall,
    connectionStatus,
    currentCall,
    incomingRequest,
    acceptConnection,
    declineConnection,
    endCall,
    closeConnectionPopup,
    isAgent,
    socket,
  } = useLiveStore();

  const otherUserEmail = isAgent
    ? currentCall?.userEmail
    : currentCall?.agentEmail;

  return (
    <>
      {/* User Connection Request Popup */}
      <ConnectionRequestPopup
        isOpen={showConnectionPopup}
        onClose={closeConnectionPopup}
        status={connectionStatus}
      />

      {/* Agent Notification Popup */}
      <AgentNotificationPopup
        isOpen={showAgentNotification}
        onAccept={acceptConnection}
        onDecline={declineConnection}
        userName={incomingRequest?.userName}
      />

      {/* Video Call Interface */}
      <VideoCallInterface
        isOpen={showVideoCall}
        onEndCall={endCall}
        isAgent={isAgent}
        otherUserName={isAgent ? currentCall?.userName : currentCall?.agentName}
        otherUserEmail={otherUserEmail}
        sessionId={currentCall?.sessionId}
        socket={socket}
      />
    </>
  );
};

export default LiveStore;
