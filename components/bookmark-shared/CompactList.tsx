'use client';

import { Bookmark } from "@/types/bookmark";
import { IconPencil, IconTrash } from "@tabler/icons-react";

function getFavicon(url: string) {
  try { return `https://www.google.com/s2/favicons?sz=32&domain=${new URL(url).hostname}`; }
  catch { return ''; }
}
function getDomain(url: string) {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return url; }
}
function getTitle(b: Bookmark) { return b.ogTitle ?? b.title; }

const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

interface CompactListProps {
  bookmarks: Bookmark[];
  onEdit?:   (b: Bookmark) => void;
  onDelete?: (id: number)  => void;
}

const CompactList = ({ bookmarks, onEdit, onDelete }: CompactListProps) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    {bookmarks.map((bookmark, i) => (
      <div
        key={bookmark.id}
        style={{
          position: 'relative',
          borderBottom: '1px solid var(--border-dim)',
          transition: 'background 0.1s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)';
          const actions = (e.currentTarget as HTMLElement).querySelector('.cl-actions') as HTMLElement;
          if (actions) actions.style.opacity = '1';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = 'transparent';
          const actions = (e.currentTarget as HTMLElement).querySelector('.cl-actions') as HTMLElement;
          if (actions) actions.style.opacity = '0';
        }}
      >
        {/* Link cubre todo */}
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', flexDirection: 'column', gap: '3px',
            padding: '10px 14px', textDecoration: 'none', color: 'inherit' }}
        >

          <div className="flex items-center gap-5">

            <div style={{ 
              border: '1px solid var(--border-dim)', background: 'var(--bg-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src={getFavicon(bookmark.url)} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
            </div>

          <div>
            {/* Row 1: hostname izquierda */}
          <span style={{ ...mono, fontSize: '0.6rem', letterSpacing: '0.06em',
            color: 'var(--text-lo)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {getDomain(bookmark.url)}
          </span>

          {/* Row 2: favicon + título */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            
            <span className="cl-title" style={{ ...mono, fontSize: '0.76rem', fontWeight: 500,
              color: 'var(--text-hi)', overflow: 'hidden', textOverflow: 'ellipsis',
              whiteSpace: 'nowrap', flex: 1, transition: 'color 0.12s' }}>
              {getTitle(bookmark)}
            </span>
          </div>

          {/* Row 3: descripción izquierda */}
          {bookmark.desc && (
            <span style={{ ...mono, fontSize: '0.62rem', color: 'var(--text-lo)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {bookmark.desc}
            </span>
          )}
          </div>
          </div>
          
          
        </a>

        {/* Botones acción — aparecen en hover */}
        {(onEdit || onDelete) && (
          <div
            className="cl-actions"
            style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)',
              display: 'flex', gap: '4px', opacity: 0, transition: 'opacity 0.15s' }}
          >
            {onEdit && (
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); onEdit(bookmark); }}
                title="Editar"
                style={{ ...mono, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '36px', height: '36px', borderRadius: '2px',
                  border: '1px solid var(--border)', background: 'var(--bg-raised)',
                  cursor: 'pointer', color: 'var(--text-lo)', transition: 'color 0.12s, border-color 0.12s, background 0.12s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--accent)'; el.style.borderColor = 'var(--accent)'; el.style.background = 'color-mix(in srgb, var(--accent) 8%, var(--bg-raised))'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--text-lo)'; el.style.borderColor = 'var(--border)'; el.style.background = 'var(--bg-raised)'; }}
              >
                <IconPencil size={24} stroke={1.75} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); onDelete(bookmark.id); }}
                title="Eliminar"
                style={{ ...mono, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '36px', height: '36px', borderRadius: '2px',
                  border: '1px solid var(--border)', background: 'var(--bg-raised)',
                  cursor: 'pointer', color: 'var(--text-lo)', transition: 'color 0.12s, border-color 0.12s, background 0.12s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--color-danger)'; el.style.borderColor = 'var(--color-danger-border)'; el.style.background = 'var(--color-danger-bg)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--text-lo)'; el.style.borderColor = 'var(--border)'; el.style.background = 'var(--bg-raised)'; }}
              >
                <IconTrash size={24} stroke={1.75} />
              </button>
            )}
          </div>
        )}
      </div>
    ))}
  </div>
);

export default CompactList;
