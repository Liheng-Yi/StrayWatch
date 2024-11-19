import React from 'react';

interface PurpleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline';
  children: React.ReactNode;
  className?: string;
}

const PurpleButton: React.FC<PurpleButtonProps> = ({ 
  variant = 'solid', 
  children, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'btn rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2';
  const variantClasses = variant === 'outline'
    ? 'btn-outline-purple border-2 text-purple hover:bg-purple-50'
    : 'btn-purple text-white';
    
  const customStyles = `
    .btn-purple {
      background-color: #9F7AEA;
      border-color: #9F7AEA;
    }
    .btn-purple:hover {
      background-color: #805AD5;
      border-color: #805AD5;
    }
    .btn-outline-purple {
      color: #9F7AEA;
      border-color: #9F7AEA;
    }
    .btn-outline-purple:hover {
      background-color: #9F7AEA;
      color: white;
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <button 
        className={`${baseClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {children}
      </button>
    </>
  );
};

export default PurpleButton;