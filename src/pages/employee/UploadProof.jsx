import React from 'react';
import { Camera, Image as ImageIcon, Upload, CheckCircle2, ShieldCheck, Info, FileText } from 'lucide-react';
import Button from '../../components/Button';

const UploadProof = () => {
  const proofTypes = [
    { title: 'Store Front', desc: 'Capture the main board and entrance.', status: 'Pending', icon: ImageIcon, type: 'image' },
    { title: 'Selfie at Visit', desc: 'Verification of your presence.', status: 'Pending', icon: Camera, type: 'image' },
    { title: 'Product Display', desc: 'Proof of inventory check.', status: 'Pending', icon: ImageIcon, type: 'image' },
    { title: 'Official Document', desc: 'Upload ID or authorization letters.', status: 'Pending', icon: FileText, type: 'document' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Upload Visit Proof</h1>
        <p className="text-gray-500 font-medium">Verify your visit with geo-tagged images</p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-800 flex items-start gap-4">
        <Info className="text-blue-600 shrink-0 mt-1" size={20} />
        <div>
          <p className="text-sm font-bold text-blue-900 dark:text-blue-100">Automatic Location Detection</p>
          <p className="text-xs text-blue-700/80 dark:text-blue-300/80 mt-1">
            All photos are automatically geo-tagged and time-stamped. Make sure your GPS is enabled for valid verification.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {proofTypes.map((type, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center text-center group hover:border-indigo-100 transition-all">
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${type.status === 'Uploaded' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'
              }`}>
              <type.icon size={32} />
            </div>
            <h3 className="font-black text-gray-900 dark:text-white mb-2">{type.title}</h3>
            <p className="text-xs text-gray-400 font-medium px-4">{type.desc}</p>

            <div className="mt-8 w-full">
              {type.status === 'Uploaded' ? (
                <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 py-3 rounded-2xl font-black text-xs uppercase tracking-widest">
                  <CheckCircle2 size={14} />
                  Done
                </div>
              ) : (
                <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all">
                  {type.type === 'document' ? <Upload size={16} /> : <Camera size={16} />}
                  {type.type === 'document' ? 'Upload' : 'Capture'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="p-6 bg-indigo-50 text-indigo-600 rounded-[2rem]">
              <Upload size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Batch Upload</h3>
              <p className="text-sm text-gray-500">Pick multiple images from your gallery</p>
            </div>
          </div>
          <Button className="bg-indigo-600 text-white px-10 rounded-2xl py-4 font-black tracking-widest text-xs uppercase shadow-xl hover:scale-105 transition-all">
            Select Files
          </Button>
        </div>
      </div>

      <div className="flex justify-center mt-12">
        <div className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 rounded-full text-xs font-bold text-gray-400 border border-gray-100 dark:border-gray-800 shadow-sm">
          <ShieldCheck size={14} className="text-emerald-500" />
          Secured with blockchain verification
        </div>
      </div>
    </div>
  );
};

export default UploadProof;
