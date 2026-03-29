import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import notificationService from '../services/core/notificationService';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

const getRelativeTime = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString();
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const pollingRef = useRef(null);

    const fetchNotifications = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return; // Not logged in

        try {
            setIsLoading(true);
            const data = await notificationService.getAll();
            const mapped = data.map(n => ({
                ...n,
                id: n._id,
                time: getRelativeTime(n.createdAt),
            }));
            setNotifications(mapped);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch on mount, then poll every 60 seconds for new notifications
    useEffect(() => {
        fetchNotifications();

        pollingRef.current = setInterval(fetchNotifications, 60000);

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [fetchNotifications]);

    const markAsRead = useCallback(async (id) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        try {
            await notificationService.markAsRead(id);
        } catch (error) {
            console.error('Failed to mark as read:', error);
            // Revert on failure
            fetchNotifications();
        }
    }, [fetchNotifications]);

    const markAllAsRead = useCallback(async () => {
        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        try {
            await notificationService.markAllAsRead();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
            fetchNotifications();
        }
    }, [fetchNotifications]);

    const deleteNotification = useCallback(async (id) => {
        // Optimistic update
        setNotifications(prev => prev.filter(n => n.id !== id));
        try {
            await notificationService.delete(id);
        } catch (error) {
            console.error('Failed to delete notification:', error);
            fetchNotifications();
        }
    }, [fetchNotifications]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const value = {
        notifications,
        allNotifications: notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refetch: fetchNotifications,
        // Legacy compat
        executiveList: notifications.filter(n => n.type !== 'account' && n.type !== 'system'),
        managerList: notifications,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
