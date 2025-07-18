import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface Notification {
  type: string;
  message: string;
  [key: string]: any;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notif: Notification) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    if (!user || !token) return;
    const s = io(API_BASE_URL, {
      transports: ['websocket'],
      query: { userId: user._id },
    });
    // Example: listen for newBooking (therapist)
    s.on('newBooking', (data: any) => {
      setNotifications((prev) => [
        { type: 'booking', message: 'You have a new booking!', ...data },
        ...prev,
      ]);
    });
    // Add more event listeners as needed
    return () => {
      s.disconnect();
    };
  }, [user, token, API_BASE_URL]);

  const addNotification = (notif: Notification) => {
    setNotifications((prev) => [notif, ...prev]);
  };
  const clearNotifications = () => setNotifications([]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}; 