'use client';

import { Bookmark,  } from '@/lib/types';
import React from 'react';

interface BookmarkModalProps {
  isOpen: boolean;
  isClosing: boolean;
  editingBookmark: {id: number, bookmark: Bookmark} | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const BookmarkModal: React.FC<BookmarkModalProps> = ({
  isOpen,
  isClosing,
  editingBookmark,
  onClose,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">

      <div 
        className="modal-box"
        style={{
          animation: isClosing ? 'slideDown 0.15s ease-in' : 'slideUp 0.15s ease-out'
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="min-w-0 flex-1 pr-4">
            <h3 className="text-xl sm:text-2xl font-bold truncate">
              {editingBookmark ? 'Editar Bookmark' : 'Nuevo Bookmark'}
            </h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="space-y-4">

            {editingBookmark?.bookmark.title ? (
              <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Nombre</span>
              </label>
              <input
                type="text"
                placeholder="GitHub"
                name="name"
                defaultValue={editingBookmark?.bookmark.title || ''}
                className="input input-bordered w-full"
                required
              />
            </div>
            ) : <></>}
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Sitio web</span>
              </label>
              <input
                type="text"
                placeholder="github.com"
                name="site"
                defaultValue={editingBookmark?.bookmark.site || ''}
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>

          <div className="modal-action">
            <button 
              type="button"
              onClick={onClose}
              className="btn"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {editingBookmark ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
      
      <div 
        className="modal-backdrop"
        onClick={onClose}
        style={{
          animation: isClosing ? 'fadeOut 0.15s ease-in' : 'fadeIn 0.15s ease-out'
        }}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(20px);
          }
        }
      `}</style>
    </div>
  );
};

export default BookmarkModal;
