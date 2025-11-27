
import React, { useEffect, useState, useRef } from 'react';
import { getSubmissions, getSiteConfig, saveSiteConfig, initializeBackend } from '../services/mockBackend';
import { driveService } from '../services/googleDriveService';
import { Submission, SiteConfig, SlideAsset, Movie } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, X, Image, Save, Mail, Download, Rocket, Activity, Database, Cpu, Server, Plus, Trash2, Film, CheckCircle, Sparkles, RefreshCw, UploadCloud, Smartphone, Video, Cloud, CloudOff, LogIn } from 'lucide-react';
import { generateSystemHealthReport, generateCandidateAnalysis } from '../services/geminiService';

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'visuals'>('dashboard');

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  
  // Cloud Sync State
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // AI Features State
  const [systemReport, setSystemReport] = useState<string>('');
  const [loadingReport, setLoadingReport] = useState(false);
  const [candidateAnalysis, setCandidateAnalysis] = useState<string>('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  
  // Visual Manager State
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(getSiteConfig());
  const [configSaved, setConfigSaved] = useState(false);
  
  // File Upload Refs
  const landingInputRef = useRef<HTMLInputElement>(null);
  const castingInputRef = useRef<HTMLInputElement>(null);
  const movieThumbnailRef = useRef<HTMLInputElement>(null);
  const movieVideoRef = useRef<HTMLInputElement>(null);
  const [activeMovieId, setActiveMovieId] = useState<string | null>(null);

  // Initial Load & Auth Check
  useEffect(() => {
    if (isAuthenticated) {
        refreshData();
        if (driveService.accessToken) setIsCloudConnected(true);
    }
  }, [isAuthenticated]);

  const refreshData = async () => {
      setSubmissions(getSubmissions());
      const config = await initializeBackend();
      setSiteConfig(config);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Goodness@1011') {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleConnectDrive = async () => {
      const success = await driveService.signIn();
      if (success) {
          setIsCloudConnected(true);
          setIsSyncing(true);
          await refreshData();
          setIsSyncing(false);
      } else {
          alert("Failed to connect to Google Drive");
      }
  };

  const handleSaveConfig = async () => {
    setIsSyncing(true);
    await saveSiteConfig(siteConfig);
    setConfigSaved(true);
    setIsSyncing(false);
    setTimeout(() => setConfigSaved(false), 3000);
  };

  // --- MOVIE HANDLERS ---
  const handleAddMovie = () => {
    const newId = crypto.randomUUID();
    const newMovie: Movie = {
        id: newId,
        title: 'New Movie Title',
        thumbnail: 'https://via.placeholder.com/400x600',
        videoUrl: '',
        genre: 'Sci-Fi',
        year: new Date().getFullYear(),
        description: 'Enter description...'
    };
    
    setSiteConfig(prev => ({
        ...prev,
        movies: [...(prev.movies || []), newMovie]
    }));

    // Trigger file picker for the new movie immediately
    setActiveMovieId(newId);
    // Use timeout to ensure DOM is updated with new card before clicking ref
    setTimeout(() => {
        if (movieThumbnailRef.current) {
            movieThumbnailRef.current.click();
        }
    }, 100);
  };

  // ... (Keep existing system diagnostics and file helpers) ...
  const runSystemDiagnostics = async () => {
    setLoadingReport(true);
    const platformCounts = {
        Instagram: submissions.filter(s => s.platform === 'Instagram').length,
        Twitter: submissions.filter(s => s.platform === 'Twitter').length,
        TikTok: submissions.filter(s => s.platform === 'TikTok').length,
    };
    const report = await generateSystemHealthReport({
        submissions: submissions.length,
        platforms: platformCounts
    });
    setSystemReport(report);
    setLoadingReport(false);
  };

  const analyzeCandidate = async (sub: Submission) => {
    setLoadingAnalysis(true);
    setCandidateAnalysis('');
    const analysis = await generateCandidateAnalysis(sub.bio);
    setCandidateAnalysis(analysis);
    setLoadingAnalysis(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'landing' | 'casting' | 'movie-thumb' | 'movie-video') => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
            const result = event.target?.result as string;
            
            if (type === 'landing') {
                const newSlide: SlideAsset = {
                    id: crypto.randomUUID(),
                    name: 'Enter Title...',
                    url: result,
                    color: '#ffffff'
                };
                setSiteConfig(prev => ({ ...prev, landingSlides: [...prev.landingSlides, newSlide] }));
            } 
            else if (type === 'casting') {
                const newSlide: SlideAsset = {
                    id: crypto.randomUUID(),
                    name: 'Background',
                    url: result,
                    color: '#ffffff',
                    quote: 'ENTER MOTIVATIONAL QUOTE'
                };
                setSiteConfig(prev => ({ ...prev, castingSlides: [...prev.castingSlides, newSlide] }));
            }
            else if (type === 'movie-thumb' && activeMovieId) {
                 setSiteConfig(prev => ({
                    ...prev,
                    movies: prev.movies.map(m => m.id === activeMovieId ? { ...m, thumbnail: result } : m)
                 }));
            }
            else if (type === 'movie-video' && activeMovieId) {
                 setSiteConfig(prev => ({
                    ...prev,
                    movies: prev.movies.map(m => m.id === activeMovieId ? { ...m, videoUrl: result } : m)
                 }));
            }
        };
        
        reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleDeleteSlide = (section: 'landingSlides' | 'castingSlides', id: string) => {
    if(window.confirm("Delete this asset?")) {
        setSiteConfig(prev => ({
            ...prev,
            [section]: prev[section].filter(s => s.id !== id)
        }));
    }
  };

  const handleSlideChange = (section: 'landingSlides' | 'castingSlides', id: string, field: string, value: string) => {
    setSiteConfig(prev => ({
        ...prev,
        [section]: prev[section].map(slide => 
            slide.id === id ? { ...slide, [field]: value } : slide
        )
    }));
  };

  const handleDeleteMovie = (id: string) => {
    if(window.confirm("Delete this movie?")) {
        setSiteConfig(prev => ({
            ...prev,
            movies: prev.movies.filter(m => m.id !== id)
        }));
    }
  };

  const handleMovieChange = (id: string, field: string, value: any) => {
    setSiteConfig(prev => ({
        ...prev,
        movies: prev.movies.map(m => 
            m.id === id ? { ...m, [field]: value } : m
        )
    }));
  };

  const platformData = [
    { name: 'Instagram', count: submissions.filter(s => s.platform === 'Instagram').length },
    { name: 'Twitter', count: submissions.filter(s => s.platform === 'Twitter').length },
    { name: 'TikTok', count: submissions.filter(s => s.platform === 'TikTok').length },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-black relative overflow-hidden">
        <div className="relative z-10 w-full max-w-md bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">
           <form onSubmit={handleLogin} className="space-y-4">
             <h1 className="text-xl font-bold text-white text-center mb-6">SECURE LOGIN</h1>
             <input 
                 type="password" 
                 placeholder="Access Code"
                 className="w-full bg-black/60 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-neon-blue outline-none text-center"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 autoFocus
               />
             {error && <p className="text-red-500 text-xs text-center">INVALID CODE</p>}
             <button type="submit" className="w-full bg-neon-blue text-black font-bold py-3 rounded-lg hover:bg-white transition-all">
               AUTHENTICATE
             </button>
           </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 pb-12 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white border-l-4 border-neon-blue pl-4">Admin Dashboard</h1>
          <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
             <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded text-sm font-bold ${activeTab === 'dashboard' ? 'bg-neon-blue text-black' : 'text-gray-400'}`}>Dashboard</button>
             <button onClick={() => setActiveTab('visuals')} className={`px-4 py-2 rounded text-sm font-bold ${activeTab === 'visuals' ? 'bg-neon-blue text-black' : 'text-gray-400'}`}>Visuals & Content</button>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-xs text-gray-500 hover:text-white uppercase">Logout</button>
        </div>
        
        {activeTab === 'dashboard' && (
        <>
            {/* System Intelligence Panel */}
            <div className="bg-gradient-to-r from-gray-900 to-black p-6 rounded-xl border border-neon-purple/30 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20"><Activity className="w-24 h-24 text-neon-purple"/></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-white font-bold flex items-center gap-2"><Sparkles className="text-neon-purple"/> CORE AI INTELLIGENCE</h3>
                        <button onClick={runSystemDiagnostics} disabled={loadingReport} className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded text-white flex gap-1 items-center transition-colors">
                            {loadingReport ? <RefreshCw className="w-3 h-3 animate-spin"/> : <RefreshCw className="w-3 h-3"/>} 
                            {loadingReport ? 'ANALYZING...' : 'RUN DIAGNOSTICS'}
                        </button>
                    </div>
                    <div className="bg-black/40 p-4 rounded-lg border border-gray-800 min-h-[60px]">
                        {systemReport ? (
                            <p className="text-sm text-neon-blue font-mono leading-relaxed typing-effect">
                                "{systemReport}"
                            </p>
                        ) : (
                            <p className="text-xs text-gray-500 italic">System Idle. Initialize diagnostics for real-time AI analysis of platform metrics.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-1 bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-gray-400 mb-4 text-sm uppercase">Total Submissions</h3>
                    <p className="text-5xl font-bold text-white">{submissions.length}</p>
                </div>
                <div className="lg:col-span-2 bg-gray-900 p-6 rounded-xl border border-gray-800 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={platformData}><XAxis dataKey="name" stroke="#666" /><YAxis stroke="#666" /><Tooltip contentStyle={{ backgroundColor: '#111' }} /><Bar dataKey="count" fill="#bc13fe" /></BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-800">
                    <h3 className="font-bold text-white">Recent Submissions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-black/50 text-gray-200 uppercase text-xs"><tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Date</th><th className="px-6 py-3">Actions</th></tr></thead>
                        <tbody className="divide-y divide-gray-800">
                            {submissions.map(sub => (
                                <tr key={sub.id} className="hover:bg-white/5"><td className="px-6 py-4 text-white">{sub.name}</td><td className="px-6 py-4">{new Date(sub.timestamp).toLocaleDateString()}</td><td className="px-6 py-4"><button onClick={() => { setSelectedSubmission(sub); analyzeCandidate(sub); }} className="text-neon-blue hover:text-white flex gap-1"><FileText className="w-4 h-4"/> View</button></td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
        )}

        {/* VISUALS MANAGER TAB */}
        {activeTab === 'visuals' && (
            <div className="space-y-8 animate-fade-in pb-20">
                
                {/* CLOUD SYNC TOOLBAR */}
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex flex-wrap gap-4 items-center justify-between">
                    <div>
                        <h3 className="text-white font-bold text-sm flex items-center gap-2">
                             {isCloudConnected ? <Cloud className="text-green-500 w-4 h-4"/> : <CloudOff className="text-red-500 w-4 h-4"/>}
                             CLOUD SYNC: {isCloudConnected ? 'ONLINE' : 'OFFLINE'}
                        </h3>
                        <p className="text-xs text-gray-500">
                            {isCloudConnected ? 'Changes sync to Google Drive automatically.' : 'Data is stored locally only.'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {!isCloudConnected && (
                            <button onClick={handleConnectDrive} className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 rounded text-xs font-bold transition-colors">
                                <LogIn className="w-4 h-4" /> CONNECT GOOGLE DRIVE
                            </button>
                        )}
                        {isCloudConnected && (
                            <span className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded text-xs text-gray-400 border border-gray-700">
                                {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin text-neon-blue"/> : <CheckCircle className="w-4 h-4 text-green-500"/>}
                                {isSyncing ? 'SYNCING...' : 'UP TO DATE'}
                            </span>
                        )}
                    </div>
                </div>

                {/* HIDDEN FILE INPUTS */}
                <input type="file" ref={landingInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'landing')} />
                <input type="file" ref={castingInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'casting')} />
                <input type="file" ref={movieThumbnailRef} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'movie-thumb')} />
                <input type="file" ref={movieVideoRef} className="hidden" accept="video/*" onChange={(e) => handleFileSelect(e, 'movie-video')} />

                {/* 1. HOME SLIDESHOW */}
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-bold flex items-center gap-2"><Image className="text-neon-pink" /> Home Slideshow</h3>
                        <button onClick={() => landingInputRef.current?.click()} className="text-xs bg-neon-pink text-white hover:bg-white hover:text-black px-4 py-2 rounded-full font-bold flex gap-2 items-center transition-all"><UploadCloud className="w-4 h-4"/> Add Slide</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {siteConfig.landingSlides.map((slide) => (
                            <div key={slide.id} className="bg-black/50 p-4 rounded border border-gray-700 relative group">
                                <button onClick={() => handleDeleteSlide('landingSlides', slide.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-black/50 rounded-full p-1"><Trash2 className="w-4 h-4"/></button>
                                <label className="text-xs text-gray-500 uppercase block">Title (Edit)</label>
                                <input type="text" value={slide.name} onChange={(e) => handleSlideChange('landingSlides', slide.id, 'name', e.target.value)} className="w-full bg-gray-800 border-gray-600 rounded px-2 py-1 text-white text-sm mb-2"/>
                                <img src={slide.url} className="w-full h-32 object-cover rounded opacity-80"/>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. CASTING BACKGROUNDS */}
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-bold flex items-center gap-2"><Image className="text-neon-blue" /> Casting Backgrounds</h3>
                        <button onClick={() => castingInputRef.current?.click()} className="text-xs bg-neon-blue text-black hover:bg-white px-4 py-2 rounded-full font-bold flex gap-2 items-center transition-all"><UploadCloud className="w-4 h-4"/> Add Slide</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {siteConfig.castingSlides.map((slide) => (
                            <div key={slide.id} className="bg-black/50 p-4 rounded border border-gray-700 relative group">
                                <button onClick={() => handleDeleteSlide('castingSlides', slide.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-black/50 rounded-full p-1"><Trash2 className="w-4 h-4"/></button>
                                <label className="text-xs text-gray-500 uppercase block">Quote Override</label>
                                <input type="text" value={slide.quote || ''} onChange={(e) => handleSlideChange('castingSlides', slide.id, 'quote', e.target.value)} className="w-full bg-gray-800 border-gray-600 rounded px-2 py-1 text-white text-sm mb-2"/>
                                <img src={slide.url} className="w-full h-32 object-cover rounded opacity-80"/>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. MOVIES MANAGER */}
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-bold flex items-center gap-2"><Film className="text-green-400" /> Produced Films</h3>
                        <button onClick={handleAddMovie} className="text-xs bg-green-500 text-black hover:bg-white px-4 py-2 rounded-full font-bold flex gap-2 items-center transition-all"><Plus className="w-4 h-4"/> New Movie Entry</button>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {(siteConfig.movies || []).map((movie) => (
                            <div key={movie.id} className="bg-black/50 p-4 rounded-xl border border-gray-700 relative group flex flex-col md:flex-row gap-6">
                                <button onClick={() => handleDeleteMovie(movie.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-300 z-10 bg-black/50 rounded-full p-2"><Trash2 className="w-5 h-5"/></button>
                                
                                {/* Thumbnail Section */}
                                <div className="w-full md:w-40 flex-shrink-0 flex flex-col gap-2">
                                    <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden border border-gray-700 bg-gray-900">
                                        <img src={movie.thumbnail} className="w-full h-full object-cover"/>
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => { setActiveMovieId(movie.id); movieThumbnailRef.current?.click(); }}
                                                className="text-xs bg-white text-black px-3 py-1 rounded-full font-bold"
                                            >Change</button>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => { setActiveMovieId(movie.id); movieThumbnailRef.current?.click(); }}
                                        className="w-full text-xs bg-gray-800 hover:bg-gray-700 py-3 rounded text-gray-300 border border-gray-700 font-bold flex items-center justify-center gap-2"
                                    >
                                        <Image className="w-3 h-3"/> Upload Poster
                                    </button>
                                </div>

                                {/* Details Section */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="text-xs text-gray-500 uppercase font-bold">Movie Title</label>
                                        <input type="text" value={movie.title} onChange={(e) => handleMovieChange(movie.id, 'title', e.target.value)} className="w-full bg-gray-800 border-gray-600 rounded px-3 py-2 text-white font-display tracking-wide focus:border-neon-blue outline-none transition-colors"/>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-bold">Genre</label>
                                        <input type="text" value={movie.genre} onChange={(e) => handleMovieChange(movie.id, 'genre', e.target.value)} className="w-full bg-gray-800 border-gray-600 rounded px-3 py-2 text-gray-300"/>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-bold">Year</label>
                                        <input type="number" value={movie.year} onChange={(e) => handleMovieChange(movie.id, 'year', parseInt(e.target.value))} className="w-full bg-gray-800 border-gray-600 rounded px-3 py-2 text-gray-300"/>
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="text-xs text-gray-500 uppercase font-bold mb-1 flex justify-between items-center">
                                            <span>Video Source</span>
                                        </label>
                                        <div className="flex gap-2">
                                            <input type="text" value={movie.videoUrl} onChange={(e) => handleMovieChange(movie.id, 'videoUrl', e.target.value)} className="flex-1 bg-gray-800 border-gray-600 rounded px-3 py-2 text-blue-400 text-xs font-mono truncate" placeholder="https:// or Upload..."/>
                                            <button onClick={() => { setActiveMovieId(movie.id); movieVideoRef.current?.click(); }} className="bg-gray-700 hover:bg-white hover:text-black text-white px-3 rounded text-xs font-bold flex items-center gap-1 transition-colors">
                                                <Video className="w-3 h-3"/> Upload
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="text-xs text-gray-500 uppercase font-bold">Description</label>
                                        <textarea rows={2} value={movie.description} onChange={(e) => handleMovieChange(movie.id, 'description', e.target.value)} className="w-full bg-gray-800 border-gray-600 rounded px-3 py-2 text-gray-300 text-sm focus:border-neon-blue outline-none"/>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                         <button onClick={handleAddMovie} className="w-full py-4 border-2 border-dashed border-gray-800 rounded-xl text-gray-500 hover:border-gray-600 hover:text-white transition-colors flex flex-col items-center justify-center gap-2">
                            <Plus className="w-6 h-6" />
                            <span className="font-bold">ADD ANOTHER MOVIE</span>
                         </button>
                    </div>
                </div>

                <div className="sticky bottom-6 flex justify-end">
                    <button 
                        onClick={handleSaveConfig}
                        className="bg-neon-blue text-black font-bold py-4 px-10 rounded-full hover:bg-white flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)] z-50"
                    >
                        {configSaved ? <CheckCircle className="w-5 h-5"/> : <Save className="w-5 h-5" />}
                        {configSaved ? 'PUBLISHED LIVE' : 'PUBLISH CHANGES'}
                    </button>
                </div>
            </div>
        )}
      </div>

      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 w-full max-w-2xl rounded-2xl border border-gray-700 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/40">
              <h2 className="text-xl font-bold text-white">Candidate Dossier</h2>
              <button onClick={() => setSelectedSubmission(null)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Name</label>
                  <p className="text-white font-medium">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Email</label>
                  <p className="text-white font-medium">{selectedSubmission.email}</p>
                </div>
              </div>

              {/* AI SCOUT ANALYSIS */}
              <div className="bg-neon-purple/5 border border-neon-purple/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-neon-purple" />
                    <span className="text-xs font-bold text-neon-purple uppercase">AI Scout Analysis</span>
                </div>
                {loadingAnalysis ? (
                    <div className="flex items-center gap-2 text-xs text-gray-500 animate-pulse"><RefreshCw className="w-3 h-3 animate-spin"/> Processing bio...</div>
                ) : (
                    <p className="text-sm text-gray-300 italic">"{candidateAnalysis}"</p>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase mb-2 block">Attached Assets</label>
                <div className="space-y-2">
                  {selectedSubmission.files.map((file, idx) => (
                    <a key={idx} href={file.url} download={file.name} className="flex items-center gap-3 p-3 bg-gray-800 rounded hover:bg-gray-700 transition-colors border border-gray-700 group">
                      <Download className="w-4 h-4 text-neon-blue" />
                      <span className="text-sm text-gray-200 truncate flex-1">{file.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-800 bg-black/40 flex justify-end gap-3">
               <a href={`mailto:${selectedSubmission.email}`} className="px-4 py-2 text-sm bg-gray-800 text-white font-bold rounded hover:bg-gray-700 flex items-center gap-2"><Mail className="w-4 h-4" /> Reply</a>
               <button onClick={() => setSelectedSubmission(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
