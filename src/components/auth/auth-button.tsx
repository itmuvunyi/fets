import React from 'react';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'orange';
}

export const AuthButton: React.FC<AuthButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = "px-12 py-3 rounded-full font-bold tracking-widest text-sm transition-all outline-none uppercase";
  
  const variants = {
    primary: "bg-[#f3f4f6] text-gray-700 shadow-[6px_6px_10px_#d1d5db,-6px_-6px_10px_#ffffff] hover:shadow-[4px_4px_8px_#d1d5db,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_10px_#d1d5db,inset_-4px_-4px_10px_#ffffff]",
    orange: "bg-[#F59E0B] text-white shadow-[6px_6px_10px_#d98b09,-6px_-6px_10px_#fbb230] hover:shadow-[4px_4px_8px_#d98b09,-4px_-4px_8px_#fbb230] active:shadow-[inset_4px_4px_10px_#d98b09,inset_-4px_-4px_10px_#fbb230] border border-amber-400/20"
  };

  return (
    <button className={`${baseClasses} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
};
