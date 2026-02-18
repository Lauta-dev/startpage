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
    <div className="modal modal-open">
      <div
        className="modal-box rounded-2xl"
        style={{
          background: `linear-gradient(135deg, var(--nord1) 0%, var(--nord0) 100%)`,
          border: '1px solid rgba(136, 192, 208, 0.15)',
          animation: isClosing ? 'slideDown 0.15s ease-in' : 'slideUp 0.15s ease-out',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--nord6)' }}>
            <IconPencil size={20} stroke={1.5} style={{ color: 'var(--nord8)' }} />
            {editingBookmark ? 'Editar Bookmark' : 'Nuevo Bookmark'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost transition-colors"
            style={{ color: 'var(--nord4)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--nord4)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--nord4)')}
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
                        style={{ color: 'var(--nord4)' }}>
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
                  style={{
                    background: 'var(--nord0)',
                    border: '1px solid var(--nord2)',
                    color: 'var(--nord5)',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--nord8)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--nord2)')}
                  required
                />
              </div>
            )}

            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5"
                      style={{ color: 'var(--nord4)' }}>
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
                style={{
                  background: 'var(--nord0)',
                  border: '1px solid var(--nord2)',
                  color: 'var(--nord5)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--nord8)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--nord2)')}
                required
              />
            </div>
          </div>

          <div className="modal-action mt-6 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn rounded-xl gap-2 border-0 transition-colors"
              style={{ background: 'var(--nord2)', color: 'var(--nord4)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--nord3)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--nord2)')}
            >
              <IconX size={18} />
              Cancelar
            </button>
            <button
              type="submit"
              className="btn rounded-xl gap-2 border-0 font-semibold transition-colors"
              style={{ background: 'var(--nord10)', color: 'var(--nord6)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--nord9)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--nord10)')}
            >
              <IconDeviceFloppy size={18} />
              {editingBookmark ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>

      <div
        className="modal-backdrop"
        onClick={onClose}
        style={{ animation: isClosing ? 'fadeOut 0.15s ease-in' : 'fadeIn 0.15s ease-out' }}
      />
    </div>
  );
};

export default BookmarkModal;
