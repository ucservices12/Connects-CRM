import React, { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToasterContextValue {
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
}

const ToasterContext = createContext<ToasterContextValue | undefined>(undefined);

export const useToaster = () => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToaster must be used within a ToasterProvider');
  }
  return context;
};

export const ToasterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [toasts]);

  return (
    <ToasterContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg flex items-center gap-3 text-white transform transition-all duration-300 ease-in-out animate-enter ${
              toast.type === 'success'
                ? 'bg-green-600'
                : toast.type === 'error'
                ? 'bg-red-600'
                : 'bg-blue-600'
            }`}
            style={{ maxWidth: '24rem' }}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={20} />
            ) : toast.type === 'error' ? (
              <AlertCircle size={20} />
            ) : (
              <Info size={20} />
            )}
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/80 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes enter {
          0% { opacity: 0; transform: translateX(2rem); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-enter {
          animation: enter 0.3s ease-out forwards;
        }
      `}</style>
    </ToasterContext.Provider>
  );
};

export const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => {
          if (prev.length > 0) {
            return prev.slice(1);
          }
          return prev;
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [toasts]);

  // Global event listener for toasts
  useEffect(() => {
    const handleToast = (event: CustomEvent) => {
      const { type, message } = event.detail;
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, message }]);
    };

    window.addEventListener('toast' as any, handleToast as any);
    return () => window.removeEventListener('toast' as any, handleToast as any);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg flex items-center gap-3 text-white transform transition-all duration-300 ease-in-out ${
            toast.type === 'success'
              ? 'bg-green-600'
              : toast.type === 'error'
              ? 'bg-red-600'
              : 'bg-blue-600'
          }`}
          style={{ maxWidth: '24rem', animationName: 'toastEnter' }}
        >
          {toast.type === 'success' ? (
            <CheckCircle size={20} />
          ) : toast.type === 'error' ? (
            <AlertCircle size={20} />
          ) : (
            <Info size={20} />
          )}
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/80 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
      ))}
      <style jsx>{`
        @keyframes toastEnter {
          from { opacity: 0; transform: translateY(1rem); }
          to { opacity: 1; transform: translateY(0); }
        }
        div[style*="animationName: toastEnter"] {
          animation: toastEnter 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// Helper function to show toasts from anywhere
export const toast = {
  success: (message: string) => {
    window.dispatchEvent(
      new CustomEvent('toast', { detail: { type: 'success', message } })
    );
  },
  error: (message: string) => {
    window.dispatchEvent(
      new CustomEvent('toast', { detail: { type: 'error', message } })
    );
  },
  info: (message: string) => {
    window.dispatchEvent(
      new CustomEvent('toast', { detail: { type: 'info', message } })
    );
  },
};