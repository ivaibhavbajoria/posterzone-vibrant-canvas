
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
    // If not loading and no user, redirect to auth page (except for public pages)
    const publicPaths = ['/', '/collections', '/trending', '/best-sellers', '/about', '/contact', '/auth'];
    const isPublicPath = publicPaths.includes(location.pathname) || location.pathname.startsWith('/poster/');
    
    if (!isLoading && !isAuthenticated && !isPublicPath) {
      navigate('/auth');
    }
  }, [isAuthenticated, isLoading, navigate, location]);

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
