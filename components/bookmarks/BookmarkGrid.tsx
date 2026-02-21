'use client';

import React, { useState } from 'react';
import { IconBook2, IconTrash, IconCirclePlus, IconEdit, IconLayoutGrid, IconLayoutList } from '@tabler/icons-react';
import BookmarkModal from './bookmarkModal';
import { Bookmark } from '@/lib/types';
import { CreateBookmark, DeleteBookmark, EditBookark } from '@/actions/Bookmarks';

const BookmarkGrid = ({ bookmarks }: { bookmarks: Bookmark[] }) => {
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<{ id: number; bookmark: Bookmark } | null>(null);
  const [isListView, setIsListView] = useState(false);

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowBookmarkModal(false);
      setEditingBookmark(null);
      setIsClosing(false);
    }, 150);
  };

  const handleEditBookmark = ({ bookmark, id }: { bookmark: Bookmark; id: number }) => {
    setEditingBookmark({ id, bookmark });
    setShowBookmarkModal(true);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    try {
      if (editingBookmark) {
        await EditBookark({ customTitle: data.name as string, newUrl: data.site as string, id: editingBookmark.id });
      } else {
        await CreateBookmark(data.site as string);
      }
    } catch (error) {
      console.error(error);
    }
    handleCloseModal();
  }

  async function deleteBookmark(id: number) {
    await DeleteBookmark(id);
  }

  return (
    <div className="section-card p-4 sm:p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 gap-2 flex-wrap">
        <h3 className="text-xs font-semibold uppercase tracking-widest flex items-center gap-2"
            style={{ color: 'var(--text-secondary)' }}>
          <IconBook2 size={18} stroke={1.5} />
          Bookmarks
        </h3>

        <div className="flex items-center gap-3">
          {/* Toggle de vista */}
          <div className="flex items-center rounded-lg overflow-hidden"
               style={{ border: '1px solid var(--border)' }}>
            <button
              onClick={() => setIsListView(false)}
              className="p-1.5 transition-colors duration-200 cursor-pointer"
              style={{
                background: !isListView ? 'var(--accent)' : 'transparent',
                color: !isListView ? 'var(--accent-text)' : 'var(--text-muted)',
              }}
              title="Vista grid"
            >
              <IconLayoutGrid size={15} stroke={1.75} />
            </button>
            <button
              onClick={() => setIsListView(true)}
              className="p-1.5 transition-colors duration-200 cursor-pointer"
              style={{
                background: isListView ? 'var(--accent)' : 'transparent',
                color: isListView ? 'var(--accent-text)' : 'var(--text-muted)',
              }}
              title="Vista lista"
            >
              <IconLayoutList size={15} stroke={1.75} />
            </button>
          </div>

          {/* Añadir bookmark */}
          <button
            onClick={() => { setEditingBookmark(null); setShowBookmarkModal(true); }}
            className="dim-btn flex items-center gap-2 text-xs font-medium transition-colors duration-200 cursor-pointer"
          >
            <IconCirclePlus size={18} stroke={1.5} />
            Añadir
          </button>
        </div>
      </div>

      {/* Vista Grid */}
      {!isListView && (
        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {bookmarks.map((bookmark) => (
            <a
              key={bookmark.id}
              href={bookmark.site}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl overflow-hidden transition-all duration-200"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={bookmark?.ogImage ?? "/fallback.png"}
                  alt={bookmark.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 flex gap-1.5 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteBookmark(bookmark.id); }}
                    className="p-2 rounded-lg transition-colors cursor-pointer"
                    style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--nord11)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
                  >
                    <IconTrash size={18} />
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEditBookmark({ bookmark, id: bookmark.id }); }}
                    className="p-2 rounded-lg transition-colors cursor-pointer"
                    style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent-text)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
                  >
                    <IconEdit size={18} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <h2 className="font-semibold text-sm truncate mb-0.5" style={{ color: 'var(--text-primary)' }}>
                  {bookmark.title}
                </h2>
                <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{bookmark.site}</p>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Vista Lista */}
      {isListView && (
        <div className="flex flex-col gap-2">
          {bookmarks.map((bookmark) => (
            <a
              key={bookmark.id}
              href={bookmark.site}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
              style={{ border: '1px solid transparent' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
              }}
            >
              {/* Favicon */}
              <div className="w-7 h-7 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center"
                   style={{ background: 'var(--bg-surface)' }}>
                <img
                  src={`https://www.google.com/s2/favicons?domain=${bookmark.site}&sz=32`}
                  alt=""
                  className="w-4 h-4 object-contain"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>

              {/* Texto */}
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <span className="font-medium text-sm truncate"
                      style={{ color: 'var(--text-primary)' }}>
                  {bookmark.title}
                </span>
                <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                  {bookmark.site}
                </span>
              </div>

              {/* Acciones — ocultas hasta hover */}
              <div className="flex gap-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteBookmark(bookmark.id); }}
                  className="p-2 rounded-lg transition-all duration-150 cursor-pointer"
                  style={{ color: 'var(--text-secondary)', background: 'transparent' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--nord11)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                  }}
                >
                  <IconTrash size={17} />
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEditBookmark({ bookmark, id: bookmark.id }); }}
                  className="p-2 rounded-lg transition-all duration-150 cursor-pointer"
                  style={{ color: 'var(--text-secondary)', background: 'transparent' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--accent)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--accent-text)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                  }}
                >
                  <IconEdit size={17} />
                </button>
              </div>
            </a>
          ))}
        </div>
      )}

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
