'use client';

import React, { useState, useEffect } from 'react';
import { IconCirclePlus, IconLayoutGrid, IconLayoutList } from '@tabler/icons-react';
import BookmarkModal from './bookmarkModal';
import { CreateBookmark, EditBookark } from '@/actions/Bookmarks';
import CompactList from '@/components/bookmark-shared/CompactList';
import { Bookmark } from '@/types/bookmark';
import BigList from '@/components/bookmark-shared/BigList';

const MOBILE = 640;

const BookmarkGrid = ({ bookmarks }: { bookmarks: Bookmark[] }) => {
  const [showModal, setShowModal]       = useState(false);
  const [isClosing, setIsClosing]       = useState(false);
  const [editingBm, setEditingBm]       = useState<{ id: number; bookmark: Bookmark } | null>(null);
  const [isListView, setIsListView]     = useState(false);
  const [isMobile, setIsMobile]         = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE}px)`);
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => { setShowModal(false); setEditingBm(null); setIsClosing(false); }, 150);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (editingBm) await EditBookark({ customTitle: data.name as string, newUrl: data.site as string, id: editingBm.id });
      else await CreateBookmark(data.site as string);
    } catch (err) { console.error(err); }
    closeModal();
  }

  const ViewBtn = ({ list }: { list: boolean }) => (
    <button
      onClick={() => setIsListView(list)}
      style={{
        background: isListView === list ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'transparent',
        border: 'none', borderRight: list ? 'none' : '1px solid var(--border-dim)',
        padding: '5px 8px', cursor: 'pointer',
        color: isListView === list ? 'var(--accent)' : 'var(--text-lo)',
        display: 'flex', alignItems: 'center', transition: 'all 0.12s',
      }}
      onMouseEnter={e => { if (isListView !== list) (e.currentTarget as HTMLElement).style.color = 'var(--text-mid)'; }}
      onMouseLeave={e => { if (isListView !== list) (e.currentTarget as HTMLElement).style.color = 'var(--text-lo)'; }}
    >
      {list
        ? <IconLayoutList size={14} stroke={1.75} />
        : <IconLayoutGrid size={14} stroke={1.75} />}
    </button>
  );

  return (
    <div className="section">
      <div className="section-head">
        <a href="/bookmarks" className="section-label"
          style={{ textDecoration: 'none', transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-lo)')}
        >
          Bookmarks
        </a>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {!isMobile && (
            <div style={{ display: 'flex', border: '1px solid var(--border-dim)', borderRadius: '2px', overflow: 'hidden' }}>
              <ViewBtn list={false} />
              <ViewBtn list={true} />
            </div>
          )}
          <button
            onClick={() => { setEditingBm(null); setShowModal(true); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              background: 'transparent', border: '1px solid var(--border-dim)', borderRadius: '2px',
              cursor: 'pointer', color: 'var(--text-lo)', fontFamily: 'inherit',
              fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '4px 10px', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--accent)'; el.style.borderColor = 'color-mix(in srgb, var(--accent) 35%, transparent)'; el.style.background = 'color-mix(in srgb, var(--accent) 5%, transparent)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--text-lo)'; el.style.borderColor = 'var(--border-dim)'; el.style.background = 'transparent'; }}
          >
            <IconCirclePlus size={13} stroke={1.5} /> Añadir
          </button>
        </div>
      </div>

      <div className="section-body">
        {(isMobile || isListView)
          ? <CompactList bookmarks={bookmarks} />
          : <BigList bookmarks={bookmarks} />}
      </div>

      <BookmarkModal isOpen={showModal} isClosing={isClosing}
        editingBookmark={editingBm} onClose={closeModal} onSubmit={handleSubmit} />
    </div>
  );
};

export default BookmarkGrid;
