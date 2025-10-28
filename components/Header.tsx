import React from 'react';

interface HeaderProps {
  t: {
    headerTitle: string;
    headerSubtitle: string;
    languageToggle: string;
  };
  onLanguageToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ t, onLanguageToggle }) => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex-1"></div>
        <div className="flex-1 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-500">
              {t.headerTitle}
            </span>
          </h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">{t.headerSubtitle}</p>
        </div>
        <div className="flex-1 flex justify-end">
          <button 
            onClick={onLanguageToggle}
            className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 bg-gray-800/50 px-3 py-1.5 rounded-md border border-gray-700 hover:border-cyan-500"
          >
            {t.languageToggle}
          </button>
        </div>
      </div>
    </header>
  );
};