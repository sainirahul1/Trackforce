import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HelpCenter = ({ role }) => {
  const navigate = useNavigate();

  if (role === 'superadmin') return null;

  return (
    <div className="fixed bottom-8 right-8 z-[150] flex flex-col items-end">
      <button
        onClick={() => navigate(`/${role}/issues`)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 bg-indigo-600 text-white"
        title="Support Issues"
      >
        <HelpCircle size={28} />
      </button>
    </div>
  );
};

export default HelpCenter;
