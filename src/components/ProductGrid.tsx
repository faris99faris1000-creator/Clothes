import React, { useState, useEffect } from 'react';
import { Product, Currency, Language, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { ChevronDown, X } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  activeCategory: string;
  onSelectCategory: (catId: string) => void;
  currency: Currency;
  language: Language;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  currency,
  language,
  wishlistIds,
  onToggleWishlist,
  onQuickView,
  onAddToCart
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [genderFilter, setGenderFilter] = useState<'all' | 'men' | 'women'>('all');
  const [materialFilter, setMaterialFilter] = useState<string>('all');
  const [leatherTypeFilter, setLeatherTypeFilter] = useState<string>('all');

  // Reset sub-filters gracefully when switching major category
  useEffect(() => {
    if (activeCategory === 'menswear') {
      setGenderFilter('men');
    } else if (activeCategory === 'womenswear') {
      setGenderFilter('women');
    } else {
      setGenderFilter('all');
    }

    if (activeCategory === 'leather') {
      setMaterialFilter('leather');
    } else {
      setMaterialFilter('all');
      setLeatherTypeFilter('all');
    }
  }, [activeCategory]);

  // Filter by main category (supporting primary + secondaryCategories)
  let displayedProducts = [...products];

  if (activeCategory === 'new-arrivals') {
    displayedProducts = displayedProducts.filter(
      (p) => p.isNew || p.category === 'new-arrivals' || p.secondaryCategories?.includes('new-arrivals')
    );
  } else if (activeCategory !== 'all') {
    displayedProducts = displayedProducts.filter(
      (p) =>
        p.category === (activeCategory as ProductCategory) ||
        p.secondaryCategories?.includes(activeCategory as ProductCategory)
    );
  }

  // Filter by Gender (All / Men / Women)
  if (genderFilter === 'men') {
    displayedProducts = displayedProducts.filter((p) => p.gender === 'men' || p.gender === 'unisex');
  } else if (genderFilter === 'women') {
    displayedProducts = displayedProducts.filter((p) => p.gender === 'women' || p.gender === 'unisex');
  }

  // Filter by Material Group
  if (materialFilter !== 'all') {
    if (materialFilter === 'leather') {
      displayedProducts = displayedProducts.filter(
        (p) => p.materialGroup === 'leather' || Boolean(p.leatherType)
      );
    } else {
      displayedProducts = displayedProducts.filter((p) => p.materialGroup === materialFilter);
    }
  }

  // Filter by specific Leather Type
  if (leatherTypeFilter !== 'all') {
    displayedProducts = displayedProducts.filter((p) =>
      p.leatherType?.toLowerCase().includes(leatherTypeFilter.toLowerCase())
    );
  }

  // Sorting
  if (sortBy === 'price-asc') {
    displayedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    displayedProducts.sort((a, b) => b.price - a.price);
  }

  const categoryTitles: Record<string, { en: string; ar: string }> = {
    all: { en: 'THE COMPLETE COLLECTION', ar: 'المجموعة الكاملة' },
    'new-arrivals': { en: 'NEW ARRIVALS', ar: 'وصل حديثاً' },
    menswear: { en: 'MENSWEAR ATELIER', ar: 'أزياء الرجال الفاخرة' },
    womenswear: { en: 'WOMENSWEAR ATELIER', ar: 'أزياء النساء الفاخرة' },
    leather: { en: 'THE LEATHER HOUSE', ar: 'دار الملابس الجلدية بكل أنواعها' },
    shoes: { en: 'ARTISANAL FOOTWEAR', ar: 'الأحذية المصنوعة يدوياً' },
    accessories: { en: 'LEATHER GOODS & TRAVEL', ar: 'الحقائب والإكسسوارات الجلدية' },
    sale: { en: 'ARCHIVAL SALE', ar: 'تخفيضات الأرشيف' }
  };

  const currentTitle = categoryTitles[activeCategory] || categoryTitles.all;

  const leatherTypes = [
    { id: 'all', en: 'All Leathers', ar: 'كل أنواع الجلد' },
    { id: 'calfskin', en: 'Full-Grain Calfskin', ar: 'جلد العجل الطبيعي' },
    { id: 'suede', en: 'Italian Suede', ar: 'الشامواه الإيطالي' },
    { id: 'nappa', en: 'Nappa Leather', ar: 'جلد النابا' },
    { id: 'lambskin', en: 'French Lambskin', ar: 'جلد الحمل الناعم' },
    { id: 'shearling', en: 'Nubuck & Shearling', ar: 'نوبوك وشيرلنغ' }
  ];

  const showLeatherSubFilters = activeCategory === 'leather' || materialFilter === 'leather';

  const hasActiveFilters =
    activeCategory !== 'all' ||
    genderFilter !== 'all' ||
    materialFilter !== 'all' ||
    leatherTypeFilter !== 'all';

  const clearAllFilters = () => {
    onSelectCategory('all');
    setGenderFilter('all');
    setMaterialFilter('all');
    setLeatherTypeFilter('all');
  };

  return (
    <section id="collection-grid" className="w-full bg-[#FAF9F6] py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#E8E5DF] gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 font-sans mb-1">
              {language === 'ar' ? 'خياطة إيطالية · جلود طبيعية · أحذية حرفية' : 'Curated Atelier Capsule'}
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-neutral-900 tracking-tight">
              {language === 'ar' ? currentTitle.ar : currentTitle.en}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-sans">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 text-neutral-600 hover:text-black underline underline-offset-4 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'عرض الكل' : 'Reset Filters'}</span>
              </button>
            )}

            {/* Sort Selector */}
            <div className="relative inline-flex items-center">
              <span className="text-neutral-500 me-2">{language === 'ar' ? 'الترتيب:' : 'Sort:'}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
                className="appearance-none bg-white border border-[#DCD7CD] text-neutral-800 py-1.5 ps-3 pe-8 text-xs font-medium cursor-pointer focus:outline-none focus:border-neutral-900"
              >
                <option value="featured">{language === 'ar' ? 'المميزة' : 'Featured'}</option>
                <option value="price-asc">{language === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                <option value="price-desc">{language === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute end-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500" />
            </div>

            <div className="text-neutral-500 text-xs tabular-nums">
              {displayedProducts.length} {language === 'ar' ? 'قطع' : 'pieces'}
            </div>
          </div>
        </div>

        {/* Interactive Filter Toolbar: Gender + Material */}
        <div className="py-5 border-b border-[#E8E5DF] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Gender Segmented Control */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] uppercase tracking-widest text-neutral-400 me-2">
              {language === 'ar' ? 'القسم:' : 'Department:'}
            </span>
            {[
              { id: 'all', en: 'All', ar: 'الكل' },
              { id: 'men', en: 'Men', ar: 'رجالي' },
              { id: 'women', en: 'Women', ar: 'نسائي' }
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => setGenderFilter(g.id as 'all' | 'men' | 'women')}
                className={`px-3.5 py-1.5 text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer whitespace-nowrap ${
                  genderFilter === g.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white border border-[#DCD7CD] text-neutral-700 hover:border-neutral-900'
                }`}
              >
                {language === 'ar' ? g.ar : g.en}
              </button>
            ))}
          </div>

          {/* Material / Category Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] uppercase tracking-widest text-neutral-400 me-2">
              {language === 'ar' ? 'الخامة:' : 'Craft:'}
            </span>
            {[
              { id: 'all', en: 'All Fabrics', ar: 'الكل' },
              { id: 'leather', en: 'Leather (All Types)', ar: 'الجلود بكل أنواعها' },
              { id: 'wool', en: 'Wool & Tailoring', ar: 'صوف وتفصيل' },
              { id: 'silk-cashmere', en: 'Silk & Cashmere', ar: 'حرير وكشمير' },
              { id: 'footwear', en: 'Footwear', ar: 'الأحذية' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setMaterialFilter(m.id);
                  if (m.id !== 'leather') setLeatherTypeFilter('all');
                }}
                className={`px-3.5 py-1.5 text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer whitespace-nowrap ${
                  materialFilter === m.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white border border-[#DCD7CD] text-neutral-700 hover:border-neutral-900'
                }`}
              >
                {language === 'ar' ? m.ar : m.en}
              </button>
            ))}
          </div>
        </div>

        {/* Leather Varieties Sub-Bar (shown when browsing Leather) */}
        {showLeatherSubFilters && (
          <div className="py-3.5 px-4 bg-[#F3F0EA] border-b border-[#E5E2DC] flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-widest text-neutral-500 me-2 font-medium">
              {language === 'ar' ? 'أنواع الجلود:' : 'Leather Hide:'}
            </span>
            {leatherTypes.map((lt) => (
              <button
                key={lt.id}
                onClick={() => setLeatherTypeFilter(lt.id)}
                className={`px-3 py-1 text-[11px] uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                  leatherTypeFilter === lt.id
                    ? 'bg-neutral-900 text-white font-medium'
                    : 'bg-white/80 text-neutral-700 border border-[#D9D5CC] hover:border-neutral-900'
                }`}
              >
                {language === 'ar' ? lt.ar : lt.en}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {displayedProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <p className="text-neutral-500 text-sm">
              {language === 'ar'
                ? 'لم يتم العثور على قطع مطابقة لهذه التصفية.'
                : 'No pieces match this exact filter combination.'}
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2.5 bg-neutral-900 text-white text-xs tracking-wider uppercase font-medium cursor-pointer"
            >
              {language === 'ar' ? 'عرض جميع القطع' : 'Browse Complete Collection'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 sm:gap-y-14 pt-10">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                language={language}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
