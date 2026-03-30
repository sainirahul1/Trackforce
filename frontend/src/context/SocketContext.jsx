import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.token) {
      const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      // Normalize URL
      const baseUrl = socketUrl.replace(/\/api$/, '').replace(/\/$/, '');
      
      const newSocket = io(baseUrl, {
        auth: {
          token: user.token
        },
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('[SOCKET] Connected to server');
        
        // Join rooms
        if (user.tenant) {
          newSocket.emit('join_tenant', typeof user.tenant === 'object' ? user.tenant._id : user.tenant);
        }
        newSocket.emit('join_user', user._id);
      });

      newSocket.on('connect_error', (err) => {
        console.error('[SOCKET] Connection error:', err.message);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        console.log('[SOCKET] Disconnected');
      };
    } else {
      setSocket(null);
    }
  }, [user?._id, user?.token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
