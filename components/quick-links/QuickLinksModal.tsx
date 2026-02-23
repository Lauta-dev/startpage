'use client'

import { useState } from "react";
import { IconSettings, IconX, IconTrash } from "@tabler/icons-react";
import AddQuickLink from "@/actions/addQuickLink";
import RemoveQuickLink from "@/actions/DeleteQuickLink";

interface QuickLink {
  id: number; name: string; url: string;
  icon: string | null; position: number; created_at: string;
}

const mono = "'IBM Plex Mono', monospace";

function QuickLinksModal({ quickLinks }: { quickLinks: QuickLink[] }) {
  // mounted = el backdrop está en el DOM; visible = opacity:1 (CSS transition)
  const [mounted, setMounted]   = useState(false);
  const [visible, setVisible]   = useState(false);
  const [urlValue, setUrlValue] = useState('');

  function openModal() {
    setMounted(true);
    // doble rAF: asegura que el browser pintó opacity:0 antes de transicionar a 1
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }

  function closeModal() {
    setVisible(false);                   // dispara fade-out (transition 0.2s)
    setTimeout(() => {
      setMounted(false);
      setUrlValue('');
    }, 220);                             // debe ser >= duración de la transition
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await AddQuickLink({ url: formData.get('url') as string });
    setUrlValue('');
    (e.target as HTMLFormElement).reset();
  }

  const backdropOpacity = visible ? 1 : 0;
  const boxTransform    = visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)';

  return (
    <>
      {/* ── Settings trigger btn ── */}
      <button
        onClick={openModal}
        style={{
          fontFamily: mono,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-lo)',
          display: 'flex',
          alignItems: 'center',
          padding: '3px',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-lo)')}
      >
        <IconSettings size={15} stroke={1.5} />
      </button>

      {/* ── .modal-backdrop ── */}
      {mounted && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5,8,12,0.88)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: backdropOpacity,
            transition: 'opacity 0.2s',
          }}
        >
          {/* ── .modal-box ── */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              borderRadius: '3px',
              width: '90%',
              maxWidth: '520px',
              overflow: 'hidden',
              transform: boxTransform,
              transition: 'transform 0.2s, opacity 0.2s',
              opacity: backdropOpacity,
            }}
          >
            {/* ── .modal-header ── */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-dim)',
              background: 'var(--bg)',
            }}>
              {/* .modal-title */}
              <div style={{
                fontFamily: mono,
                fontSize: '0.65rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--text-mid)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                {/* .modal-title-dot */}
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, display: 'inline-block' }} />
                Quick Links — Gestionar
              </div>

              {/* .modal-close */}
              <button
                onClick={closeModal}
                style={{
                  fontFamily: mono,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '22px',
                  height: '22px',
                  border: '1px solid var(--border-dim)',
                  borderRadius: '2px',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--text-lo)',
                  fontSize: '0.75rem',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-dim)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-lo)';
                }}
              >
                <IconX size={12} />
              </button>
            </div>

            {/* ── .modal-body ── */}
            <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Añadir enlace */}
              <div>
                {/* .modal-sub */}
                <div style={{
                  fontFamily: mono,
                  fontSize: '0.58rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--text-lo)',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <span style={{ color: 'var(--accent)' }}>{'>'}</span>
                  Añadir enlace
                </div>

                {/* .modal-input-row — focus-within via React */}
                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: 'flex',
                    border: '1px solid var(--border)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e  => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={e   => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  {/* .modal-input */}
                  <input
                    type="url"
                    name="url"
                    value={urlValue}
                    onChange={e => setUrlValue(e.target.value)}
                    placeholder="https://ejemplo.com"
                    style={{
                      flex: 1,
                      background: 'var(--bg-surface)',
                      border: 'none',
                      outline: 'none',
                      fontFamily: mono,
                      fontSize: '0.78rem',
                      color: 'var(--text-hi)',
                      padding: '9px 12px',
                      minWidth: 0,
                    }}
                    /* placeholder italic via inline — no se puede con style prop en React, usamos className trick */
                    className="modal-url-input"
                  />
                  {/* .modal-submit */}
                  <button
                    type="submit"
                    disabled={!urlValue.trim()}
                    style={{
                      fontFamily: mono,
                      background: 'var(--accent)',
                      border: 'none',
                      borderLeft: '1px solid rgba(0,0,0,0.2)',
                      padding: '9px 16px',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#0a0c0f',
                      cursor: urlValue.trim() ? 'pointer' : 'not-allowed',
                      opacity: urlValue.trim() ? 1 : 0.35,
                      flexShrink: 0,
                      transition: 'filter 0.15s, opacity 0.15s',
                    }}
                    onMouseEnter={e => { if (urlValue.trim()) (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'; }}
                  >
                    Añadir
                  </button>
                </form>
              </div>

              {/* Eliminar enlace */}
              {quickLinks.length > 0 && (
                <div>
                  {/* .modal-sub */}
                  <div style={{
                    fontFamily: mono,
                    fontSize: '0.58rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--text-lo)',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <span style={{ color: 'var(--color-danger)' }}>{'>'}</span>
                    Eliminar enlace
                  </div>

                  {/* .modal-list */}
                  <div style={{ display: 'flex',  gap: '2px' }}>
                    {quickLinks.map(link => (
                      /* .modal-list-item */
                      <button
                        key={link.id}
                        onClick={() => RemoveQuickLink(link.id)}
                        style={{
                          fontFamily: mono,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 10px',
                          border: '1px solid var(--border-dim)',
                          borderRadius: '2px',
                          cursor: 'pointer',
                          background: 'var(--bg-surface)',
                          width: '100%',
                          textAlign: 'left',
                          transition: 'all 0.12s',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.borderColor = '#4a2020';
                          el.style.background  = '#120a0a';
                          const name = el.querySelector<HTMLElement>('.ml-name');
                          const del  = el.querySelector<HTMLElement>('.ml-del');
                          if (name) name.style.color   = '#f07178';
                          if (del)  del.style.opacity  = '1';
                          if (del)  del.style.color    = '#f07178';
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.borderColor = 'var(--border-dim)';
                          el.style.background  = 'var(--bg-surface)';
                          const name = el.querySelector<HTMLElement>('.ml-name');
                          const del  = el.querySelector<HTMLElement>('.ml-del');
                          if (name) name.style.color  = 'var(--text-mid)';
                          if (del)  del.style.opacity = '0';
                        }}
                      >
                        {/* .modal-list-icon */}
                        <div style={{
                          width: '22px', height: '22px',
                          borderRadius: '2px',
                          background: 'var(--bg-raised)',
                          border: '1px solid var(--border-dim)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={link.icon ?? ''} alt={link.name} style={{ width: '12px', height: '12px', objectFit: 'contain' }} />
                        </div>

                        {/* .modal-list-name */}
                        <span className="ml-name" style={{
                          flex: 1,
                          fontSize: '0.72rem',
                          color: 'var(--text-mid)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          transition: 'color 0.12s',
                        }}>
                          {link.name}
                        </span>

                        {/* .modal-list-del */}
                        <span className="ml-del" style={{
                          fontSize: '0.6rem',
                          letterSpacing: '0.06em',
                          color: 'var(--text-lo)',
                          opacity: 0,
                          transition: 'all 0.12s',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}>
                          <IconTrash size={12} /> eliminar
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

      {/* placeholder italic para el input del modal */}
      <style>{`
        .modal-url-input::placeholder {
          color: var(--text-lo);
          font-style: italic;
        }
      `}</style>
    </>
  );
}

export default QuickLinksModal;
