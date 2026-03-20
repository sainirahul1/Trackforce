import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, Activity, Calendar } from 'lucide-react';
import Button from '../../components/Button';

const ManagerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy manager data
  const manager = {
    id: id,
    name: 'Sarah Anderson',
    designation: 'Operations Manager',
    email: 'sarah.anderson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    team: 'Team Alpha',
    status: 'On Duty',
    joinDate: '15 Mar 2023',
    avatar: `https://i.pravatar.cc/150?u=${id || 'default'}`
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="p-2 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Button>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Manager Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center shadow-sm">
            <img src={manager.avatar} alt={manager.name} className="w-32 h-32 rounded-full mb-4 border-4 border-white dark:border-gray-800 shadow-lg object-cover" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{manager.name}</h2>
            <p className="text-sm font-medium text-gray-500 mb-4">{manager.designation}</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
              {manager.status}
            </span>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Contact Info</h3>
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
              <Mail size={16} className="text-gray-400" />
              <span>{manager.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
              <Phone size={16} className="text-gray-400" />
              <span>{manager.phone}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
              <MapPin size={16} className="text-gray-400" />
              <span>{manager.location}</span>
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Work Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <Briefcase size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Team</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{manager.team}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Status</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{manager.status}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Joined Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{manager.joinDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Reports To</p>
                  <p className="font-semibold text-gray-900 dark:text-white">System Admin</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
             <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Recent Activity</h3>
             <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900 shrink-0 shadow-sm" />
                    <div className="w-0.5 h-full bg-gray-100 dark:bg-gray-800 mt-2" />
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Clocked In</p>
                    <p className="text-xs font-medium text-gray-500">Today, 09:00 AM</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-gray-900 shrink-0 shadow-sm" />
                    <div className="w-0.5 h-full bg-gray-100 dark:bg-gray-800 mt-2 opacity-0" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Completed Daily Report</p>
                    <p className="text-xs font-medium text-gray-500">Yesterday, 06:15 PM</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDetails;
