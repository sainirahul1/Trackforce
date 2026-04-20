import React from 'react';
import { useLocation } from 'react-router-dom';
import MissionForm from './MissionForm';

const LogVisit = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultTab = queryParams.get('type') || 'mission';

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/20 pb-24">
      {/* 
        The MissionForm is now a self-contained Professional Module.
        It handles its own Tabs, Headers, and Submission logic.
        We just pass it the initial type from the URL.
      */}
      <MissionForm type={defaultTab} isEmbedded={false} />
    </div>
  );
};

export default LogVisit;
