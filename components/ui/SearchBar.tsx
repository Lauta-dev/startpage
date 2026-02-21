'use client';
import React, { useState, useRef, useEffect } from 'react';
import { bangs } from '@/lib/bangs';

interface BangEntry {
  name: string;
  url: string;
}

function getFavicon(entry: BangEntry): string {
  try {
    const domain = new URL(entry.url.replace('[[user]]', 'test')).hostname;
    return `https://www.google.com/s2/favicons?sz=32&domain=${domain}`;
  } catch {
    return '';
  }
}

const SearchBar: React.FC = () => {
  const [inputValue, setInputValue]       = useState('');
  const [activeBang, setActiveBang]       = useState<{ code: string; entry: BangEntry } | null>(null);
  const [isClosing, setIsClosing]         = useState(false);
  const [placeholderText, setPlaceholderText] = useState('Buscar… o usa !w, !yt, !gh');
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const [dropdownItems, setDropdownItems] = useState<{ code: string; entry: BangEntry }[]>([]);
  const [focusedIndex, setFocusedIndex]   = useState(0);
  const inputRef     = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Build dropdown suggestions
  useEffect(() => {
    if (activeBang || !inputValue.startsWith('!') || inputValue.length < 2) {
      setDropdownItems([]);
      return;
    }
    const q = inputValue.toLowerCase();
    const matches = Object.entries(bangs as Record<string, BangEntry>)
      .filter(([code]) => code.startsWith(q))
      .slice(0, 6)
      .map(([code, entry]) => ({ code, entry }));
    setDropdownItems(matches);
    setFocusedIndex(0);
  }, [inputValue, activeBang]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setDropdownItems([]);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const applyBang = (code: string, entry: BangEntry) => {
    setActiveBang({ code, entry });
    setIsClosing(false);
    setInputValue('');
    setDropdownItems([]);
    crossfadePlaceholder(`Buscar en ${entry.name}…`, 300);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const removeBang = () => {
    if (!activeBang || isClosing) return;
    setIsClosing(true);
    crossfadePlaceholder('Buscar… o usa !w, !yt, !gh');
    setTimeout(() => {
      setActiveBang(null);
      setIsClosing(false);
      setInputValue('');
      inputRef.current?.focus();
    }, 280);
  };

  const crossfadePlaceholder = (text: string, delay = 0) => {
    setPlaceholderVisible(false);
    setTimeout(() => {
      setPlaceholderText(text);
      setPlaceholderVisible(true);
    }, delay || 220);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (activeBang) { setInputValue(val); return; }

    const spaceMatch = val.match(/^(![\w]+) $/);
    if (spaceMatch) {
      const code = spaceMatch[1].toLowerCase();
      const entry = (bangs as Record<string, BangEntry>)[code];
      if (entry) { applyBang(code, entry); return; }
    }
    setInputValue(val);
  };

  const openBangSuggestions = () => {
    const q = inputValue.toLowerCase();
    const source = Object.entries(bangs as Record<string, BangEntry>);
    const matches = (q.startsWith('!') && q.length >= 2
      ? source.filter(([code]) => code.startsWith(q))
      : source
    ).slice(0, 6).map(([code, entry]) => ({ code, entry }));
    setDropdownItems(matches);
    setFocusedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ctrl+Space → open bang suggestions
    if (e.ctrlKey && e.code === 'Space') {
      e.preventDefault();
      if (!activeBang) openBangSuggestions();
      return;
    }

    if (dropdownItems.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setFocusedIndex(i => Math.min(i + 1, dropdownItems.length - 1)); return; }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setFocusedIndex(i => Math.max(i - 1, 0)); return; }
      if (e.key === 'Tab' || e.key === 'Enter') {
        const item = dropdownItems[focusedIndex];
        if (item) { e.preventDefault(); applyBang(item.code, item.entry); return; }
      }
      if (e.key === 'Escape') { setDropdownItems([]); return; }
    }

    if (e.key === 'Backspace' && inputValue === '' && activeBang) { removeBang(); return; }

    if (e.key === 'Enter') {
      const query = inputValue.trim();
      if (activeBang) {
        if (!query) return;
        const url = activeBang.entry.url.replaceAll('[[user]]', encodeURIComponent(query));
        window.open(url, '_blank');
        return;
      }
      const parts = query.split(' ');
      const inlineBang = (bangs as Record<string, BangEntry>)[parts[0]?.toLowerCase()];
      if (inlineBang) {
        const url = inlineBang.url.replaceAll('[[user]]', encodeURIComponent(parts.slice(1).join(' ')));
        window.open(url, '_blank');
        return;
      }
      if (query) window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
  };

  return (
    <div ref={containerRef} className="mb-6 sm:mb-8 relative">

      {/* Search bar */}
      <div
        className="flex items-center w-full h-12 rounded-xl transition-all px-2"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onBlur={e  => (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        {/* Bang pill — no border/background, lives inside the input */}
        {activeBang && (
          <div
            className={`bang-pill${isClosing ? ' bang-pill--closing' : ''}`}
            onClick={removeBang}
            title="Clic o Backspace para quitar"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getFavicon(activeBang.entry)} alt="" className="bang-pill__icon" />
            <span className="bang-pill__name">{activeBang.entry.name}</span>
            <span className="bang-pill__divider" />
          </div>
        )}

        <div className="relative flex-1 h-full flex items-center">
          {/* Fake animated placeholder */}
          {inputValue === '' && (
            <span
              className="search-placeholder absolute left-1 pointer-events-none select-none text-base transition-opacity duration-200"
              style={{
                color: 'var(--text-muted, #666680)',
                opacity: placeholderVisible ? 1 : 0,
              }}
            >
              {placeholderText}
            </span>
          )}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="flex-1 w-full h-full bg-transparent focus:outline-none text-base px-1 placeholder:text-transparent"
            style={{ color: 'var(--text-primary)' }}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Dropdown suggestions */}
      {dropdownItems.length > 0 && (
        <ul
          className="menu absolute z-50 w-full mt-1 rounded-xl shadow-lg p-1"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          {dropdownItems.map(({ code, entry }, i) => (
            <li key={code}>
              <button
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                  i === focusedIndex ? 'bg-base-300' : ''
                }`}
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={() => setFocusedIndex(i)}
                onMouseDown={e => { e.preventDefault(); applyBang(code, entry); }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getFavicon(entry)} alt="" className="w-4 h-4 rounded-sm shrink-0" />
                <span className="font-mono font-semibold w-12 shrink-0" style={{ color: 'var(--accent)' }}>
                  {code}
                </span>
                <span className="flex-1 text-left">{entry.name}</span>
              </button>
            </li>
          ))}
          <li className="px-3 pt-1 pb-0.5">
            <span className="text-xs opacity-40">↑↓ navegar · ↵ / Tab seleccionar · Esc cerrar</span>
          </li>
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
