'use client'

import { useState } from "react";
import QuickLinksModal from "./QuickLinksModal";

interface QuickLink {
  id: number;
  name: string;
  url: string;
  icon: string | null;
  position: number;
  created_at: string;
}

const QuickLinks= ({
  quickLinks
}: {quickLinks: QuickLink[]} ) => {
  const [delOpt, setDelOpt] = useState(false)


  return (
    <div className="glass-container rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex justify-between mb-2 items-center">
        <h3 className="text-sm font-semibold mb-3 sm:mb-4 text-[#60a5fa]">Quick Links</h3>
        <QuickLinksModal quickLinks={quickLinks} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {quickLinks.map((link, index) => (
          delOpt ? (
          <button className="btn flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-base-200/50 rounded-xl hover:bg-error/20 hover:border-error hover:text-error transition-all duration-300 group quick-link-btn border border-transparent">
              <div className="avatar">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-base-100/50 p-1.5 sm:p-2">
                  <img src={link?.icon ?? ""} alt={link.name} />
                </div>
              </div>
              <div className="flex-1 min-w-0 justify-between items-center flex">
                <h3 className="font-semibold truncate text-xs sm:text-sm transition-colors">
                  {link.name}
                </h3>
              </div>
          </button>
          ) : (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-base-200/50 rounded-xl hover:bg-[rgba(59,130,246,0.1)] hover:border-[rgba(59,130,246,0.3)] transition-all duration-300 group quick-link-btn border border-transparent"
          >
            <div className="avatar">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-base-100/50 p-1.5 sm:p-2">
                <img src={link?.icon ?? ""} alt={link.name} />
              </div>
            </div>
            <div className="flex-1 min-w-0 justify-between items-center flex">
              <h3 className="font-semibold truncate text-xs sm:text-sm group-hover:text-primary transition-colors">
                {link.name}
              </h3>
            </div>
          </a>
          )
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
