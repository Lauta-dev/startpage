'use client'

import { useState } from "react";
import AddQuickLink from "@/actions/addQuickLink";
import RemoveQuickLink from "@/actions/DeleteQuickLink";

interface QuickLink {
  id: number;
  name: string;
  url: string;
  icon: string | null;
  position: number;
  created_at: string;
}

function QuickLinksModal({quickLinks}: {quickLinks:QuickLink[]}) {
  const [openModal, setOpenModal] = useState(false)

  function handleOpenModal() {
    setOpenModal(!openModal)
  }
 
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    await AddQuickLink({ url: data.url as string });
  };

  async function handleDeleteItem(id: number) {
    await RemoveQuickLink(id)
  }

  return (
    <>
      <button className="btn" onClick={handleOpenModal}>open modal</button>
      <dialog open={openModal} className="modal">
        <div className="modal-box flex flex-col gap-5 w-11/12 max-w-5xl">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Quick Links</h3>
            <button onClick={handleOpenModal} className="btn btn-sm btn-circle btn-ghost flex items-center">✕</button>
          </div>
          {/*--- BARRA PARA AÑADIR NUEVOS QUICK LINKS ---*/}
          <form onSubmit={handleSubmit} className="flex justify-between items-center gap-2">
            <input type="url" name="url" placeholder="google.com | https://google.com" className="input input-primary w-full" />
            <button type="submit" className="btn btn-accent btn-outline">Outline</button>
          </form>

          {/*--- FIN BARRA PARA AÑADIR NUEVOS QUICK LINKS ---*/}

          {/*--- LISTAR LOS QUICK LINKS --- */}
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Eliminar Quick Link</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {quickLinks.map( (link) => (
              <button key={link.id} onClick={() => handleDeleteItem(link.id)} className="btn-ghost flex items-center gap-2 p-0 sm:gap-3 sm:p-3 bg-base-200/50 rounded-xl hover:bg-error/20 hover:border-error hover:text-error transition-all duration-300 group quick-link-btn border border-transparent">
              <div className="avatar">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-base-100/50 p-1.5 sm:p-2">
                  <img src={link.icon} alt={link.name} />
                </div>
              </div>
              <div className="flex-1 min-w-0 justify-between items-center flex">
                <h3 className="font-semibold truncate text-xs sm:text-sm transition-colors">
                  {link.name}
                </h3>
              </div>
          </button>
            ))}
          </div>
          {/*--- FIN LISTAR LOS QUICK LINKS --- */}

          {/*--- LISTAR ULTIMOS 5 BOOKMARKS --- */}
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Añadir bookmark a Quick Link</h3>
          </div>
          
          
          {/*--- FIN LISTAR ULTIMOS 5 BOOKMARKS --- */}
          

        </div>
      </dialog>
    </>
  )
}

export default QuickLinksModal
