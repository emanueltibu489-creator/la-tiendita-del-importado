import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
  key?: string;
}

export function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const config = {
    success: {
      borderColor: 'border-l-4 border-[var(--color-luxury-gold)]',
      icon: <Check className="w-4 h-4 text-[var(--color-luxury-gold)]" />,
    },
    error: {
      borderColor: 'border-l-4 border-red-500',
      icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
    },
    info: {
      borderColor: 'border-l-4 border-purple-400',
      icon: <Info className="w-4 h-4 text-purple-400" />,
    },
  }[toast.type];

  return (
    <motion.div
      id={`toast-${toast.id}`}
      layout
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`p-4 rounded-xl flex items-center justify-between gap-3 shadow-2xl glass-card border border-purple-900/40 relative min-w-[280px] max-w-sm ${config.borderColor}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="shrink-0">{config.icon}</span>
        <span className="text-xs font-semibold text-gray-200">{toast.text}</span>
      </div>
      <button
        id={`toast-close-${toast.id}`}
        onClick={() => onClose(toast.id)}
        className="text-gray-500 hover:text-gray-300 transition-colors p-0.5"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemoveToast: (id: string) => void;
}

export function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
  return (
    <div id="toast-container" className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm w-full">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={onRemoveToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
