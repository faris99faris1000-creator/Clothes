import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Product, Currency, Language } from '../types';
import { formatPrice } from '../utils/currency';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  currency: Currency;
  language: Language;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  currency,
  language
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const popularTags = [
    { en: 'Leather', ar: 'جلد' },
    { en: 'Suede', ar: 'شامواه' },
    { en: 'Chelsea Boots', ar: 'تشيلسي' },
    { en: 'Overcoat', ar: 'معطف' },
    { en: 'Cashmere', ar: 'كشمير' },
    { en: 'Silk', ar: 'حرير' }
  ];

  const q = query.trim().toLowerCase();

  const filteredProducts = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameAr.includes(query.trim()) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.categoryLabelAr.includes(query.trim()) ||
          p.material.toLowerCase().includes(q) ||
          (p.leatherType && p.leatherType.toLowerCase().includes(q)) ||
          (p.leatherTypeAr && p.leatherTypeAr.includes(query.trim())) ||
          p.description.toLowerCase().includes(q)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FAF9F6] animate-in fade-in duration-200">
      {/* Top Bar with Input */}
      <div className="border-b border-[#E5E2DC] px-6 sm:px-12 py-6 bg-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3">
            <Search className="w-6 h-6 text-neutral-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder={
                language === 'ar'
                  ? 'ابحث عن الملابس الرجالية، الجلد، الشامواه، الأحذية، الحرير...'
                  : 'Search menswear, leather jackets, suede, Chelsea boots, silk, cashmere...'
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-base sm:text-xl font-light text-neutral-900 placeholder:text-neutral-400 focus:outline-none bg-transparent"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-neutral-400 hover:text-black p-1 cursor-pointer"
                aria-label="Clear query"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-black cursor-pointer uppercase text-xs tracking-widest font-medium"
          >
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>

      {/* Body Area */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-8 max-w-5xl mx-auto w-full">
        {!query && (
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-sans">
              {language === 'ar' ? 'عمليات البحث الشائعة' : 'POPULAR INQUIRIES'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag.en}
                  onClick={() => setQuery(language === 'ar' ? tag.ar : tag.en)}
                  className="px-4 py-2 bg-white border border-[#DDD8CF] hover:border-black text-xs text-neutral-800 transition-colors cursor-pointer"
                >
                  {language === 'ar' ? tag.ar : tag.en}
                </button>
              ))}
            </div>
          </div>
        )}

        {query && filteredProducts.length === 0 && (
          <div className="py-16 text-center text-neutral-500 text-sm">
            {language === 'ar'
              ? `لا توجد نتائج مطابقة لـ "${query}". حاول البحث عن الجلد أو المعاطف أو الأحذية.`
              : `No pieces found matching "${query}". Try searching for Leather, Suede, Boots, or Wool.`}
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-sans">
              {language === 'ar'
                ? `النتائج (${filteredProducts.length})`
                : `MATCHING PIECES (${filteredProducts.length})`}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProduct(p);
                    onClose();
                  }}
                  className="flex gap-4 p-3 bg-white border border-[#E8E5DF] hover:border-black cursor-pointer transition-colors"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-16 h-20 object-cover bg-neutral-100 shrink-0"
                  />
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900">
                        {language === 'ar' ? p.nameAr : p.name}
                      </h4>
                      <p className="text-xs text-neutral-500">
                        {language === 'ar' ? p.categoryLabelAr : p.categoryLabel}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-neutral-900 tabular-nums">
                      {formatPrice(p.price, currency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
