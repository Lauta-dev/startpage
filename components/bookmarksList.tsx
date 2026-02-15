import React from 'react';
import Image from 'next/image';

interface Link {
  name: string;
  icon: string;
  site: string;
}

interface Category {
  category: string;
  links: Link[];
}

interface BookmarkListProps {
  data: Category[];
}

const BookmarkList: React.FC<BookmarkListProps> = ({ data }) => {
  return (
    <div className="max-w-7xl w-full px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((categoryData, categoryIndex) => (
          <div key={categoryIndex} className="bg-white rounded-3xl p-6 border-2 border-gray-100 hover:border-gray-200 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900">
                {categoryData.category}
              </h2>
            </div>
            <div className="space-y-3">
              {categoryData.links.map((link, linkIndex) => (
                <a
                  key={linkIndex}
                  href={`https://${link.site}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-lg group-hover:bg-white transition-colors duration-300 shadow-sm">
                    <img
                      src={link.icon}
                      alt={`${link.name} icon`}
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-sm group-hover:text-blue-600 transition-colors duration-300">
                      {link.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {link.site}
                    </p>
                  </div>
                  <svg 
                    className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarkList;
