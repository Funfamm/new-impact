import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import { AppRoute } from '../types';

export const FloatingHomeButton: React.FC = () => {
  const location = useLocation();

  if (location.pathname === AppRoute.HOME) return null;

  return (
    <Link 
      to={AppRoute.HOME}
      className="fixed bottom-6 right-6 z-50 p-3 bg-neon-blue/20 backdrop-blur-md border border-neon-blue/50 rounded-full text-neon-blue hover:bg-neon-blue hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:scale-110"
      title="Back to Home"
    >
      <Home className="w-6 h-6" />
    </Link>
  );
};