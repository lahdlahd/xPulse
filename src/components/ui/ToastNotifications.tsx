'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export function useToastNotifications() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showNotification = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showNotification, removeToast };
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

/**
 * ToastContainer Component
 * Displays live notifications in bottom-right corner
 */
export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-900/90',
          border: 'border-emerald-500/50',
          icon: '✅',
          textColor: 'text-emerald-100'
        };
      case 'error':
        return {
          bg: 'bg-red-900/90',
          border: 'border-red-500/50',
          icon: '❌',
          textColor: 'text-red-100'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-900/90',
          border: 'border-yellow-500/50',
          icon: '⚠️',
          textColor: 'text-yellow-100'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-900/90',
          border: 'border-blue-500/50',
          icon: 'ℹ️',
          textColor: 'text-blue-100'
        };
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 400, y: 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 400, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-3 p-4 rounded-lg border backdrop-blur-sm ${styles.bg} ${styles.border} pointer-events-auto cursor-pointer max-w-sm`}
              onClick={() => onRemove(toast.id)}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{styles.icon}</span>
                <div className="flex-1">
                  <p className={`${styles.textColor} text-sm font-medium leading-relaxed`}>
                    {toast.message}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
