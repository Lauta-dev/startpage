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
  const [editingBookmark, setEditingBookmark] = useState<{categoryIndex: number, linkIndex: number, link: Link} | null>(null);
  const router = useRouter();

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

  const toggleTheme = () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="max-w-7xl w-full px-4 sm:px-6">
      {/* Toggle theme + Input para agregar categoría */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
        <div className="relative flex-1 order-2 sm:order-1">
          <input
            type="text"
            placeholder="Nueva categoría..."
            className="input input-bordered w-full pr-24"
          />
          <button className="btn btn-primary absolute right-2 top-1/2 -translate-y-1/2 btn-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm hidden sm:inline">Agregar</span>
          </button>
        </div>
        
        {/* Theme Toggle */}
        <label className="swap swap-rotate btn btn-ghost order-1 sm:order-2 self-end sm:self-auto">
          <input type="checkbox" onChange={toggleTheme} />
          <svg className="swap-on fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
          </svg>
          <svg className="swap-off fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
          </svg>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {data.map((categoryData, categoryIndex) => (
          <div key={categoryIndex} className="card bg-base-100 shadow-xl">
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-1 h-6 sm:h-8 bg-primary rounded-full flex-shrink-0"></div>
                  <h2 className="card-title text-lg sm:text-xl truncate">
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
                  className="btn btn-primary btn-sm btn-circle"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {categoryData.links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-base-200 rounded-xl hover:bg-primary/10 transition-all duration-300 group"
                  >
                    <a
                      href={`https://${link.site}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0"
                    >
                      <div className="avatar">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-base-100 p-1.5">
                          <img
                            src={link.icon === "" ? "https://svgl.app/images/svgl_svg.svg" : link.icon}
                            alt={`${link.name} icon`}
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate text-xs sm:text-sm group-hover:text-primary transition-colors">
                          {link.name}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-base-content/60 truncate">
                          {link.site}
                        </p>
                      </div>
                    </a>
                    
                    {/* Dropdown Menu */}
                    <div className="dropdown dropdown-end opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                      </button>
                      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52">
                        <li>
                          <a onClick={() => handleEditBookmark(link)}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                          </a>
                        </li>
                        <li>
                          <a onClick={() => navigator.clipboard.writeText(link.site)}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copiar URL
                          </a>
                        </li>
                        <div className="divider my-0"></div>
                        <li>
                          <a className="text-error" onClick={() => handleDeleteBookmark(link.id)}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
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
