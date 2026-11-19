import React from 'react';
import { Check, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  isRtl?: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, isRtl }) => {
  if (!message) return null;

  return (
    <div
      className={`fixed bottom-5 z-50 flex items-center gap-3 bg-[#18181A] text-white px-4 py-3 shadow-xl border border-neutral-800 text-xs tracking-wide animate-in fade-in slide-in-from-bottom-3 duration-200 ${
        isRtl ? 'left-5' : 'right-5'
      }`}
      role="status"
      aria-live="polite"
    >
      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
      <span className="font-sans">{message}</span>
      <button
        onClick={onClose}
        className="text-neutral-400 hover:text-white ms-2 cursor-pointer"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
