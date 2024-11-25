import React from 'react';

const Alert = ({ children, variant = "default", className = "" }) => {
  const baseStyles = "p-4 rounded-lg border text-sm flex gap-2 items-start";
  
  const variants = {
    default: "bg-gray-50 text-gray-800 border-gray-200",
    destructive: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    success: "bg-green-50 text-green-800 border-green-200",
    info: "bg-blue-50 text-blue-800 border-blue-200"
  };

  const variantStyles = variants[variant] || variants.default;

  return (
    <div role="alert" className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </div>
  );
};

const AlertDescription = ({ children, className = "" }) => {
  return (
    <div className={`text-sm flex-1 ${className}`}>
      {children}
    </div>
  );
};

const AlertTitle = ({ children, className = "" }) => {
  return (
    <h5 className={`font-medium leading-none tracking-tight ${className}`}>
      {children}
    </h5>
  );
};

export { Alert, AlertDescription, AlertTitle };