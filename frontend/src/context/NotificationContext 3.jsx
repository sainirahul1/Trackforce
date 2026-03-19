import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [executiveList, setExecutiveList] = useState([
        { 
            id: 1, 
            title: 'New Route Assigned', 
            desc: 'Manager Ananya has assigned North Zone 04 to you.', 
            time: '5m ago', 
            type: 'alert', 
            isRead: false,
            priority: 'high'
        },
        { 
            id: 4, 
            title: 'Visit Reminder', 
            desc: 'Upcoming visit at Heritage Fresh scheduled for 2:30 PM.', 
            time: '15m ago', 
            type: 'message', 
            isRead: false,
            priority: 'low'
        },
        { 
            id: 3, 
            title: 'Selfie Required', 
            desc: 'Please upload a selfie to verify your current visit.', 
            time: '25m ago', 
            type: 'alert', 
            isRead: false,
            priority: 'high'
        },
        { 
            id: 2, 
            title: 'Order Confirmed', 
            desc: 'Order #ORD-892 for Reliance Fresh is now verified.', 
            time: '1h ago', 
            type: 'success', 
            isRead: false,
            priority: 'low'
        },
        { 
            id: 5, 
            title: 'Visit Completed', 
            desc: 'Data sync successful for More Megamart visit.', 
            time: '2h ago', 
            type: 'success', 
            isRead: true,
            priority: 'low'
        },
        { 
            id: 6, 
            title: 'New Task Assigned', 
            desc: 'Collect branding materials from the regional hub.', 
            time: '4h ago', 
            type: 'message', 
            isRead: false,
            priority: 'low'
        },
        { 
            id: 7, 
            title: 'Low Stock Alert', 
            desc: 'Stock for "Premium Energy Drink" is low at North Zone outlets.', 
            time: '6h ago', 
            type: 'alert', 
            isRead: false,
            priority: 'high'
        },
        { 
            id: 8, 
            title: 'Payment Received', 
            desc: 'Collection of ₹45,000 from Fresh Mart has been processed.', 
            time: 'Today', 
            type: 'success', 
            isRead: true,
            priority: 'high'
        },
        { 
            id: 9, 
            title: 'Daily Report Reminder', 
            desc: 'Please submit your end-of-day summary by 7 PM.', 
            time: 'Today', 
            type: 'message', 
            isRead: false,
            priority: 'high'
        },
    ]);

    const [managerList, setManagerList] = useState([
        { 
            id: 101, 
            title: 'Executive Checked-in', 
            desc: 'Akash has started his route in South Zone 02.', 
            time: '5m ago', 
            type: 'success', 
            isRead: false,
            priority: 'low'
        },
        { 
            id: 108, 
            title: 'High Value Order Alert', 
            desc: 'Suresh just closed a ₹1.5L order at Star Bazaar.', 
            time: '15m ago', 
            type: 'alert', 
            isRead: false,
            priority: 'high'
        },
        { 
            id: 109, 
            title: 'Executive Missed Visit', 
            desc: 'Priya missed her scheduled appointment at 11 AM.', 
            time: '30m ago', 
            type: 'alert', 
            isRead: false,
            priority: 'high'
        },
        { 
            id: 104, 
            title: 'Target Achieved by Executive', 
            desc: 'Vikram has completed 100% of his daily target.', 
            time: '1h ago', 
            type: 'success', 
            isRead: false,
            priority: 'high'
        },
        { 
            id: 110, 
            title: 'Executive Check-out', 
            desc: 'Rahul completed his final visit for the day.', 
            time: '1h ago', 
            type: 'success', 
            isRead: true,
            priority: 'low'
        },
        { 
            id: 111, 
            title: 'Route Not Started', 
            desc: 'Kiran hasn\'t logged in to his assigned route yet.', 
            time: '2h ago', 
            type: 'alert', 
            isRead: false,
            priority: 'high'
        },
        { 
            id: 112, 
            title: 'Low Performance Alert', 
            desc: 'Team efficiency is 15% below target in Central Zone.', 
            time: '3h ago', 
            type: 'alert', 
            isRead: false,
            priority: 'high'
        },
        { 
            id: 102, 
            title: 'Daily Report Submitted', 
            desc: 'Megha has uploaded her end-of-day field report.', 
            time: '4h ago', 
            type: 'message', 
            isRead: true,
            priority: 'low'
        },
        { 
            id: 103, 
            title: 'New Leave Request', 
            desc: 'Rohit from West Zone has requested sick leave.', 
            time: '5h ago', 
            type: 'message', 
            isRead: false,
            priority: 'high'
        },
    ]);

    const markAllAsRead = useCallback((category) => {
        if (category === 'executive' || !category) {
            setExecutiveList(prev => prev.map(n => ({ ...n, isRead: true })));
        }
        if (category === 'manager' || !category) {
            setManagerList(prev => prev.map(n => ({ ...n, isRead: true })));
        }
    }, []);

    const markAsRead = useCallback((id) => {
        setExecutiveList(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setManagerList(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }, []);

    const unreadCount = executiveList.filter(n => !n.isRead).length + managerList.filter(n => !n.isRead).length;

    const value = {
        executiveList,
        setExecutiveList,
        managerList,
        setManagerList,
        unreadCount,
        markAllAsRead,
        markAsRead,
        // Combined for navbar dropdown
        allNotifications: [...executiveList, ...managerList].sort((a, b) => b.id - a.id)
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
