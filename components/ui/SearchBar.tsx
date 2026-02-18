'use client';

import React from 'react';
import { IconSearch } from '@tabler/icons-react';

const SearchBar: React.FC = () => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = (e.target as HTMLInputElement).value.trim();
      if (query) window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
  };

  return (
    <div className="mb-6 sm:mb-8 relative">
      <IconSearch
        size={20}
        stroke={1.5}
        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'var(--text-muted)' }}
      />
      <input
        type="text"
        placeholder="Buscar en Google..."
        onKeyDown={handleKeyDown}
        className="input w-full pl-11 h-12 rounded-xl text-base transition-all focus:outline-none"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
        }}
        onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
      />
    </div>
  );
};

export default SearchBar;
