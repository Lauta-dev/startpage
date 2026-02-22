'use client';

import React, { useState } from 'react';
import { IconBook2, IconTrash, IconCirclePlus, IconEdit, IconLayoutGrid, IconLayoutList } from '@tabler/icons-react';
import BookmarkModal from './bookmarkModal';
import { CreateBookmark, DeleteBookmark, EditBookark } from '@/actions/Bookmarks';
import CompactList from '@/components/bookmark-shared/CompactList';
import { Bookmark } from '@/types/bookmark';
import BigList from '@/components/bookmark-shared/BigList';

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
        <a href="/bookmarks" className="text-xs font-semibold uppercase tracking-widest flex items-center gap-2"
            style={{ color: 'var(--text-secondary)' }}>
          <IconBook2 size={18} stroke={1.5} />
          Bookmarks
        </a>

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
      {!isListView && <BigList bookmarks={bookmarks} /> }

      {/* Vista Lista */}
      {isListView && <CompactList bookmarks={bookmarks} /> }

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
