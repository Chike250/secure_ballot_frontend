'use client';

import { useAuthStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function AuthDebug() {
  const { 
    token, 
    user, 
    isAuthenticated, 
    isInitialized, 
    requiresMfa,
    logout 
  } = useAuthStore();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-background/95 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Auth Debug</CardTitle>
        <CardDescription className="text-xs">Development only</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div>
          <strong>Initialized:</strong> {isInitialized ? '✅' : '❌'}
        </div>
        <div>
          <strong>Authenticated:</strong> {isAuthenticated ? '✅' : '❌'}
        </div>
        <div>
          <strong>MFA Required:</strong> {requiresMfa ? '⚠️' : '✅'}
        </div>
        <div>
          <strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'None'}
        </div>
        <div>
          <strong>User:</strong> {user ? user.fullName || user.nin : 'None'}
        </div>
        <div>
          <strong>Role:</strong> {user?.role || 'None'}
        </div>
        {isAuthenticated && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={logout}
            className="w-full mt-2"
          >
            Logout
          </Button>
        )}
      </CardContent>
    </Card>
  );
} 