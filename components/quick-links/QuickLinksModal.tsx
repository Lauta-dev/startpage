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
  const [urlValue, setUrlValue] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    await AddQuickLink({ url: data.url as string });
    setUrlValue('');
    (e.target as HTMLFormElement).reset();
  }

  async function handleDeleteItem(id: number) {
    await RemoveQuickLink(id);
  }

  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className="dim-btn flex items-center gap-2 text-xs font-medium transition-colors duration-200 cursor-pointer"
      >
        <IconSettings size={18} stroke={1.5} />
      </button>

      <dialog open={openModal} className="modal">
        <div
          className="modal-box rounded-2xl flex flex-col gap-6 w-11/12 max-w-2xl"
          style={{
            background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-elevated) 100%)',
            border: '1px solid var(--border)',
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <IconLink size={20} stroke={1.5} style={{ color: 'var(--accent)' }} />
              Quick Links
            </h3>
            <button
              onClick={() => { setOpenModal(false); setUrlValue(''); }}
              className="btn btn-sm btn-circle btn-ghost transition-colors cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
            >
              <IconX size={18} />
            </button>
          </div>

          {/* Añadir nuevo */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5"
               style={{ color: 'var(--text-secondary)' }}>
              <IconPlus size={14} stroke={2} />
              Añadir enlace
            </p>
            <form onSubmit={handleSubmit} className="flex sm:flex-row">
              <input
                type="url"
                name="url"
                value={urlValue}
                onChange={e => setUrlValue(e.target.value)}
                placeholder="https://ejemplo.com"
                className="input input-sm w-full sm:flex-1 rounded-lg h-10 text-sm focus:outline-none"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  borderRadius: "10px 0 0 10px"
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
              <button
                type="submit"
                disabled={urlValue.trim() === ''}
                className="btn btn-sm sm:w-auto rounded-lg gap-1.5 h-10 border-0 font-semibold transition-opacity duration-200"
                style={{
                  background: 'var(--accent)',
                  color: 'var(--accent-text)',
                  opacity: urlValue.trim() === '' ? 0.35 : 1,
                  cursor: urlValue.trim() === '' ? 'not-allowed' : 'pointer',
                  borderRadius: "0px 10px 10px 0px"
                }}
                onMouseEnter={e => { if (urlValue.trim() !== '') e.currentTarget.style.filter = 'brightness(1.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; }}
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
                 style={{ color: 'var(--text-secondary)' }}>
                <IconTrash size={14} stroke={1.5} />
                Eliminar enlace
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {quickLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleDeleteItem(link.id)}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group cursor-pointer"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'var(--bg-overlay)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--nord11)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    }}
                  >
                    <div className="w-7 h-7 rounded-lg p-1.5 flex-shrink-0 flex items-center justify-center"
                         style={{ background: 'var(--bg-elevated)' }}>
                      <img src={link?.icon ?? ""} alt={link.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-medium truncate text-sm flex-1 text-left"
                          style={{ color: 'var(--text-secondary)' }}>
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
