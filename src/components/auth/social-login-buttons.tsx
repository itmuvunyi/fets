import React from 'react';
import { Facebook, Github } from 'lucide-react';

export const SocialLoginButtons = () => {
  return (
    <div className="flex gap-4 justify-center my-6">
      <button className="flex items-center justify-center w-12 h-12 rounded-full bg-[#f3f4f6] shadow-[4px_4px_10px_#d1d5db,-4px_-4px_10px_#ffffff] hover:shadow-[inset_4px_4px_10px_#d1d5db,inset_-4px_-4px_10px_#ffffff] transition-all text-gray-700">
        <Facebook size={20} className="fill-current" />
      </button>
      <button className="flex items-center justify-center w-12 h-12 rounded-full bg-[#f3f4f6] shadow-[4px_4px_10px_#d1d5db,-4px_-4px_10px_#ffffff] hover:shadow-[inset_4px_4px_10px_#d1d5db,inset_-4px_-4px_10px_#ffffff] transition-all text-gray-700">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
        </svg>
      </button>
      <button className="flex items-center justify-center w-12 h-12 rounded-full bg-[#f3f4f6] shadow-[4px_4px_10px_#d1d5db,-4px_-4px_10px_#ffffff] hover:shadow-[inset_4px_4px_10px_#d1d5db,inset_-4px_-4px_10px_#ffffff] transition-all text-gray-700">
        <Github size={20} className="fill-current" />
      </button>
    </div>
  );
};
