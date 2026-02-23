'use client';

import { useState } from 'react';
import { IconSettings, IconX, IconTrash } from '@tabler/icons-react';
import { SaveQuickLink } from '@/actions/addQuickLink';
import RemoveQuickLink from '@/actions/DeleteQuickLink';
import { fetchMetadata } from '@/actions/fetchMetadata';
import type { QuickLink } from './QuickLinks';
import { toastFlow } from '@/components/ui/Toast';

interface Props {
  quickLinks: QuickLink[];
}

const QuickLinksModal: React.FC<Props> = ({ quickLinks }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [urlInput, setUrlInput]   = useState('');

  const openModal = () => {
    setIsMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));
  };

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => { setIsMounted(false); setUrlInput(''); }, 220);
  };

  const handleAddLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get('url') as string;

    // Paso 1 — metadata
    const id_toast = toastFlow.start('Obteniendo metadata...');
    const meta = await fetchMetadata(url);
    if (!meta.ok) { toastFlow.error(id_toast, meta.message); return; }

    // Paso 2 — DB
    toastFlow.step(id_toast, 'Guardando en base de datos...');
    const result = await SaveQuickLink({ name: meta.title, url: meta.url, favicon: meta.favicon });
    if (result.ok) {
      toastFlow.success(id_toast, 'Quick link guardado');
      setUrlInput('');
      (e.target as HTMLFormElement).reset();
    } else {
      toastFlow.error(id_toast, result.message);
    }
  };

  const handleRemoveLink = async (id: number, name: string) => {
    const id_toast = toastFlow.start('Eliminando...');
    const result = await RemoveQuickLink(id);
    if (result?.success) {
      toastFlow.success(id_toast, `"${name}" eliminado`);
    } else {
      toastFlow.error(id_toast, 'Error al eliminar el enlace');
    }
  };

  const SectionLabel = ({ accent, children }: { accent?: boolean; children: React.ReactNode }) => (
    <div
      className="flex items-center gap-1.5"
      style={{
        fontFamily: 'inherit',
        fontSize: '0.58rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--text-lo)',
        marginBottom: '10px',
      }}
    >
      <span style={{ color: accent ? 'var(--color-danger)' : 'var(--accent)' }}>{'>'}</span>
      {children}
    </div>
  );

  return (
    <>
      <button
        onClick={openModal}
        className="flex items-center cursor-pointer transition-colors duration-150"
        style={{
          fontFamily: 'inherit',
          background: 'transparent',
          border: 'none',
          color: 'var(--text-lo)',
          padding: '3px',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-lo)')}
      >
        <IconSettings size={18} stroke={1.5} />
      </button>

      {isMounted && (
        <div
          onClick={closeModal}
          className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-200"
          style={{ background: 'rgba(5,8,12,0.88)', opacity: isVisible ? 1 : 0 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="overflow-hidden transition-all duration-200"
            style={{
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              borderRadius: '3px',
              width: '90%',
              maxWidth: '520px',
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)',
              opacity: isVisible ? 1 : 0,
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between"
              style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-dim)', background: 'var(--bg)' }}
            >
              <div
                className="flex items-center gap-2"
                style={{ fontFamily: 'inherit', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-mid)' }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', flexShrink: 0 }} />
                Quick Links — Gestionar
              </div>
              <button
                onClick={closeModal}
                className="flex items-center justify-center cursor-pointer transition-all duration-150"
                style={{
                  fontFamily: 'inherit',
                  width: '22px', height: '22px',
                  border: '1px solid var(--border-dim)',
                  borderRadius: '2px',
                  background: 'transparent',
                  color: 'var(--text-lo)',
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--accent)'; el.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-dim)'; el.style.color = 'var(--text-lo)'; }}
              >
                <IconX size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-5" style={{ padding: '20px 18px' }}>

              {/* Add link */}
              <div>
                <SectionLabel>Añadir enlace</SectionLabel>
                <form
                  onSubmit={handleAddLink}
                  className="flex overflow-hidden transition-colors duration-150"
                  style={{ border: '1px solid var(--border)', borderRadius: '2px' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  <input
                    type="url"
                    name="url"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    placeholder="https://ejemplo.com"
                    className="modal-url-input flex-1 outline-none"
                    style={{
                      background: 'var(--bg-surface)',
                      border: 'none',
                      fontFamily: 'inherit',
                      fontSize: '0.78rem',
                      color: 'var(--text-hi)',
                      padding: '9px 12px',
                      minWidth: 0,
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!urlInput.trim()}
                    className="flex-shrink-0 transition-all duration-150"
                    style={{
                      fontFamily: 'inherit',
                      background: 'var(--accent)',
                      border: 'none',
                      borderLeft: '1px solid rgba(0,0,0,0.2)',
                      padding: '9px 16px',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#0a0c0f',
                      cursor: urlInput.trim() ? 'pointer' : 'not-allowed',
                      opacity: urlInput.trim() ? 1 : 0.35,
                    }}
                    onMouseEnter={e => { if (urlInput.trim()) (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'; }}
                  >
                    Añadir
                  </button>
                </form>
              </div>

              {/* Remove links */}
              {quickLinks.length > 0 && (
                <div>
                  <SectionLabel accent>Eliminar enlace</SectionLabel>
                  <div className="flex flex-col gap-0.5">
                    {quickLinks.map(link => (
                      <button
                        key={link.id}
                        onClick={() => handleRemoveLink(link.id, link.name)}
                        className="flex items-center gap-2.5 cursor-pointer transition-all duration-120 w-full text-left"
                        style={{
                          fontFamily: 'inherit',
                          padding: '8px 10px',
                          border: '1px solid var(--border-dim)',
                          borderRadius: '2px',
                          background: 'var(--bg-surface)',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.borderColor = '#4a2020';
                          el.style.background = '#120a0a';
                          (el.querySelector<HTMLElement>('.ql-link-name') as HTMLElement).style.color = '#f07178';
                          const del = el.querySelector<HTMLElement>('.ql-link-del');
                          if (del) { del.style.opacity = '1'; del.style.color = '#f07178'; }
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.borderColor = 'var(--border-dim)';
                          el.style.background = 'var(--bg-surface)';
                          (el.querySelector<HTMLElement>('.ql-link-name') as HTMLElement).style.color = 'var(--text-mid)';
                          const del = el.querySelector<HTMLElement>('.ql-link-del');
                          if (del) { del.style.opacity = '0'; }
                        }}
                      >
                        <div
                          className="flex items-center justify-center flex-shrink-0"
                          style={{
                            width: '22px', height: '22px',
                            borderRadius: '2px',
                            background: 'var(--bg-raised)',
                            border: '1px solid var(--border-dim)',
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={link.icon ?? ''} alt={link.name} style={{ width: '12px', height: '12px', objectFit: 'contain' }} />
                        </div>
                        <span
                          className="ql-link-name flex-1 overflow-hidden text-ellipsis whitespace-nowrap transition-colors duration-120"
                          style={{ fontSize: '0.72rem', color: 'var(--text-mid)' }}
                        >
                          {link.name}
                        </span>
                        <span
                          className="ql-link-del flex items-center gap-1 flex-shrink-0 transition-all duration-120"
                          style={{ fontSize: '0.6rem', letterSpacing: '0.06em', color: 'var(--text-lo)', opacity: 0 }}
                        >
                          <IconTrash size={18} /> eliminar
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`.modal-url-input::placeholder { color: var(--text-lo); font-style: italic; }`}</style>
    </>
  );
};

export default QuickLinksModal;