import React from 'react';

const Skeleton = ({ className = '', variant = 'rectangle' }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circle': return 'rounded-full';
      case 'rounded': return 'rounded-2xl';
      default: return 'rounded-lg';
    }
  };

  return (
    <div 
      className={`animate-pulse bg-gray-200 dark:bg-gray-800/80 ${getVariantClasses()} ${className}`}
    />
  );
};

export default Skeleton;
