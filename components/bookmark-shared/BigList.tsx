'use client';

import { Bookmark } from "@/types/bookmark";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import "./bookmark.css";

function getFavicon(url: string) {
  try { return `https://www.google.com/s2/favicons?sz=32&domain=${new URL(url).hostname}`; }
  catch { return ''; }
}
function getDomain(url: string) {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return url; }
}
function getTitle(b: Bookmark) { return b.ogTitle ?? b.title; }

interface BigListProps {
  bookmarks: Bookmark[];
  onEdit?:   (b: Bookmark) => void;
  onDelete?: (id: number)  => void;
}

const mono = "'IBM Plex Mono', monospace";

const BigList: React.FC<BigListProps> = ({ bookmarks, onEdit, onDelete }) => (
  <div className="bm-grid gap-4 p-4">
    {bookmarks.map((bookmark, i) => (
      <div
        key={bookmark.id}
        className="bm-card"
        style={{ animationDelay: `${Math.min(i * 35, 350)}ms`, position: 'relative' }}
      >
        {/* Enlace principal cubre toda la card */}
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', flexDirection: 'column', flex: 1, textDecoration: 'none', color: 'inherit' }}
        >
          <div className="bm-card__img-wrap">
            {bookmark.image
              ? <img className="bm-card__img" src={bookmark.image} alt="" loading="lazy" />  // eslint-disable-line
              : <div className="bm-card__img-fallback">
                  <img src={getFavicon(bookmark.url)} alt="" /> {/* eslint-disable-line */}
                </div>
            }
            <div className="bm-card__img-overlay" />
          </div>
          <div className="bm-card__body">
            <div className="bm-card__meta">
              <img className="bm-card__favicon" src={getFavicon(bookmark.url)} alt="" /> {/* eslint-disable-line */}
              <span className="bm-card__domain">{getDomain(bookmark.url)}</span>
            </div>
            <h3 className="bm-card__title">{getTitle(bookmark)}</h3>
            {bookmark.desc && <p className="bm-card__desc">{bookmark.desc}</p>}
          </div>
        </a>

        {/* Botones de acción — aparecen en hover via CSS */}
        {(onEdit || onDelete) && (
          <div className="bm-card__actions">
            {onEdit && (
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); onEdit(bookmark); }}
                className="bm-card__action-btn bm-card__action-btn--edit"
                title="Editar"
              >
                <IconPencil size={12} stroke={1.75} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); onDelete(bookmark.id); }}
                className="bm-card__action-btn bm-card__action-btn--delete"
                title="Eliminar"
              >
                <IconTrash size={12} stroke={1.75} />
              </button>
            )}
          </div>
        )}
      </div>
    ))}
  </div>
);

export default BigList;
