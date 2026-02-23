'use client';

import { Bookmark } from '@/types/bookmark';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { getFavicon, getDomain, getTitle } from './bookmark-utils';
import './BigListMobile.css';

interface Props {
  bookmarks: Bookmark[];
  onEdit?:   (b: Bookmark) => void;
  onDelete?: (id: number)  => void;
}

const BigListMobile: React.FC<Props> = ({ bookmarks, onEdit, onDelete }) => (
  <div className="feed-list">
    {bookmarks.map((bookmark, i) => (
      <div
        key={bookmark.id}
        className="feed-row"
        style={{ animationDelay: `${Math.min(i * 35, 350)}ms` }}
      >
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="feed-row__link"
        >
          <div className="feed-row__body">
            <span className="feed-row__domain">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getFavicon(bookmark.url)} alt="" className="feed-row__favicon" />
              {getDomain(bookmark.url)}
            </span>
            <h3 className="feed-row__title">{getTitle(bookmark)}</h3>
            {bookmark.desc && <p className="feed-row__desc">{bookmark.desc}</p>}
          </div>
        </a>

        {(onEdit || onDelete) && (
          <div className="feed-row__actions">
            {onEdit && (
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); onEdit(bookmark); }}
                className="feed-row__action-btn feed-row__action-btn--edit"
                title="Editar"
              >
                <IconPencil size={18} stroke={1.75} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); onDelete(bookmark.id); }}
                className="feed-row__action-btn feed-row__action-btn--delete"
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

export default BigListMobile;
