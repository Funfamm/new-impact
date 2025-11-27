import React, { useState } from 'react';
import { DollarSign, Coffee, HeartHandshake } from 'lucide-react';

export const Donations: React.FC = () => {
  const [amount, setAmount] = useState<number | ''>('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAmount(val === '' ? '' : Number(val));
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Live Background */}
      <div className="fixed inset-0 z-0">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-pink rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
         <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-neon-purple rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
         <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-neon-blue rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-neon-pink mb-4 drop-shadow-[0_0_10px_rgba(255,0,85,0.5)]">
            FUEL THE REVOLUTION
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your support empowers independent creators, sustains our AI infrastructure, and brings visionary stories to life. Every contribution builds the future of media.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left: Message of Encouragement */}
        <div className="bg-gray-900/60 backdrop-blur-xl p-10 rounded-3xl border border-gray-800 flex flex-col justify-center items-center text-center h-full shadow-2xl">
          <HeartHandshake className="w-20 h-20 text-neon-blue mb-6 animate-pulse-slow" />
          <h2 className="text-3xl font-display font-bold mb-6 text-white">Why We Need You</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-6">
             "Great art requires great community. We are building a platform where technology amplifies human creativity, not replaces it. Your donation isn't just funding a project; it's funding a movement."
          </p>
          <p className="text-neon-pink font-bold text-xl tracking-wider uppercase">
             Together We Create
          </p>
        </div>

        {/* Right: Actions */}
        <div className="space-y-8 bg-gray-900/60 backdrop-blur-xl p-10 rounded-3xl border border-gray-800/50 shadow-2xl">
            <div>
                 <h3 className="text-2xl font-bold text-white mb-2">Make a Contribution</h3>
                 <p className="text-gray-400 text-sm mb-6">Enter any amount you wish to contribute to the project.</p>
                 
                 <div className="relative mb-6">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">$</span>
                    <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full bg-black/50 border border-gray-700 rounded-xl py-4 pl-10 pr-4 text-2xl font-bold focus:border-neon-pink outline-none transition-colors text-white placeholder-gray-600"
                        value={amount}
                        onChange={handleAmountChange}
                        min="1"
                    />
                 </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                    href="https://www.paypal.me/AIImpactMedia" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#003087] hover:bg-[#0045c2] text-white py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
                >
                    <DollarSign className="w-5 h-5" /> PayPal
                </a>
                <a 
                    href="https://buymeacoffee.com/aiimpactmedia" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#FFDD00] hover:bg-[#ffea5c] text-black py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
                >
                    <Coffee className="w-5 h-5" /> Buy Me A Coffee
                </a>
            </div>

            <p className="text-xs text-center text-gray-500 mt-4">
                *Donations are voluntary. Perks are delivered via email within 24 hours.
            </p>
        </div>
      </div>
    </div>
  );
};