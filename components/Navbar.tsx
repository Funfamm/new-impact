
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppRoute } from '../types';
import { Menu, X, Bell, Check } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribe = () => {
    if (!isSubscribed) {
      const email = prompt("Enter your email to subscribe to upload notifications:");
      if (email && email.includes('@')) {
        setIsSubscribed(true);
        alert("Success! You are now subscribed to AI Impact Media updates.");
      }
    }
  };

  const navLinks = [
    { name: 'Home', path: AppRoute.HOME },
    { name: 'Movies', path: AppRoute.MOVIES },
    { name: 'Casting', path: AppRoute.CASTING },
    { name: 'Sponsors', path: AppRoute.SPONSORS },
    { name: 'Donations', path: AppRoute.DONATIONS },
    { name: 'Admin', path: AppRoute.ADMIN },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent ${
        scrolled || isOpen ? 'bg-black/90 backdrop-blur-sm border-white/5 shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
             {/* Mobile Hamburger */}
             <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-white focus:outline-none"
                >
                  <Menu className="h-6 w-6" />
                </button>
             </div>

             <Link to={AppRoute.HOME} className="flex items-center gap-1 group relative" onClick={() => setIsOpen(false)}>
                <span className="font-display font-black text-xl md:text-2xl tracking-tighter text-red-600 group-hover:text-neon-blue transition-colors duration-300">
                  AI IMPACT
                </span>
             </Link>

             {/* Desktop Links */}
             <div className="hidden md:flex ml-8 space-x-6">
                {navLinks.filter(l => l.name !== 'Admin').map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      location.pathname === link.path
                        ? 'text-white font-bold'
                        : 'text-gray-300 hover:text-gray-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
             </div>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-4 md:gap-6">
             <button 
                onClick={handleSubscribe}
                className="text-white hover:text-neon-blue transition-colors relative"
                title="Subscribe to Notifications"
             >
               {isSubscribed ? <Check className="w-5 h-5 md:w-6 md:h-6 text-neon-blue" /> : <Bell className="w-5 h-5 md:w-6 md:h-6" />}
               {!isSubscribed && <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>}
             </button>
             <Link to={AppRoute.ADMIN} className="hidden md:block w-8 h-8 rounded bg-gradient-to-br from-neon-blue to-neon-purple hover:scale-105 transition-transform"></Link>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <div className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
        
        {/* Menu Content */}
        <div className={`absolute top-0 bottom-0 left-0 w-[70%] bg-black border-r border-gray-800 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
           <div className="flex flex-col p-6 space-y-6 mt-14">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 text-lg font-medium ${
                    location.pathname === link.path ? 'text-white border-l-4 border-red-600 pl-3' : 'text-gray-400 pl-4'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="border-t border-gray-800 pt-6 mt-4">
                 <Link to={AppRoute.ADMIN} onClick={() => setIsOpen(false)} className="text-sm text-gray-500 block mb-4">Admin Dashboard</Link>
              </div>
           </div>
        </div>
      </div>
    </nav>
  );
};
