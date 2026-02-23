'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IconX, IconDeviceFloppy, IconWorldWww, IconTag, IconChevronDown, IconCheck } from '@tabler/icons-react';
import { Bookmark } from '@/types/bookmark';
import { Category } from '@/actions/getCategories';

interface BookmarkModalProps {
  isOpen: boolean;
  isClosing: boolean;
  editingBookmark: { id: number; bookmark: Bookmark } | null;
  categories: Category[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>, categoryId: number, categoryName: string) => void;
}

const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

/* ─────────────────────────────────────────────
   CategorySelect — custom dropdown igual al AccentPicker
   Primer item siempre es "+ Nueva categoría"
───────────────────────────────────────────── */
interface CategorySelectProps {
  categories: Category[];
  selectedId: number | null;       // null = modo "nueva"
  onSelect: (id: number | null) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ categories, selectedId, onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLabel = selectedId === null
    ? '+ Nueva categoría'
    : (categories.find(c => c.id === selectedId)?.name ?? '');

  const isNew = selectedId === null;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger — mismo estilo que AccentPicker */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          ...mono,
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '7px 10px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '2px',
          color: isNew ? 'var(--accent)' : 'var(--text-mid)',
          fontSize: '0.68rem',
          letterSpacing: '0.04em',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
          (e.currentTarget as HTMLElement).style.color = 'var(--text-hi)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLElement).style.color = isNew ? 'var(--accent)' : 'var(--text-mid)';
        }}
      >
        <span style={{ flex: 1, textAlign: 'left' }}>{currentLabel}</span>
        <IconChevronDown
          size={12} stroke={2}
          style={{
            transition: 'transform 0.15s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0,
          }}
        />
      </button>

      {/* Dropdown — mismo patrón que AccentPicker */}
      {open && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 4px)',  // abre hacia arriba (no tapa los botones)
          left: 0,
          minWidth: '100%',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '2px',
          zIndex: 60,
          overflow: 'hidden',
        }}>
          {/* "+ Nueva categoría" — primer item especial */}
          <button
            type="button"
            onClick={() => { onSelect(null); setOpen(false); }}
            style={{
              ...mono,
              width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 12px',
              fontSize: '0.68rem', letterSpacing: '0.04em',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--border-dim)',
              cursor: 'pointer',
              color: 'var(--accent)',
              transition: 'background 0.1s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >
            + Nueva categoría
          </button>

          {/* Categorías existentes */}
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => { onSelect(cat.id); setOpen(false); }}
              style={{
                ...mono,
                width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 12px',
                fontSize: '0.68rem', letterSpacing: '0.04em',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--border-dim)',
                cursor: 'pointer',
                color: cat.id === selectedId ? 'var(--accent)' : 'var(--text-mid)',
                transition: 'background 0.1s, color 0.1s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-hi)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = cat.id === selectedId ? 'var(--accent)' : 'var(--text-mid)';
              }}
            >
              <span style={{ flex: 1, textAlign: 'left' }}>{cat.name}</span>
              {cat.id === selectedId && <IconCheck size={12} stroke={2.5} style={{ color: 'var(--accent)', flexShrink: 0 }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   BookmarkModal principal
───────────────────────────────────────────── */
const BookmarkModal: React.FC<BookmarkModalProps> = ({
  isOpen, isClosing, editingBookmark, categories, onClose, onSubmit,
}) => {
  const [siteValue, setSiteValue]         = useState('');
  const [nameValue, setNameValue]         = useState('');
  const [selectedCatId, setSelectedCatId] = useState<number | null>(categories[0]?.id ?? null);
  const [newCatValue, setNewCatValue]     = useState('');

  const isNewCat = selectedCatId === null;

  useEffect(() => {
    if (isOpen) {
      setSiteValue(editingBookmark?.bookmark.url ?? '');
      setNameValue(editingBookmark?.bookmark.title ?? '');
      setNewCatValue('');
      if (editingBookmark?.bookmark.category) {
        const match = categories.find(c => c.name === editingBookmark.bookmark.category);
        setSelectedCatId(match?.id ?? categories[0]?.id ?? null);
      } else {
        setSelectedCatId(categories[0]?.id ?? null);
      }
    }
  }, [isOpen, editingBookmark, categories]);

  if (!isOpen) return null;

  const isEditing      = !!editingBookmark;
  const activeCatId    = isNewCat ? -1 : selectedCatId!;
  const activeCatName  = isNewCat ? newCatValue.trim() : (categories.find(c => c.id === selectedCatId)?.name ?? '');
  const catReady       = isNewCat ? newCatValue.trim() !== '' : selectedCatId !== null;
  const isDisabled     = siteValue.trim() === '' || !catReady || (isEditing && nameValue.trim() === '');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    onSubmit(e, activeCatId, activeCatName);
  }

  const inputStyle: React.CSSProperties = {
    ...mono,
    width: '100%',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: '2px',
    outline: 'none',
    fontSize: '0.8rem',
    color: 'var(--text-hi)',
    padding: '9px 12px',
    transition: 'border-color 0.15s',
  };

  const labelStyle: React.CSSProperties = {
    ...mono,
    fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase',
    color: 'var(--text-lo)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px',
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        background: 'var(--modal-backdrop)',
        animation: isClosing ? 'fadeOut 0.15s ease-in' : 'fadeIn 0.15s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxWidth: '420px',
          background: 'var(--bg-raised)',
          border: '1px solid var(--border)',
          borderRadius: '3px', overflow: 'hidden',
          animation: isClosing ? 'slideDown 0.15s ease-in' : 'slideUp 0.15s ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px', borderBottom: '1px solid var(--border-dim)', background: 'var(--bg)',
        }}>
          <span style={{ ...mono, fontSize: '0.6rem', letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--text-mid)',
            display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
            {isEditing ? 'Editar Bookmark' : 'Nuevo Bookmark'}
          </span>
          <button onClick={onClose}
            style={{ ...mono, background: 'transparent', border: '1px solid var(--border-dim)',
              borderRadius: '2px', cursor: 'pointer', color: 'var(--text-lo)',
              width: '22px', height: '22px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', transition: 'all 0.15s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--accent)'; el.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-dim)'; el.style.color = 'var(--text-lo)'; }}
          >
            <IconX size={12} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Nombre — solo en edición */}
          {isEditing && (
            <div>
              <label style={labelStyle}>
                <IconTag size={12} stroke={1.5} style={{ color: 'var(--accent)' }} /> Nombre
              </label>
              <input type="text" name="name" value={nameValue}
                onChange={e => setNameValue(e.target.value)}
                placeholder="GitHub"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
            </div>
          )}

          {/* URL */}
          <div>
            <label style={labelStyle}>
              <IconWorldWww size={12} stroke={1.5} style={{ color: 'var(--accent)' }} /> Sitio web
            </label>
            <input type="text" name="site" value={siteValue}
              onChange={e => setSiteValue(e.target.value)}
              placeholder="github.com"
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
          </div>

          {/* ── Fila inferior: [ SELECT/INPUT ] ··· [ Cancelar ] [ Guardar ] ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>

            {/* LEFT — CategorySelect o input nueva categoría */}
            <div style={{ flex: 1, minWidth: '120px' }}>
              {isNewCat ? (
                <input
                  type="text"
                  value={newCatValue}
                  onChange={e => setNewCatValue(e.target.value)}
                  placeholder="Nueva categoría…"
                  style={{ ...inputStyle, padding: '7px 10px', fontSize: '0.68rem' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  autoFocus
                />
              ) : (
                <CategorySelect
                  categories={categories}
                  selectedId={selectedCatId}
                  onSelect={setSelectedCatId}
                />
              )}
            </div>

            {/* RIGHT — botones */}
            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
              <button type="button" onClick={onClose}
                style={{ ...mono, background: 'var(--bg-surface)', border: '1px solid var(--border-dim)',
                  borderRadius: '2px', cursor: 'pointer', color: 'var(--text-lo)',
                  fontSize: '0.68rem', letterSpacing: '0.08em', padding: '7px 14px',
                  display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s', flexShrink: 0 }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-mid)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-dim)'; el.style.color = 'var(--text-lo)'; }}
              >
                <IconX size={13} /> Cancelar
              </button>
              <button type="submit" disabled={isDisabled}
                style={{ ...mono, background: 'var(--accent)', border: 'none', borderRadius: '2px',
                  cursor: isDisabled ? 'not-allowed' : 'pointer', color: '#0a0c0f',
                  fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', padding: '7px 14px',
                  display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0,
                  opacity: isDisabled ? 0.35 : 1, transition: 'filter 0.15s' }}
                onMouseEnter={e => { if (!isDisabled) (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'; }}
              >
                <IconDeviceFloppy size={13} />
                {isEditing ? 'Actualizar' : 'Guardar'}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default BookmarkModal;
