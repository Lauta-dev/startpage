'use client';

import React from 'react';

const SearchBar: React.FC = () => {
  return (
    <div className="mb-4 sm:mb-6">
      <input 
        type="text" 
        placeholder="Buscar..." 
        className="input w-full bg-transparent border-2 border-white/20 text-white placeholder:text-white/40 transition-all focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:outline-none text-sm sm:text-base"
      />
    </div>
  );
};

export default SearchBar;