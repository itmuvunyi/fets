import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  placeholder: string;
}

export const InputField: React.FC<InputFieldProps> = ({ type, placeholder, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full relative">
      <input
        type={inputType}
        placeholder={placeholder}
        className="w-full px-6 py-4 bg-[#f3f4f6] text-gray-700 placeholder-gray-400 rounded-full outline-none shadow-[4px_4px_10px_#d1d5db,-4px_-4px_10px_#ffffff] focus:shadow-[inset_4px_4px_10px_#d1d5db,inset_-4px_-4px_10px_#ffffff] transition-all"
        {...props}
      />
      {isPassword && props.value && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};
