
import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth0Context } from '@/contexts/Auth0Context';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  const { isAuthenticated, isLoading } = useAuth0Context();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('Layout - Auth state:', { isAuthenticated, isLoading, pathname: location.pathname });
    
    // Don't do any redirects while loading
    if (isLoading) return;

    // If user is authenticated and on auth page, redirect to home
    if (isAuthenticated && location.pathname === '/auth') {
      console.log('Authenticated user on auth page, redirecting to home');
      navigate('/');
      return;
    }

    // Define protected routes that require authentication
    const protectedPaths = ['/profile', '/order-history', '/favorites', '/cart', '/checkout'];
    const isProtectedPath = protectedPaths.includes(location.pathname);
    
    // If user is not authenticated and trying to access protected route, redirect to auth
    if (!isAuthenticated && isProtectedPath) {
      console.log('Unauthenticated user accessing protected route, redirecting to auth');
      navigate('/auth');
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-posterzone-orange mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
