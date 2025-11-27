
import React, { useState, useEffect } from 'react';
import { Play, X, Info } from 'lucide-react';
import { Movie } from '../types';
import { getSiteConfig, initializeBackend } from '../services/mockBackend';

export const Movies: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);

  // Fetch movies from dynamic config
  useEffect(() => {
    const init = async () => {
        await initializeBackend();
        setMovies(getSiteConfig().movies);
    };
    init();
  }, []);

  // Safe fallback if movies haven't loaded
  if (movies.length === 0) return <div className="min-h-screen bg-black text-white p-20">Loading Archive...</div>;

  const featuredMovie = movies[0];

  const filteredMovies = movies.filter(m => {
    const matchFilter = filter === 'All' || m.genre === filter;
    const matchSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      
      {/* Featured Header */}
      <div className="relative h-[60vh] w-full overflow-hidden group">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
          style={{ backgroundImage: `url(${featuredMovie.thumbnail})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-2xl">
           <span className="inline-block px-3 py-1 bg-neon-pink text-xs font-bold rounded mb-4">FEATURED PREMIERE</span>
           <h1 className="text-5xl md:text-7xl font-display font-bold mb-4 leading-tight">{featuredMovie.title}</h1>
           <p className="text-lg text-gray-300 mb-8 line-clamp-2">{featuredMovie.description}</p>
           <div className="flex gap-4">
             <button 
               onClick={() => setSelectedMovie(featuredMovie)}
               className="bg-white text-black px-8 py-3 rounded-md font-bold flex items-center gap-2 hover:bg-neon-blue hover:text-white transition-colors"
             >
               <Play className="fill-current w-5 h-5" /> PLAY NOW
             </button>
           </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-14 md:top-16 z-30 bg-black/90 backdrop-blur py-4 px-8 border-b border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto custom-scrollbar">
            {['All', 'Sci-Fi', 'Action', 'Drama'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === f ? 'bg-neon-purple text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search titles..."
            className="bg-gray-900 border border-gray-700 rounded-full px-4 py-1.5 text-sm focus:border-neon-blue outline-none w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <h2 className="text-xl font-bold mb-6 text-gray-400 uppercase tracking-widest border-l-4 border-neon-blue pl-3">Produced Films</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <div 
              key={movie.id}
              className="group relative bg-gray-900 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-[0_0_20px_rgba(188,19,254,0.3)] cursor-pointer"
              onClick={() => setSelectedMovie(movie)}
            >
              <div className="aspect-[2/3] w-full relative">
                <img 
                  src={movie.thumbnail} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-12 h-12 text-white fill-white" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white truncate">{movie.title}</h3>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                  <span>{movie.year}</span>
                  <span className="border border-gray-600 px-1 rounded">{movie.genre}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
          <div className="bg-gray-900 w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl relative border border-gray-800">
            <button 
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video bg-black">
               <video 
                 controls 
                 autoPlay 
                 className="w-full h-full"
                 src={selectedMovie.videoUrl}
                 poster={selectedMovie.thumbnail}
               >
                 Your browser does not support the video tag.
               </video>
            </div>
            <div className="p-8">
              <h2 className="text-3xl font-display font-bold mb-2">{selectedMovie.title}</h2>
              <div className="flex gap-4 text-sm text-gray-400 mb-4">
                <span className="text-green-400">98% Match</span>
                <span>{selectedMovie.year}</span>
                <span>{selectedMovie.genre}</span>
              </div>
              <p className="text-gray-300 leading-relaxed max-w-2xl">{selectedMovie.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
