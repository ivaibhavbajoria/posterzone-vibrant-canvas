
import React, { createContext, useContext } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

interface Auth0ContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithRedirect: () => void;
  logout: () => void;
}

const Auth0Context = createContext<Auth0ContextType | undefined>(undefined);

export const Auth0ProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectUri = window.location.origin;

  if (!domain || !clientId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Auth0 Configuration Required</h2>
          <p className="text-gray-600">
            Please set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID environment variables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        scope: "openid profile email"
      }}
    >
      <Auth0ContextProvider>
        {children}
      </Auth0ContextProvider>
    </Auth0Provider>
  );
};

const Auth0ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const auth0 = useAuth0();

  const value = {
    user: auth0.user,
    isAuthenticated: auth0.isAuthenticated,
    isLoading: auth0.isLoading,
    loginWithRedirect: auth0.loginWithRedirect,
    logout: () => auth0.logout({ logoutParams: { returnTo: window.location.origin } })
  };

  return <Auth0Context.Provider value={value}>{children}</Auth0Context.Provider>;
};

export const useAuth0Context = () => {
  const context = useContext(Auth0Context);
  if (context === undefined) {
    throw new Error('useAuth0Context must be used within an Auth0ProviderWrapper');
  }
  return context;
};
