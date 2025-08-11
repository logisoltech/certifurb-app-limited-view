"use client";

import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { font } from '../Font/font';

const Notification = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        handleClose();
      }, notification.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaExclamationCircle className="text-red-500" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`${font.className} ${getBackgroundColor()} border rounded-lg shadow-lg p-4`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-xl">
            {getIcon()}
          </div>
          <div className="flex-1">
            <p className={`${getTextColor()} text-sm font-medium`}>
              {notification.message}
            </p>
          </div>
          <button
            onClick={handleClose}
            className={`flex-shrink-0 ${getTextColor()} hover:opacity-70 transition-opacity`}
          >
            <FaTimes className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook for using notifications
export const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return {
    notification,
    showNotification,
    hideNotification,
    NotificationComponent: () => (
      <Notification notification={notification} onClose={hideNotification} />
    )
  };
};

export default Notification; 