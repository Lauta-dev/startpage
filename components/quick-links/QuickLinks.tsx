'use client'

import QuickLinksModal from "./QuickLinksModal";

interface QuickLink {
  id: number; name: string; url: string;
  icon: string | null; position: number; created_at: string;
}

const QuickLinks = ({ quickLinks }: { quickLinks: QuickLink[] }) => (
  <div className="section">
    <div className="section-head">
      <span className="section-label">Quick Links</span>
      <QuickLinksModal quickLinks={quickLinks} />
    </div>
    <div className="section-body">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 0,
      }}>
        {quickLinks.map((link, i) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 14px',
              textDecoration: 'none', color: 'var(--text-mid)',
              borderRight: '1px solid var(--border-dim)',
              borderBottom: '1px solid var(--border-dim)',
              fontSize: '0.72rem', letterSpacing: '0.02em',
              transition: 'background 0.1s, color 0.1s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'var(--bg-hover)';
              el.style.color = 'var(--text-hi)';
              (el.querySelector('.ql-icon') as HTMLElement)?.style.setProperty('border-color', 'var(--accent)');
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'transparent';
              el.style.color = 'var(--text-mid)';
              (el.querySelector('.ql-icon') as HTMLElement)?.style.setProperty('border-color', 'var(--border)');
            }}
          >
            <div className="ql-icon" style={{
              width: '26px', height: '26px', borderRadius: '2px',
              border: '1px solid var(--border)', background: 'var(--bg-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'border-color 0.15s',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={link.icon ?? ''} alt={link.name} style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
            </div>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {link.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  </div>
);

export default QuickLinks;
