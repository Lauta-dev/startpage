'use client';

import React, { useState } from 'react';
import { IconBook2, IconTrash } from '@tabler/icons-react';
import { IconCirclePlus } from '@tabler/icons-react';
import BookmarkModal from './bookmarkModal';
import { Bookmark } from '@/lib/types';
import { CreateBookmark, DeleteBookmark, EditBookark } from '@/actions/Bookmarks';

import { IconEdit } from '@tabler/icons-react';

const BookmarkGrid= ({ bookmarks }: { bookmarks: Bookmark[] }) => {

  //MIS COSAS---------------------------------
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<{id: number, bookmark: Bookmark} | null>(null);

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowBookmarkModal(false);
      setEditingBookmark(null);
      setIsClosing(false);
    }, 150);
  };

  const handleEditBookmark = ({ bookmark, id }: { bookmark: Bookmark, id: number }) => {
    setEditingBookmark({ id, bookmark });
    setShowBookmarkModal(true);
  };
  
  async function updateItem(form: { [k: string]: FormDataEntryValue; }) {
    try {
      const c = await EditBookark({ customTitle: form.name as string, newUrl: form.site as string, id: editingBookmark?.id || 1 })
      console.log({c})
    } catch (error) {
      console.log(error)  
    }
  }

  async function createResource(form: { [k: string]: FormDataEntryValue; }) {
    try {
      await CreateBookmark(form.site as string)
    } catch (error) {
      console.error({
        p: "ERROR AL CREAR UN REGISTRO",
        error
      })
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

  async function deleteBookmark(id: number) {
    await DeleteBookmark(id)
  }

  return (
    <div className="glass-container rounded-2xl p-4 sm:p-6">
      
      <div className='flex justify-between mb-3'>
        <h3 className="text-sm font-semibold mb-3 sm:mb-4 text-[#60a5fa] flex items-center gap-4">
          <IconBook2 stroke={1.25} />
          Bookmarks
        </h3>
        <button
          onClick={() => {
            setEditingBookmark(null);
            setShowBookmarkModal(true);
          }}
            rel="noopener noreferrer"
            className="text-sm font-semibold flex items-center cursor-pointer gap-2 sm:gap-3 p-2 sm:p-3 bg-base-300/50 rounded-xl hover:bg-base-300 border-[rgba(59,130,246,0.3)] transition-all duration-300 group quick-link-btn border hover:text-[rgba(59,130,246)]"
          >
              <IconCirclePlus stroke={2} className="w-5 h-5" />
              Añadir bookmark
          </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {bookmarks.map((bookmark) => (
          <a
            key={bookmark.id}
            href={bookmark.site}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="card bg-base-100 shadow-sm">
              <figure>
                <figure className="group overflow-hidden"> {/* El group debe ir aquí o en el padre superior */}
                  <div className='relative'>
                    <img
                      src={bookmark?.ogImage ?? "/fallback.png"} // Acuérdate del "/" inicial
                      alt={bookmark.title}
                      className="w-full aspect-video object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />

                    {/* Contenedor de acciones */}
                    {/* lg:opacity-0 -> Ocultos en desktop, visibles en mobile por defecto */}
                    <div className="absolute top-2 right-2 flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      
                      <button onClick={(e) => {
                        e.preventDefault(); // Evita comportamientos extraños
                        e.stopPropagation(); // ¡ESTA ES LA CLAVE! Evita que el click llegue al anchor
                        deleteBookmark(bookmark.id)
                      }} className="p-2 cursor-pointer transition-all bg-black/60 hover:bg-black/90 hover:text-error text-white rounded-full backdrop-blur-sm">
                        <IconTrash size={24} /> 
                      </button>

                      <button onClick={e => {
                        e.preventDefault(); // Evita comportamientos extraños
                        e.stopPropagation(); // ¡ESTA ES LA CLAVE! Evita que el click llegue al anchor
                        handleEditBookmark({ bookmark, id: bookmark.id })
                      }} className="p-2 cursor-pointer transition-all bg-black/60 hover:bg-black/90 hover:text-success text-white rounded-full backdrop-blur-sm">
                        <IconEdit size={24} />
                      </button>

                    </div>
                  </div>
                </figure>
                
              </figure>
              <div className="card-body min-w-0">
                <div className='flex gap-4 items-center justify-between'>
                  <h2 className="card-title whitespace-nowrap overflow-hidden text-ellipsis block">
                  {bookmark.title}
                </h2>
                </div>
                
                <p className="opacity-70">{bookmark.site}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <BookmarkModal
        isOpen={showBookmarkModal}
        isClosing={isClosing}
        editingBookmark={editingBookmark}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default BookmarkGrid;
