import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all rounded-xl focus:outline-none disabled:opacity-50 active:scale-95';
  const variants = {
    primary: 'bg-primary-main text-white hover:bg-primary-dark',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border-2 border-gray-100 text-gray-700 hover:bg-gray-50',
    superAdmin: 'bg-superAdmin text-white hover:opacity-90 shadow-lg shadow-superAdmin/20',
    tenant: 'bg-tenant text-white hover:opacity-90 shadow-lg shadow-tenant/20',
    manager: 'bg-manager text-white hover:opacity-90 shadow-lg shadow-manager/20',
    employee: 'bg-employee text-white hover:opacity-90 shadow-lg shadow-employee/20',
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  return <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
};

export default Button;
