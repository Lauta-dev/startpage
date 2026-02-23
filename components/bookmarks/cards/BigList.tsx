'use client';

import { Bookmark } from '@/types/bookmark';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { getFavicon, getDomain, getTitle } from './bookmark-utils';
import './BookmarkCard.css';

interface Props {
  bookmarks: Bookmark[];
  onEdit?:   (b: Bookmark) => void;
  onDelete?: (id: number)  => void;
}

const BigList: React.FC<Props> = ({ bookmarks, onEdit, onDelete }) => (
  <div className="card-grid gap-4 p-4">
    {bookmarks.map((bookmark, i) => (
      <div
        key={bookmark.id}
        className="card"
        style={{ animationDelay: `${Math.min(i * 35, 350)}ms`, position: 'relative' }}
      >
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col flex-1 no-underline text-inherit"
        >
          <div className="card__image-wrap">
            {bookmark.image
              // eslint-disable-next-line @next/next/no-img-element
              ? <img className="card__image" src={bookmark.image} alt="" loading="lazy" />
              : <div className="card__image-fallback">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={getFavicon(bookmark.url)} alt="" />
                </div>
            }
            <div className="card__image-overlay" />
          </div>

          <div className="card__body">
            <div className="card__meta">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="card__favicon" src={getFavicon(bookmark.url)} alt="" />
              <span className="card__domain">{getDomain(bookmark.url)}</span>
            </div>
            <h3 className="card__title">{getTitle(bookmark)}</h3>
            {bookmark.desc && <p className="card__desc">{bookmark.desc}</p>}
          </div>
        </a>

        {(onEdit || onDelete) && (
          <div className="card__actions">
            {onEdit && (
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); onEdit(bookmark); }}
                className="card__action-btn card__action-btn--edit"
                title="Editar"
              >
                <IconPencil size={18} stroke={1.75} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); onDelete(bookmark.id); }}
                className="card__action-btn card__action-btn--delete"
                title="Eliminar"
              >
                <IconTrash size={18} stroke={1.75} />
              </button>
            )}
          </div>
        )}
      </div>
    ))}
  </div>
);

export default BigList;