
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppRoute } from '../types';
import { Users, Film, Handshake, Heart } from 'lucide-react';
import { getSiteConfig, initializeBackend } from '../services/mockBackend';

export const Home: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [landingSlides, setLandingSlides] = useState(getSiteConfig().landingSlides);

  // Initialize data on mount
  useEffect(() => {
      const init = async () => {
          await initializeBackend();
          setLandingSlides(getSiteConfig().landingSlides);
      };
      init();
  }, []);

  // Slideshow Logic: Change image every 6 seconds
  useEffect(() => {
    if (landingSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % landingSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [landingSlides.length]);

  const currentAsset = landingSlides[currentIndex] || { name: 'LOADING', color: '#fff', url: '' };
  const currentColor = currentAsset.color;

  const navItems = [
    { 
      title: 'CASTING', 
      icon: Users, 
      route: AppRoute.CASTING
    },
    { 
      title: 'MOVIES', 
      icon: Film, 
      route: AppRoute.MOVIES
    },
    { 
      title: 'SPONSOR', 
      icon: Handshake, 
      route: AppRoute.SPONSORS
    }
  ];

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden font-display selection:bg-neon-purple selection:text-white">
      
      {/* BACKGROUND SLIDESHOW LAYER */}
      <div className="absolute inset-0 z-0">
        {landingSlides.map((asset, index) => (
          <div
            key={asset.id}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
             {/* Image with Gentle Zoom Effect */}
             <div 
               className={`absolute inset-0 bg-cover bg-center transition-transform duration-[20000ms] ease-out ${
                 index === currentIndex ? 'scale-110' : 'scale-100'
               }`}
               style={{ backgroundImage: `url("${asset.url}")` }}
             ></div>
             {/* Gradient Overlays for readability */}
             <div className="absolute inset-0 bg-black/40"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
          </div>
        ))}
      </div>

      {/* CONTENT LAYER */}
      <div className="relative z-10 h-full flex flex-col justify-end items-center px-4 pb-16 md:pb-24">
         
         {/* CENTER TITLE - Derived from File Name */}
         {/* Dynamic Color Style */}
         <div className="w-full flex justify-center mb-8 md:mb-12 transition-all duration-1000">
            <h1 
              key={currentAsset.name} 
              className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter text-center uppercase animate-fade-in drop-shadow-2xl"
              style={{
                WebkitTextStroke: `2px ${currentColor}`,
                color: 'transparent',
                textShadow: `0 0 30px ${currentColor}80`
              }}
            >
              {currentAsset.name}
            </h1>
         </div>

         {/* BOTTOM NAVIGATION BLOCKS */}
         <div className="w-full max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               
               {/* Main Nav Items */}
               {navItems.map((item) => (
                 <Link 
                   key={item.title} 
                   to={item.route}
                   className="group flex flex-col items-center justify-center p-6 md:p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl transition-all duration-300 hover:bg-black/60 hover:scale-105"
                   style={{
                     borderColor: 'rgba(255,255,255,0.1)',
                   }}
                 >
                    <item.icon 
                      className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 transition-colors duration-300" 
                      style={{ color: currentColor }}
                    />
                    <span 
                      className="text-sm md:text-lg font-bold tracking-widest transition-colors duration-300"
                      style={{ color: 'white' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = currentColor}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                    >
                      {item.title}
                    </span>
                 </Link>
               ))}

               {/* Donate Button - Always active dynamic color */}
               <Link 
                  to={AppRoute.DONATIONS}
                  className="group flex flex-col items-center justify-center p-6 md:p-8 bg-black/40 backdrop-blur-md border rounded-xl transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: `${currentColor}60`,
                    boxShadow: `0 0 20px ${currentColor}20`
                  }}
               >
                   <Heart 
                    className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 animate-pulse-slow" 
                    style={{ color: currentColor, fill: currentColor }}
                   />
                   <span 
                    className="text-sm md:text-lg font-bold tracking-widest text-white"
                   >
                     DONATE
                   </span>
               </Link>

            </div>
         </div>

      </div>
    </div>
  );
};
