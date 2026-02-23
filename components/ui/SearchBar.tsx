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

const mono = "'IBM Plex Mono', monospace";

const SearchBar: React.FC = () => {
  const [inputValue, setInputValue]           = useState('');
  const [activeBang, setActiveBang]           = useState<{ code: string; entry: BangEntry } | null>(null);
  const [isClosing, setIsClosing]             = useState(false);
  const [placeholderText, setPlaceholderText] = useState('buscar… o usa !w, !yt, !gh');
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const [dropdownItems, setDropdownItems]     = useState<{ code: string; entry: BangEntry }[]>([]);
  const [focusedIndex, setFocusedIndex]       = useState(0);
  const inputRef     = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
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
    crossfadePlaceholder('buscar… o usa !w, !yt, !gh');
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
        window.open(activeBang.entry.url.replaceAll('[[user]]', encodeURIComponent(query)), '_blank');
        return;
      }
      const parts = query.split(' ');
      const inlineBang = (bangs as Record<string, BangEntry>)[parts[0]?.toLowerCase()];
      if (inlineBang) {
        window.open(inlineBang.url.replaceAll('[[user]]', encodeURIComponent(parts.slice(1).join(' '))), '_blank');
        return;
      }
      if (query) window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
  };

  return (
    <div ref={containerRef} style={{ marginBottom: '24px', position: 'relative' }}>

      {/* ── search-bar ── */}
      <div
        className="search-bar-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          border: '1px solid var(--border)',
          borderRadius: '2px',
          background: 'var(--bg-raised)',
          transition: 'border-color 0.15s',
          height: '44px',
        }}
        /* focus-within via React — cambia border cuando el input tiene foco */
        onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onBlur={e  => (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        {/* .search-prompt ó .search-bang según si hay bang activo */}
        {activeBang ? (
          /* bang activo → pill igual al HTML */
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
        ) : (
          /* .search-prompt — hidden on mobile */
          !isMobile && (
            <span style={{
              padding: '0 12px',
              color: 'var(--accent)',
              fontSize: '1rem',
              fontWeight: 700,
              flexShrink: 0,
              userSelect: 'none',
              borderRight: '1px solid var(--border-dim)',
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}>›</span>
          )
        )}

        {/* input area */}
        <div style={{ position: 'relative', flex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
          {/* Placeholder — fade out when typing, fade in when cleared */}
          <span
            style={{
              position: 'absolute',
              left: '14px',
              pointerEvents: 'none',
              userSelect: 'none',
              fontFamily: mono,
              fontSize: '0.88rem',
              color: 'var(--text-lo)',
              fontStyle: 'italic',
              opacity: inputValue !== '' ? 0 : placeholderVisible ? 1 : 0,
              transform: inputValue !== '' ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'opacity 0.25s ease, transform 0.25s ease',
            }}
          >
            {placeholderText}
          </span>
          {/* .search-input */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: mono,
              fontSize: '0.88rem',
              color: 'var(--text-hi)',
              padding: '0 14px',
            }}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {/* .search-hint — hidden on mobile */}
        {!activeBang && !isMobile && (
          <span style={{
            padding: '0 14px',
            fontSize: '0.58rem',
            color: 'var(--text-lo)',
            flexShrink: 0,
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
          }}>
            ctrl+space
          </span>
        )}
      </div>

      {/* ── .search-dropdown ── */}
      {dropdownItems.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0, right: 0,
          background: 'var(--bg-raised)',
          border: '1px solid var(--border)',
          borderRadius: '2px',
          zIndex: 50,
          overflow: 'hidden',
        }}>
          {dropdownItems.map(({ code, entry }, i) => (
            <div
              key={code}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '9px 14px',
                cursor: 'pointer',
                borderBottom: '1px solid var(--border-dim)',
                background: i === focusedIndex ? 'var(--bg-hover)' : 'transparent',
                transition: 'background 0.1s',
              }}
              onMouseEnter={() => setFocusedIndex(i)}
              onMouseDown={e => { e.preventDefault(); applyBang(code, entry); }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getFavicon(entry)} alt="" style={{ width: '13px', height: '13px', borderRadius: '2px', opacity: 0.7, flexShrink: 0 }} />
              <span style={{ fontFamily: mono, fontSize: '0.68rem', fontWeight: 600, color: 'var(--accent)', width: '48px', flexShrink: 0 }}>
                {code}
              </span>
              <span style={{ fontFamily: mono, fontSize: '0.72rem', color: 'var(--text-mid)', flex: 1 }}>
                {entry.name}
              </span>
            </div>
          ))}
          {/* .dropdown-footer */}
          <div style={{
            padding: '6px 14px',
            fontSize: '0.55rem',
            color: 'var(--text-lo)',
            letterSpacing: '0.06em',
            borderTop: '1px solid var(--border-dim)',
            background: 'var(--bg)',
            fontFamily: mono,
          }}>
            ↑↓ navegar · ↵ / Tab seleccionar · Esc cerrar
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;