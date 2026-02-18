'use client'

import QuickLinksModal from "./QuickLinksModal";
import { IconLink } from "@tabler/icons-react";

interface QuickLink {
  id: number;
  name: string;
  url: string;
  icon: string | null;
  position: number;
  created_at: string;
}

const QuickLinks = ({ quickLinks }: { quickLinks: QuickLink[] }) => {
  return (
    <div className="section-card p-4 sm:p-5 mb-4 sm:mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest flex items-center gap-2"
            style={{ color: 'var(--text-secondary)' }}>
          <IconLink size={18} stroke={1.5} />
          Quick Links
        </h3>
        <QuickLinksModal quickLinks={quickLinks} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {quickLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-overlay)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            }}
          >
            <div className="w-8 h-8 rounded-lg p-1.5 flex-shrink-0 flex items-center justify-center"
                 style={{ background: 'var(--bg-elevated)' }}>
              <img src={link?.icon ?? ""} alt={link.name} className="w-full h-full object-contain" />
            </div>
            <h3 className="font-medium truncate text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}>
              {link.name}
            </h3>
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
