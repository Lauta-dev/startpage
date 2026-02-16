'use client';

import React, { useState, useEffect } from 'react';

interface Link {
  name: string;
  icon: string;
  site: string;
}

interface Category {
  category: string;
  id: number;
  links: Link[];
}

interface BookmarkListProps {
  data: Category[];
}

interface UserItem {
  name: string;
  site: string;
  icon: string;
}

const BookmarkList: React.FC<BookmarkListProps> = ({ data }) => {
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  console.log(data)
  const [isDark, setIsDark] = useState(false);

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
      setIsClosing(false);
    }, 150);
  };


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Evita que la página se recargue
    const formData = new FormData(e.currentTarget);
    const form = Object.fromEntries(formData.entries()) as unknown as UserItem;

    const ops = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, url: form.site, category: selectedCategoryId }),
      }
    try {
    const res = await fetch('/api/bookmark', ops);

    // Validación de seguridad antes de parsear
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error en el servidor: ${errorText}`);
    }

    const data = await res.json();
    console.log("Respuesta exitosa:", data);
  } catch (error) {
    console.error("Error al consumir la API:", error);
  }
  }

  return (
    <div className="max-w-7xl w-full px-6">
      {/* Toggle dark mode + Input para agregar categoría */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative max-w-md flex-1">
          <input
            type="text"
            placeholder="Nueva categoría..."
            className="w-full px-4 py-3 pr-24 border-2 border-gray-200 dark:border-neutral-800 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-colors bg-white dark:bg-neutral-950 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-600"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm">Agregar</span>
          </button>
        </div>
        
        {/* Toggle Dark Mode */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-3 rounded-xl bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 dark:hover:bg-neutral-800 transition-colors"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((categoryData, categoryIndex) => (
          <div key={categoryIndex} className="bg-white dark:bg-neutral-950 rounded-3xl p-6 border-2 border-gray-100 dark:border-neutral-900 hover:border-gray-200 dark:hover:border-neutral-800 transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100">
                  {categoryData.category}
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory(categoryData.category);
                  setSelectedCategoryId(categoryData.id);
                  setShowBookmarkModal(true);
                }}
                className="w-8 h-8 flex items-center justify-center bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-lg transition-colors"
                title="Agregar bookmark"
              >
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {categoryData.links.map((link, linkIndex) => (
                <a
                  key={linkIndex}
                  href={`https://${link.site}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-900 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-500 "
                >
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white dark:bg-neutral-950 rounded-lg group-hover:bg-white dark:group-hover:bg-neutral-950 transition-colors duration-300 shadow-sm">
                    <img
                      src={link.icon === "" ? "https://svgl.app/images/svgl_svg.svg" : link.icon}
                      alt={`${link.name} icon`}
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-neutral-100 truncate text-sm group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors duration-300">
                      {link.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">
                      {link.site}
                    </p>
                  </div>
                  <svg 
                    className="w-4 h-4 text-gray-400 dark:text-neutral-500 group-hover:text-blue-500 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal para agregar bookmark */}
      {showBookmarkModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-80 flex items-center justify-center z-50 p-4"
          style={{
            animation: isClosing ? 'fadeOut 0.15s ease-in' : 'fadeIn 0.15s ease-out'
          }}
        >
          <div 
            className="bg-white dark:bg-neutral-950 rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-transparent dark:border-neutral-900"
            style={{
              animation: isClosing ? 'slideDown 0.15s ease-in' : 'slideUp 0.15s ease-out'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Nuevo Bookmark</h3>
                <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">En: {selectedCategory}</p>
              </div>
              <button 
                onClick={handleCloseModal}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2">Nombre</label>
                <input
                  type="text"
                  placeholder="GitHub"
                  name="name"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-neutral-800 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2">Sitio web</label>
                <input
                  type="text"
                  placeholder="github.com"
                    name="site"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-neutral-800 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-600"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={handleCloseModal}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancelar
              </button>
              <button className="flex-1 px-6 py-3 bg-blue-500 dark:bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors" >
                Guardar
              </button>
            </div>
            </form>
            
          </div>
        </div>
      )}
      
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

export default BookmarkList;
