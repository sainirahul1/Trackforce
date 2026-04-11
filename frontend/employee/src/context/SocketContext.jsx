import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getApiBaseUrl } from '../services/apiClient';

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
      const baseUrl = getApiBaseUrl();
      
      const newSocket = io(baseUrl, {
        auth: {
          token: user.token
        },
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('[SOCKET] Connected to server');
        
        const tenantId = typeof user.tenant === 'object' ? user.tenant._id : user.tenant;
        
        // Join rooms for fine-grained isolation
        newSocket.emit('join_user', user._id);
        
        if (tenantId) {
          newSocket.emit('join_tenant', tenantId);
          newSocket.emit('join_tenant_role', { tenantId, role: user.role });
        }
        
        if (user.role) {
          newSocket.emit('join_role', user.role);
        }
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
