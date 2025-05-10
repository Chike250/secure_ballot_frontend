import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

export const useNotification = () => {
  const showNotification = useCallback(
    (message: string, type: NotificationType = 'info') => {
      switch (type) {
        case 'success':
          toast.success(message);
          break;
        case 'error':
          toast.error(message);
          break;
        case 'warning':
          toast(message, {
            icon: '⚠️',
          });
          break;
        default:
          toast(message);
      }
    },
    []
  );

  const showSuccess = useCallback(
    (message: string) => showNotification(message, 'success'),
    [showNotification]
  );

  const showError = useCallback(
    (message: string) => showNotification(message, 'error'),
    [showNotification]
  );

  const showWarning = useCallback(
    (message: string) => showNotification(message, 'warning'),
    [showNotification]
  );

  const showInfo = useCallback(
    (message: string) => showNotification(message, 'info'),
    [showNotification]
  );

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}; 