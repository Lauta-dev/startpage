'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  IconX, IconDeviceFloppy, IconWorldWww,
  IconTag, IconChevronDown, IconCheck,
} from '@tabler/icons-react';
import { Bookmark } from '@/types/bookmark';
import { Category } from '@/actions/getCategories';

interface BookmarkModalProps {
  isOpen:          boolean;
  isClosing:       boolean;
  editingBookmark: { id: number; bookmark: Bookmark } | null;
  categories:      Category[];
  onClose:         () => void;
  onSubmit:        (e: React.FormEvent<HTMLFormElement>, categoryId: number, categoryName: string) => void;
}

/* ── CategorySelect ── */
interface CategorySelectProps {
  categories: Category[];
  selectedId: number | null;
  onSelect:   (id: number | null) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ categories, selectedId, onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isNewCategory  = selectedId === null;
  const selectedLabel  = isNewCategory
    ? '+ Nueva categoría'
    : (categories.find(c => c.id === selectedId)?.name ?? '');

  const dropdownItem = (
    key: number | string,
    label: string,
    isSelected: boolean,
    onClick: () => void,
    accent = false,
    hasDivider = false,
  ) => (
    <button
      key={key}
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-2 cursor-pointer transition-colors duration-100"
      style={{
        padding: '8px 12px',
        fontFamily: 'inherit',
        fontSize: '0.68rem',
        letterSpacing: '0.04em',
        background: 'transparent',
        border: 'none',
        borderBottom: hasDivider ? '1px solid var(--border-dim)' : '1px solid var(--border-dim)',
        color: accent || isSelected ? 'var(--accent)' : 'var(--text-mid)',
        textAlign: 'left',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <span className="flex-1 text-left">{label}</span>
      {isSelected && <IconCheck size={18} stroke={2.5} style={{ color: 'var(--accent)', flexShrink: 0 }} />}
    </button>
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 cursor-pointer transition-all duration-150"
        style={{
          fontFamily: 'inherit',
          padding: '7px 10px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '2px',
          color: isNewCategory ? 'var(--accent)' : 'var(--text-mid)',
          fontSize: '0.68rem',
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--accent)'; el.style.color = 'var(--text-hi)'; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.color = isNewCategory ? 'var(--accent)' : 'var(--text-mid)'; }}
      >
        <span className="flex-1 text-left">{selectedLabel}</span>
        <IconChevronDown
          size={18} stroke={2}
          style={{ transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 overflow-hidden z-50"
          style={{
            bottom: 'calc(100% + 4px)',
            minWidth: '100%',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '2px',
          }}
        >
          {dropdownItem('new', '+ Nueva categoría', false, () => { onSelect(null); setOpen(false); }, true, true)}
          {categories.map(cat =>
            dropdownItem(cat.id, cat.name, cat.id === selectedId, () => { onSelect(cat.id); setOpen(false); })
          )}
        </div>
      )}
    </div>
  );
};

/* ── BookmarkModal ── */
const BookmarkModal: React.FC<BookmarkModalProps> = ({
  isOpen, isClosing, editingBookmark, categories, onClose, onSubmit,
}) => {
  const [urlValue, setUrlValue]         = useState('');
  const [nameValue, setNameValue]       = useState('');
  const [selectedCatId, setSelectedCatId] = useState<number | null>(categories[0]?.id ?? null);
  const [newCatName, setNewCatName]     = useState('');

  const isNewCategory = selectedCatId === null;
  const isEditing     = !!editingBookmark;

  useEffect(() => {
    if (!isOpen) return;
    setUrlValue(editingBookmark?.bookmark.url ?? '');
    setNameValue(editingBookmark?.bookmark.title ?? '');
    setNewCatName('');
    if (editingBookmark?.bookmark.category) {
      const match = categories.find(c => c.name === editingBookmark.bookmark.category);
      setSelectedCatId(match?.id ?? categories[0]?.id ?? null);
    } else {
      setSelectedCatId(categories[0]?.id ?? null);
    }
  }, [isOpen, editingBookmark, categories]);

  if (!isOpen) return null;

  const activeCatId   = isNewCategory ? -1 : selectedCatId!;
  const activeCatName = isNewCategory
    ? newCatName.trim()
    : (categories.find(c => c.id === selectedCatId)?.name ?? '');
  const categoryReady = isNewCategory ? newCatName.trim() !== '' : selectedCatId !== null;
  const isDisabled    = urlValue.trim() === '' || !categoryReady || (isEditing && nameValue.trim() === '');

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: '2px',
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: '0.8rem',
    color: 'var(--text-hi)',
    padding: '9px 12px',
    transition: 'border-color 0.15s',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.58rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--text-lo)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px',
    fontFamily: 'inherit',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'var(--modal-backdrop)',
        animation: isClosing ? 'fadeOut 0.15s ease-in' : 'fadeIn 0.15s ease-out',
      }}
      onClick={onClose}
    >
      <div
        className="w-full overflow-hidden"
        style={{
          maxWidth: '420px',
          background: 'var(--bg-raised)',
          border: '1px solid var(--border)',
          borderRadius: '3px',
          animation: isClosing ? 'slideDown 0.15s ease-in' : 'slideUp 0.15s ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-dim)', background: 'var(--bg)' }}
        >
          <span
            className="flex items-center gap-2"
            style={{ fontFamily: 'inherit', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-mid)' }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
            {isEditing ? 'Editar Bookmark' : 'Nuevo Bookmark'}
          </span>
          <button
            onClick={onClose}
            className="flex items-center justify-center cursor-pointer transition-all duration-150"
            style={{
              background: 'transparent',
              border: '1px solid var(--border-dim)',
              borderRadius: '2px',
              color: 'var(--text-lo)',
              width: '22px', height: '22px',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--accent)'; el.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-dim)'; el.style.color = 'var(--text-lo)'; }}
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={e => onSubmit(e, activeCatId, activeCatName)}
          className="flex flex-col gap-3.5"
          style={{ padding: '20px 18px' }}
        >
          {isEditing && (
            <div>
              <label style={labelStyle}>
                <IconTag size={18} stroke={1.5} style={{ color: 'var(--accent)' }} /> Nombre
              </label>
              <input
                type="text" name="name" value={nameValue}
                onChange={e => setNameValue(e.target.value)}
                placeholder="GitHub"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
            </div>
          )}

          <div>
            <label style={labelStyle}>
              <IconWorldWww size={18} stroke={1.5} style={{ color: 'var(--accent)' }} /> Sitio web
            </label>
            <input
              type="text" name="site" value={urlValue}
              onChange={e => setUrlValue(e.target.value)}
              placeholder="github.com"
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
          </div>

          {/* Bottom row: category + buttons */}
          <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: '6px' }}>
            <div style={{ flex: 1, minWidth: '120px' }}>
              {isNewCategory ? (
                <input
                  type="text"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  placeholder="Nueva categoría…"
                  style={{ ...inputStyle, padding: '7px 10px', fontSize: '0.68rem' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  autoFocus
                />
              ) : (
                <CategorySelect
                  categories={categories}
                  selectedId={selectedCatId}
                  onSelect={setSelectedCatId}
                />
              )}
            </div>

            <div className="flex gap-2 ml-auto">
              <button
                type="button" onClick={onClose}
                className="flex items-center gap-1.5 cursor-pointer transition-all duration-150"
                style={{
                  fontFamily: 'inherit',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-dim)',
                  borderRadius: '2px',
                  color: 'var(--text-lo)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.08em',
                  padding: '7px 14px',
                  flexShrink: 0,
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-mid)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-dim)'; el.style.color = 'var(--text-lo)'; }}
              >
                <IconX size={18} /> Cancelar
              </button>
              <button
                type="submit" disabled={isDisabled}
                className="flex items-center gap-1.5 transition-all duration-150"
                style={{
                  fontFamily: 'inherit',
                  background: 'var(--accent)',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  color: '#0a0c0f',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  padding: '7px 14px',
                  flexShrink: 0,
                  opacity: isDisabled ? 0.35 : 1,
                }}
                onMouseEnter={e => { if (!isDisabled) (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'; }}
              >
                <IconDeviceFloppy size={18} />
                {isEditing ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookmarkModal;