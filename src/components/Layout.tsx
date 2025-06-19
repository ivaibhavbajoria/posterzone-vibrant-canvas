
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

    // Define protected routes that require authentication
    const protectedPaths = ['/profile', '/order-history', '/favorites', '/cart', '/checkout'];
    const isProtectedPath = protectedPaths.some(path => location.pathname.startsWith(path));
    
    // If user is not authenticated and trying to access protected route, redirect to auth
    if (!isAuthenticated && isProtectedPath) {
      console.log('Unauthenticated user accessing protected route, redirecting to auth');
      navigate('/auth', { replace: true });
      return;
    }

    // If user is authenticated and on auth page, redirect to the intended page or home
    if (isAuthenticated && location.pathname === '/auth') {
      console.log('Authenticated user on auth page, redirecting to home');
      // Get the intended destination from sessionStorage or default to home
      const intendedPath = sessionStorage.getItem('intended-path') || '/';
      sessionStorage.removeItem('intended-path');
      navigate(intendedPath, { replace: true });
      return;
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  // Store intended path when redirecting to auth
  useEffect(() => {
    if (!isLoading && !isAuthenticated && location.pathname !== '/auth' && location.pathname !== '/') {
      const protectedPaths = ['/profile', '/order-history', '/favorites', '/cart', '/checkout'];
      const isProtectedPath = protectedPaths.some(path => location.pathname.startsWith(path));
      
      if (isProtectedPath) {
        sessionStorage.setItem('intended-path', location.pathname);
      }
    }
  }, [isAuthenticated, isLoading, location.pathname]);

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
