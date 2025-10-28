import React from 'react';
import type { Effect, SortOption } from '../types';

interface EffectSelectorProps {
  effects: Effect[];
  onSelect: (effectId: string) => void;
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
  t: {
    selectEffect: string;
    sortBy: string;
    sortAlphabetical: string;
    sortNewest: string;
  };
}

const EffectCard: React.FC<{
  effect: Effect;
  onSelect: () => void;
}> = ({ effect, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className="w-full p-4 text-start rounded-lg transition-all duration-300 border-2 flex flex-col justify-between h-full bg-gray-800/50 border-gray-700 hover:bg-cyan-900/40 hover:border-cyan-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400"
    >
      <div>
        <h3 className="text-lg font-semibold text-white">{effect.title}</h3>
        <p className="text-sm text-gray-400 mt-1">{effect.description}</p>
      </div>
    </button>
  );
};

const SortButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
      isActive
        ? 'bg-cyan-600 text-white'
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`}
  >
    {label}
  </button>
);

export const EffectSelector: React.FC<EffectSelectorProps> = ({ effects, onSelect, sortBy, onSortChange, t }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-200 border-b-2 border-gray-700 pb-2 flex-grow">
          {t.selectEffect}
        </h2>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm text-gray-400">{t.sortBy}:</span>
          <SortButton label={t.sortNewest} isActive={sortBy === 'newest'} onClick={() => onSortChange('newest')} />
          <SortButton label={t.sortAlphabetical} isActive={sortBy === 'alphabetical'} onClick={() => onSortChange('alphabetical')} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {effects.map((effect) => (
          <EffectCard
            key={effect.id}
            effect={effect}
            onSelect={() => onSelect(effect.id)}
          />
        ))}
      </div>
    </div>
  );
};