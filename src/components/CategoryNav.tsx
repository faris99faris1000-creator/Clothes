import React from 'react';
import { CATEGORIES } from '../data/products';
import { Language } from '../types';

interface CategoryNavProps {
  activeCategory: string;
  onSelectCategory: (catId: string) => void;
  language: Language;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  language
}) => {
  return (
    <section className="w-full bg-[#FAF9F6] py-10 sm:py-14 border-b border-[#E8E5DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                className={`group flex flex-col items-center cursor-pointer text-center focus:outline-none transition-all duration-300 ${
                  isSelected ? 'opacity-100' : 'opacity-90 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-full aspect-square sm:aspect-[4/5] overflow-hidden bg-[#ECE9E2] relative mb-3 transition-all duration-300 ${
                    isSelected ? 'ring-2 ring-neutral-900 ring-offset-2' : 'group-hover:shadow-md'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>

                <span
                  className={`text-[11px] sm:text-[12px] tracking-[0.16em] uppercase font-sans font-medium pb-1 border-b transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'text-black font-semibold border-neutral-900'
                      : 'text-neutral-700 border-transparent group-hover:text-black'
                  }`}
                >
                  {language === 'ar' ? cat.nameAr : cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
