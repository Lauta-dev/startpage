'use client';

import { Bookmark } from '@/lib/types';
import React from 'react';
import { IconX, IconDeviceFloppy, IconPencil, IconWorldWww, IconTag } from '@tabler/icons-react';

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
  if (!isOpen) return null;

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
        className="w-full max-w-md rounded-2xl p-6"
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
            {editingBookmark ? 'Editar Bookmark' : 'Nuevo Bookmark'}
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
            {editingBookmark?.bookmark.title && (
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
                  placeholder="GitHub"
                  name="name"
                  defaultValue={editingBookmark.bookmark.title}
                  className="input w-full rounded-xl text-base focus:outline-none"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  required
                />
              </div>
            )}

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
                placeholder="github.com"
                name="site"
                defaultValue={editingBookmark?.bookmark.site || ''}
                className="input w-full rounded-xl text-base focus:outline-none"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn rounded-xl gap-2 border-0 transition-colors"
              style={{ background: 'var(--bg-overlay)', color: 'var(--text-secondary)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-overlay)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-overlay)')}
            >
              <IconX size={18} />
              Cancelar
            </button>
            <button
              type="submit"
              className="btn rounded-xl gap-2 border-0 font-semibold transition-colors"
              style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
              onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.15)')}
              onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
            >
              <IconDeviceFloppy size={18} />
              {editingBookmark ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookmarkModal;
