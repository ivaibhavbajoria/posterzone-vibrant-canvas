
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth0Context } from "@/contexts/Auth0Context";
import { Shield, User, Mail } from "lucide-react";

const Auth0AuthPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0Context();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Auth0AuthPage - Auth state:', { user, isAuthenticated, isLoading });
    
    if (isAuthenticated && user) {
      console.log('User is authenticated, should redirect');
      // Don't redirect here - let Layout handle it
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-posterzone-orange mx-auto mb-4"></div>
          <p>Authenticating...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <User className="h-6 w-6" />
              Welcome Back!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {user.picture && (
              <img 
                src={user.picture} 
                alt={user.name || 'User'} 
                className="w-16 h-16 rounded-full mx-auto"
              />
            )}
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-gray-600 text-sm flex items-center justify-center gap-1">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
            </div>
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/profile')}
                className="w-full bg-posterzone-orange hover:bg-posterzone-orange/90"
              >
                Go to Profile
              </Button>
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full"
              >
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <Shield className="h-6 w-6" />
            Welcome to PosterZone
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            Sign in to access your account, manage your orders, and explore our poster collections.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => {
                console.log('Starting Auth0 login');
                loginWithRedirect();
              }}
              className="w-full bg-posterzone-orange hover:bg-posterzone-orange/90"
            >
              Sign In with Auth0
            </Button>
            
            <p className="text-xs text-gray-500">
              Secure authentication powered by Auth0
            </p>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">
              New to PosterZone? Signing in will automatically create your account.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth0AuthPage;
