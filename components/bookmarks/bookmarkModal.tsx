'use client';

import React, { useState, useEffect } from 'react';
import { IconX, IconDeviceFloppy, IconWorldWww, IconTag } from '@tabler/icons-react';
import { Bookmark } from '@/types/bookmark';

interface BookmarkModalProps {
  isOpen: boolean; isClosing: boolean;
  editingBookmark: { id: number; bookmark: Bookmark } | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

const BookmarkModal: React.FC<BookmarkModalProps> = ({ isOpen, isClosing, editingBookmark, onClose, onSubmit }) => {
  const [siteValue, setSiteValue] = useState('');
  const [nameValue, setNameValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSiteValue(editingBookmark?.bookmark.url ?? '');
      setNameValue(editingBookmark?.bookmark.title ?? '');
    }
  }, [isOpen, editingBookmark]);

  if (!isOpen) return null;

  const isEditing = !!editingBookmark;
  const isDisabled = isEditing
    ? siteValue.trim() === '' || nameValue.trim() === ''
    : siteValue.trim() === '';

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '16px',
        background: 'var(--modal-backdrop)',
        animation: isClosing ? 'fadeOut 0.15s ease-in' : 'fadeIn 0.15s ease-out' }}
      onClick={onClose}
    >
      <div
        style={{ width: '100%', maxWidth: '420px', background: 'var(--bg-elevated)',
          border: '1px solid var(--border)', borderRadius: '3px', overflow: 'hidden',
          animation: isClosing ? 'slideDown 0.15s ease-in' : 'slideUp 0.15s ease-out' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px', borderBottom: '1px solid var(--border-dim)', background: 'var(--bg-base)' }}>
          <span style={{ ...mono, fontSize: '0.6rem', letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent)' }}>●</span>
            {isEditing ? 'Editar Bookmark' : 'Nuevo Bookmark'}
          </span>
          <button onClick={onClose}
            style={{ ...mono, background: 'transparent', border: '1px solid var(--border-dim)',
              borderRadius: '2px', cursor: 'pointer', color: 'var(--text-muted)',
              width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-dim)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
          >
            <IconX size={12} />
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isEditing && (
            <div>
              <label style={{ ...mono, fontSize: '0.58rem', letterSpacing: '0.14em',
                textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex',
                alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <IconTag size={12} stroke={1.5} style={{ color: 'var(--accent)' }} /> Nombre
              </label>
              <input type="text" name="name" value={nameValue}
                onChange={e => setNameValue(e.target.value)}
                placeholder="GitHub"
                style={{ ...mono, width: '100%', background: 'var(--bg-surface)',
                  border: '1px solid var(--border)', borderRadius: '2px', outline: 'none',
                  fontSize: '0.8rem', color: 'var(--text-primary)', padding: '9px 12px',
                  transition: 'border-color 0.15s' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
            </div>
          )}

          <div>
            <label style={{ ...mono, fontSize: '0.58rem', letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex',
              alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <IconWorldWww size={12} stroke={1.5} style={{ color: 'var(--accent)' }} /> Sitio web
            </label>
            <input type="text" name="site" value={siteValue}
              onChange={e => setSiteValue(e.target.value)}
              placeholder="github.com"
              style={{ ...mono, width: '100%', background: 'var(--bg-surface)',
                border: '1px solid var(--border)', borderRadius: '2px', outline: 'none',
                fontSize: '0.8rem', color: 'var(--text-primary)', padding: '9px 12px',
                transition: 'border-color 0.15s' }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
            <button type="button" onClick={onClose}
              style={{ ...mono, background: 'var(--bg-surface)', border: '1px solid var(--border-dim)',
                borderRadius: '2px', cursor: 'pointer', color: 'var(--text-muted)',
                fontSize: '0.68rem', letterSpacing: '0.08em', padding: '7px 14px',
                display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-dim)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
            >
              <IconX size={13} /> Cancelar
            </button>
            <button type="submit" disabled={isDisabled}
              style={{ ...mono, background: 'var(--accent)', border: 'none', borderRadius: '2px',
                cursor: isDisabled ? 'not-allowed' : 'pointer', color: 'var(--bg-base)',
                fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', padding: '7px 14px',
                display: 'flex', alignItems: 'center', gap: '6px',
                opacity: isDisabled ? 0.35 : 1, transition: 'filter 0.15s' }}
              onMouseEnter={e => { if (!isDisabled) (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'; }}
            >
              <IconDeviceFloppy size={13} />
              {isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookmarkModal;
