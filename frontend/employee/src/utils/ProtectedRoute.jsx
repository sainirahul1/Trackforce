import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import storage from '../utils/storage';

const ProtectedRoute = ({ children, role }) => {
  const { user, isLoading } = useAuth();

  // Show nothing or a loader while auth context is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 dark:bg-gray-950">
        <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin shadow-xl" />
      </div>
    );
  }

  // Fallback to storage utility
  const storedUser = storage.getUser();

  const activeUser = user || storedUser;

  // 1. Not logged in
  if (!activeUser) {
    return <Navigate to={`/${role}/login`} replace />;
  }

  // 2. Role mismatch (e.g., Manager trying to access Tenant routes)
  if (activeUser.role !== role) {
    console.warn(`[SECURITY] ProtectedRoute: Access denied. Expected role '${role}', but got '${activeUser.role}'.`);
    // The prompt says "Redirect to /login if unauthorized", reverting strategy to portal login
    return <Navigate to={`/${role}/login`} replace />;
  }

  // 3. Authorized
  return children;
};

export default ProtectedRoute;
