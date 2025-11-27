import React from 'react';
import { Navbar } from './Navbar';
import { useLocation } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  // Optional: Hide navbar on specific pages if needed, but keeping it consistent for now.
  
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-neon-pink selection:text-white">
      <Navbar />
      <main className="animate-fade-in">
        {children}
      </main>
    </div>
  );
};
