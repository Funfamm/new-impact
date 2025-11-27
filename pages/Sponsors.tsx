
import React, { useState } from 'react';
import { Send, Star } from 'lucide-react';
import { sendConfirmationEmail } from '../services/mockBackend';

export const Sponsors: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ company: '', email: '', message: '' });
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Exact requested format
    const response = `ACKNOWLEDGEMENT:
Dear ${form.company}, Thank you for reaching out to AI Impact Media. We appreciate your message and are reviewing its contents.
 We will be in touch shortly. 
Sincerely,`;
    
    // Simulate Backend Email
    await sendConfirmationEmail(form.email, form.company, 'sponsor');
    
    setAiResponse(response);
    setSubmitted(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Live Background */}
      <div className="fixed inset-0 z-0">
         <div className="absolute top-0 -left-4 w-72 h-72 bg-neon-purple rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
         <div className="absolute top-0 -right-4 w-72 h-72 bg-neon-blue rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
         <div className="absolute -bottom-8 left-20 w-72 h-72 bg-neon-pink rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 items-center min-h-[60vh]">
        
        {/* Left: Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
              PARTNER WITH US
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
              Join the future of media. <br/>
              Our sponsors gain exclusive access to our casting archives, premiere events, and AI innovation labs.
            </p>
          </div>
          
          <div className="p-6 bg-black/30 backdrop-blur rounded-xl border border-white/10">
              <p className="text-gray-400 italic">"Be the signal in the noise."</p>
          </div>
        </div>

        {/* Right: Form */}
        <div>
           {!submitted ? (
             <div className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-800 shadow-2xl">
               <h2 className="text-2xl font-bold mb-6">Sponsorship Inquiry</h2>
               <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                   <label className="block text-sm text-gray-400 mb-2">Company Name</label>
                   <input 
                     type="text" 
                     required
                     className="w-full bg-black/50 border border-gray-700 rounded p-3 focus:border-neon-blue outline-none text-white"
                     value={form.company}
                     onChange={e => setForm({...form, company: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="block text-sm text-gray-400 mb-2">Contact Email</label>
                   <input 
                     type="email" 
                     required
                     className="w-full bg-black/50 border border-gray-700 rounded p-3 focus:border-neon-blue outline-none text-white"
                     value={form.email}
                     onChange={e => setForm({...form, email: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="block text-sm text-gray-400 mb-2">Message</label>
                   <textarea 
                     rows={4}
                     required
                     className="w-full bg-black/50 border border-gray-700 rounded p-3 focus:border-neon-blue outline-none text-white"
                     value={form.message}
                     onChange={e => setForm({...form, message: e.target.value})}
                   ></textarea>
                 </div>
                 <button 
                  disabled={isLoading}
                  className="w-full bg-white text-black font-bold py-4 rounded hover:bg-neon-blue hover:text-white transition-all flex justify-center items-center gap-2"
                 >
                   {isLoading ? 'SENDING...' : 'SEND PROPOSAL'} <Send className="w-4 h-4" />
                 </button>
               </form>
             </div>
           ) : (
             <div className="bg-neon-blue/10 border border-neon-blue/30 p-8 rounded-2xl text-center h-full flex flex-col items-center justify-center backdrop-blur-md">
               <Star className="w-16 h-16 text-neon-blue mb-4 animate-pulse" />
               <h2 className="text-2xl font-bold text-white mb-2">Proposal Received</h2>
               <p className="text-gray-400 mb-6">We will be in touch shortly.</p>
               
               {aiResponse && (
                 <div className="bg-black/50 p-4 rounded-lg max-w-sm text-sm text-left border-l-4 border-neon-purple whitespace-pre-wrap">
                   {aiResponse}
                 </div>
               )}
               <button onClick={() => setSubmitted(false)} className="mt-6 text-sm underline text-gray-400 hover:text-white">Send another</button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
