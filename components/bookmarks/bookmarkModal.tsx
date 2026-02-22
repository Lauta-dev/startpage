'use client';

import React, { useState, useEffect } from 'react';
import { IconX, IconDeviceFloppy, IconPencil, IconWorldWww, IconTag } from '@tabler/icons-react';
import { Bookmark } from '@/types/bookmark';

interface BookmarkModalProps {
  isOpen: boolean;
  isClosing: boolean;
  editingBookmark: { id: number; bookmark: Bookmark } | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const BookmarkModal: React.FC<BookmarkModalProps> = ({
  isOpen,
  isClosing,
  editingBookmark,
  onClose,
  onSubmit,
}) => {
  const [siteValue, setSiteValue] = useState('');
  const [nameValue, setNameValue] = useState('');

  // Sync values cuando cambia el bookmark que se está editando o se abre el modal
  useEffect(() => {
    if (isOpen) {
      setSiteValue(editingBookmark?.bookmark.url ?? '');
      setNameValue(editingBookmark?.bookmark.title ?? '');
    }
  }, [isOpen, editingBookmark]);

  if (!isOpen) return null;

  const isEditing = !!editingBookmark;
  // Al editar: necesita site Y name. Al crear: solo site.
  const isDisabled = isEditing
    ? siteValue.trim() === '' || nameValue.trim() === ''
    : siteValue.trim() === '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'var(--modal-backdrop)',
        animation: isClosing ? 'fadeOut 0.15s ease-in' : 'fadeIn 0.15s ease-out',
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-4 sm:p-6"
        style={{
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-elevated) 100%)',
          border: '1px solid var(--border)',
          animation: isClosing ? 'slideDown 0.15s ease-in' : 'slideUp 0.15s ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <IconPencil size={20} stroke={1.5} style={{ color: 'var(--accent)' }} />
            {isEditing ? 'Editar Bookmark' : 'Nuevo Bookmark'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <IconX size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            {/* Campo nombre — solo al editar */}
            {isEditing && (
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5"
                        style={{ color: 'var(--text-secondary)' }}>
                    <IconTag size={14} stroke={1.5} />
                    Nombre
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={nameValue}
                  onChange={e => setNameValue(e.target.value)}
                  placeholder="GitHub"
                  className="input w-full rounded-xl text-base focus:outline-none transition-colors"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  required
                />
              </div>
            )}

            {/* Campo sitio web — siempre presente */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5"
                      style={{ color: 'var(--text-secondary)' }}>
                  <IconWorldWww size={14} stroke={1.5} />
                  Sitio web
                </span>
              </label>
              <input
                type="text"
                name="site"
                value={siteValue}
                onChange={e => setSiteValue(e.target.value)}
                placeholder="github.com"
                className="input w-full rounded-xl text-base focus:outline-none transition-colors"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 flex-wrap">
            <button
              type="button"
              onClick={onClose}
              className="btn rounded-xl gap-2 border-0 transition-colors"
              style={{ background: 'var(--bg-overlay)', color: 'var(--text-secondary)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--border-subtle)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-overlay)')}
            >
              <IconX size={18} />
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isDisabled}
              className="btn rounded-xl gap-2 border-0 font-semibold transition-all duration-200"
              style={{
                background: 'var(--accent)',
                color: 'var(--accent-text)',
                opacity: isDisabled ? 0.35 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => { if (!isDisabled) e.currentTarget.style.filter = 'brightness(1.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; }}
            >
              <IconDeviceFloppy size={18} />
              {isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookmarkModal;
