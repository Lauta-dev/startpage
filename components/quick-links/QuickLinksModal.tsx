'use client'

import { useState } from "react";
import { IconSettings, IconPlus, IconTrash, IconX, IconLink } from "@tabler/icons-react";
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

function QuickLinksModal({ quickLinks }: { quickLinks: QuickLink[] }) {
  const [openModal, setOpenModal] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    await AddQuickLink({ url: data.url as string });
    (e.target as HTMLFormElement).reset();
  }

  async function handleDeleteItem(id: number) {
    await RemoveQuickLink(id);
  }

  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className="flex items-center gap-2 text-xs font-medium transition-colors cursor-pointer"
        style={{ color: 'var(--nord4)' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--nord4)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--nord4)')}
      >
        <IconSettings size={18} stroke={1.5} />
        Gestionar
      </button>

      <dialog open={openModal} className="modal">
        <div
          className="modal-box rounded-2xl flex flex-col gap-6 w-11/12 max-w-2xl"
          style={{
            background: `linear-gradient(135deg, var(--nord1) 0%, var(--nord0) 100%)`,
            border: '1px solid var(--nord2)',
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg flex items-center gap-2" style={{ color: 'var(--nord6)' }}>
              <IconLink size={20} stroke={1.5} style={{ color: 'var(--nord8)' }} />
              Quick Links
            </h3>
            <button
              onClick={() => setOpenModal(false)}
              className="btn btn-sm btn-circle btn-ghost transition-colors cursor-pointer"
              style={{ color: 'var(--nord4)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--nord4)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--nord4)')}
            >
              <IconX size={18} />
            </button>
          </div>

          {/* Añadir nuevo */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5"
               style={{ color: 'var(--nord4)' }}>
              <IconPlus size={14} stroke={2} />
              Añadir enlace
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="url"
                name="url"
                placeholder="https://ejemplo.com"
                className="input input-sm flex-1 rounded-lg h-10 text-sm focus:outline-none"
                style={{
                  background: 'var(--nord0)',
                  border: '1px solid var(--nord2)',
                  color: 'var(--nord5)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--nord8)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--nord2)')}
              />
              <button
                type="submit"
                className="btn btn-sm rounded-lg gap-1.5 h-10 border-0 font-semibold"
                style={{ background: 'var(--nord10)', color: 'var(--nord6)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--nord9)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--nord10)')}
              >
                <IconPlus size={16} />
                Añadir
              </button>
            </form>
          </div>

          {/* Lista para eliminar */}
          {quickLinks.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5"
                 style={{ color: 'var(--nord4)' }}>
                <IconTrash size={14} stroke={1.5} />
                Eliminar enlace
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {quickLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleDeleteItem(link.id)}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group cursor-pointer"
                    style={{
                      background: 'var(--nord1)',
                      border: '1px solid var(--nord2)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'var(--nord2)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--nord11)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'var(--nord1)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--nord2)';
                    }}
                  >
                    <div className="w-7 h-7 rounded-lg p-1.5 flex-shrink-0 flex items-center justify-center"
                         style={{ background: 'var(--nord0)' }}>
                      <img src={link?.icon ?? ""} alt={link.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-medium truncate text-sm flex-1 text-left transition-colors"
                          style={{ color: 'var(--nord4)' }}>
                      {link.name}
                    </span>
                    <IconTrash size={16} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                               style={{ color: 'var(--nord11)' }} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-backdrop" onClick={() => setOpenModal(false)} />
      </dialog>
    </>
  );
}

export default QuickLinksModal;
