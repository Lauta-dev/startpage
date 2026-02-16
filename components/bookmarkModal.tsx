'use client';

import React from 'react';

interface Link {
  name: string;
  icon: string;
  site: string;
  id: number;
}

interface BookmarkModalProps {
  isOpen: boolean;
  isClosing: boolean;
  selectedCategory: string | null;
  editingBookmark: {categoryIndex: number, linkIndex: number, link: Link} | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const BookmarkModal: React.FC<BookmarkModalProps> = ({
  isOpen,
  isClosing,
  selectedCategory,
  editingBookmark,
  onClose,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-80 flex items-center justify-center z-50 p-4"
      style={{
        animation: isClosing ? 'fadeOut 0.15s ease-in' : 'fadeIn 0.15s ease-out'
      }}
    >
      <div 
        className="bg-white dark:bg-neutral-950 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-2 border-transparent dark:border-neutral-900"
        style={{
          animation: isClosing ? 'slideDown 0.15s ease-in' : 'slideUp 0.15s ease-out'
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="min-w-0 flex-1 pr-4">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-neutral-100 truncate">
              {editingBookmark ? 'Editar Bookmark' : 'Nuevo Bookmark'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 mt-1 truncate">
              En: {selectedCategory}
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2">
                Nombre
              </label>
              <input
                type="text"
                placeholder="GitHub"
                name="name"
                defaultValue={editingBookmark?.link.name || ''}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 dark:border-neutral-800 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-600"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2">
                Sitio web
              </label>
              <input
                type="text"
                placeholder="github.com"
                name="site"
                defaultValue={editingBookmark?.link.site || ''}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 dark:border-neutral-800 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-600"
              />
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 mt-6 sm:mt-8">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-200 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-blue-500 dark:bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
            >
              {editingBookmark ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>

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
