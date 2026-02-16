'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BookmarkModal from '@/components/bookmarkModal';

export const dynamic = 'force-dynamic';

interface Link {
  name: string;
  icon: string;
  site: string;
  id: number;
}

interface Category {
  category: string;
  id: number;
  links: Link[];
}

interface BookmarkListProps {
  data: Category[];
}

const BookmarkList: React.FC<BookmarkListProps> = ({ data }) => {
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);

  const [isClosing, setIsClosing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<{categoryIndex: number, linkIndex: number, link: Link} | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowBookmarkModal(false);
      setEditingBookmark(null);
      setIsClosing(false);
    }, 150);
  };

  
  const handleEditBookmark = (link: Link) => {
    setEditingBookmark({ categoryIndex: link.id, linkIndex: link.id, link });
    setSelectedCategoryId(link.id);
    setShowBookmarkModal(true);

    console.log(editingBookmark);
  };
  
  async function updateItem(form: { [k: string]: FormDataEntryValue; }) {
    const ops = {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, site: form.site }),
    };

    try {
      const res = await fetch(`/api/bookmark/${selectedCategoryId}`, ops);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error en el servidor: ${errorText}`);
      }

      const data = await res.json();
      console.log("Respuesta exitosa:", data);
      handleCloseModal();
      router.refresh();
    } catch (error) {
      console.error("Error al consumir la API:", error);
    }
  }

  async function createResource(form: { [k: string]: FormDataEntryValue; }) {
    const ops = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, url: form.site, category: selectedCategoryId }),
    };

    try {
      const res = await fetch('/api/bookmark', ops);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error en el servidor: ${errorText}`);
      }

      const data = await res.json();
      console.log("Respuesta exitosa:", data);
      handleCloseModal();
      router.refresh();
    } catch (error) {
      console.error("Error al consumir la API:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    console.log({
      state: editingBookmark ? "editar": "crear",
      data
    })
    
    if(editingBookmark) {
      await updateItem(data)
      return
    }
    await createResource(data)
  }

  async function handleDeleteBookmark(id: number) {
    try {
      const res = await fetch(`/api/bookmark/${id}`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error en el servidor: ${errorText}`);
      }

      const data = await res.json();
      console.log("Respuesta exitosa:", data);
      router.refresh();
    } catch (error) {
      console.error("Error al consumir la API:", error);
    }
  }

  return (
    <div className="max-w-7xl w-full px-4 sm:px-6">
      {/* Toggle dark mode + Input para agregar categoría */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
        <div className="relative flex-1 order-2 sm:order-1">
          <input
            type="text"
            placeholder="Nueva categoría..."
            className="w-full px-4 py-3 pr-24 border-2 border-gray-200 dark:border-neutral-800 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-colors bg-white dark:bg-neutral-950 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-600"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm hidden sm:inline">Agregar</span>
          </button>
        </div>
        
        {/* Toggle Dark Mode */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-3 rounded-xl bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 dark:hover:bg-neutral-800 transition-colors order-1 sm:order-2 self-end sm:self-auto"
          title="Toggle dark mode"
        >
          {isDark ? (
            <svg className="w-5 h-5 text-gray-900 dark:text-neutral-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-900 dark:text-neutral-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {data.map((categoryData, categoryIndex) => (
          <div key={categoryIndex} className="bg-white dark:bg-neutral-950 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-gray-100 dark:border-neutral-900 hover:border-gray-200 dark:hover:border-neutral-800 transition-colors duration-300">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="h-6 sm:h-8 w-1 bg-blue-500 rounded-full flex-shrink-0"></div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-neutral-100 truncate">
                  {categoryData.category}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(categoryData.category);
                  setSelectedCategoryId(categoryData.id);
                  setEditingBookmark(null);
                  setShowBookmarkModal(true);
                }}
                className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-lg transition-colors ml-2"
                title="Agregar bookmark"
              >
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {categoryData.links.map((link) => (
                <div
                  key={link.id}
                  className="group relative flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 dark:bg-neutral-900 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-300"
                >
                  <a
                    href={`https://${link.site}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0"
                  >
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white dark:bg-neutral-950 rounded-lg transition-colors duration-300 shadow-sm">
                      <img
                        src={link.icon === "" ? "https://svgl.app/images/svgl_svg.svg" : link.icon}
                        alt={`${link.name} icon`}
                        className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-neutral-100 truncate text-xs sm:text-sm group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors duration-300">
                        {link.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-neutral-400 truncate">
                        {link.site}
                      </p>
                    </div>
                  </a>
                  
                  {/* Botones de editar y eliminar - visible en mobile, hover en desktop */}
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditBookmark(link)}
                      className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBookmark(link.id)}
                      className="p-1.5 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Component */}
      <BookmarkModal
        isOpen={showBookmarkModal}
        isClosing={isClosing}
        selectedCategory={selectedCategory}
        editingBookmark={editingBookmark}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default BookmarkList;
