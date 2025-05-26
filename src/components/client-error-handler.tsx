'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useStore';
import Cookies from 'js-cookie';

export function ClientErrorHandler() {
  const { logout } = useAuthStore();

  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // If it's a syntax error or parsing error, clear storage
      if (event.reason instanceof SyntaxError || 
          (typeof event.reason === 'string' && event.reason.includes('Unexpected token')) ||
          (event.reason?.message && event.reason.message.includes('Unexpected token'))) {
        console.warn('Detected syntax error in promise rejection, clearing storage');
        clearAllStorageAndReload();
      }
    };

    // Handle general JavaScript errors
    const handleError = (event: ErrorEvent) => {
      console.error('JavaScript error:', event.error);
      
      // If it's a syntax error or parsing error, clear storage
      if (event.error instanceof SyntaxError || 
          (event.error?.message && event.error.message.includes('Unexpected token'))) {
        console.warn('Detected syntax error, clearing storage');
        clearAllStorageAndReload();
      }
    };

    const clearAllStorageAndReload = () => {
      try {
        // Clear all storage
        if (typeof window !== 'undefined') {
          localStorage.clear();
          sessionStorage.clear();
          
          // Clear all cookies
          const cookies = ['auth-storage', 'election-storage', 'voting-storage', 'voter-storage', 'admin-storage'];
          cookies.forEach(cookie => {
            Cookies.remove(cookie);
          });
        }
        
        // Logout user
        logout();
        
        // Reload the page after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      } catch (error) {
        console.error('Failed to clear storage:', error);
        // Force reload as last resort
        window.location.reload();
      }
    };

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, [logout]);

  return null; // This component doesn't render anything
} 