import React from 'react';

/**
 * Premium Skeleton Component
 * Features a high-fidelity shimmer effect with layout-specific variants.
 */
const Skeleton = ({ className = '', variant = 'rectangle' }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circle': return 'rounded-full';
      case 'rounded': return 'rounded-[2rem]';
      default: return 'rounded-xl';
    }
  };

  return (
    <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-800/80 ${getVariantClasses()} ${className}`}>
      {/* Premium Shimmer Overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent shadow-inner pointer-events-none" />
      
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default Skeleton;
