import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language, ProductCategory } from '../types';

interface HeroProps {
  onShopCategory: (category: ProductCategory | 'all') => void;
  onInspectProductById: (productId: string) => void;
  language: Language;
}

interface Slide {
  id: number;
  targetCategory: ProductCategory | 'all';
  collection: string;
  collectionAr: string;
  title: string;
  titleAr: string;
  ctaLabel: string;
  ctaLabelAr: string;
  image: string;
  featuredProductId: string;
  item1: string;
  item1Ar: string;
  item2: string;
  item2Ar: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    targetCategory: 'all',
    collection: 'A/W 24 COLLECTION.',
    collectionAr: 'مجموعة خريف وشتاء 24.',
    title: 'Refined Elegance.',
    titleAr: 'أناقة راقية بلا تكلف.',
    ctaLabel: 'SHOP NOW',
    ctaLabelAr: 'تسوق المجموعة الآن',
    image: '/src/assets/images/hero_avenir_refined_elegance_1794086283054.jpg',
    featuredProductId: 'prod-wool-coat',
    item1: 'Minimalist Wool Coat',
    item1Ar: 'معطف صوف مينيماليست',
    item2: 'Wide Leg Trousers',
    item2Ar: 'بنطال فضفاض بقصة راقية'
  },
  {
    id: 2,
    targetCategory: 'menswear',
    collection: 'MENSWEAR ATELIER.',
    collectionAr: 'مجموعة الرجال الحصرية.',
    title: 'Architectural Menswear.',
    titleAr: 'تفصيل رجالي معماري.',
    ctaLabel: 'SHOP MENSWEAR',
    ctaLabelAr: 'تسوق ملابس الرجال',
    image: '/src/assets/images/mens_cashmere_suit_editorial_1795127350944.jpg',
    featuredProductId: 'prod-mens-leather-overcoat-suit',
    item1: 'Saddle Leather Overcoat',
    item1Ar: 'معطف جلد طبيعي فاخر',
    item2: 'Slate Wool Suiting',
    item2Ar: 'بدلة صوف وكشمير'
  },
  {
    id: 3,
    targetCategory: 'leather',
    collection: 'THE LEATHER HOUSE.',
    collectionAr: 'دار الجلود الفاخرة.',
    title: 'Full-Grain Craft.',
    titleAr: 'حرفية الجلود الطبيعية.',
    ctaLabel: 'EXPLORE LEATHER',
    ctaLabelAr: 'اكتشف الملابس الجلدية',
    image: '/src/assets/images/mens_leather_biker_jacket_1795127351176.jpg',
    featuredProductId: 'prod-mens-biker',
    item1: 'Full-Grain Calfskin Jacket',
    item1Ar: 'سترة بايكر جلد عجل طبيعي',
    item2: 'Tuscan Calfskin Boots',
    item2Ar: 'أحذية جلد إيطالي'
  },
  {
    id: 4,
    targetCategory: 'leather',
    collection: 'NAPPA & SUEDE EDIT.',
    collectionAr: 'تشكيلة النابا والشامواه.',
    title: 'Sculpted Nappa.',
    titleAr: 'جلد النابا المصقول.',
    ctaLabel: 'VIEW COLLECTION',
    ctaLabelAr: 'عرض التشكيلة',
    image: '/src/assets/images/womens_leather_trench_coat_1795127351542.jpg',
    featuredProductId: 'prod-womens-leather-trench',
    item1: 'Belted Nappa Trench Coat',
    item1Ar: 'معطف ترنش جلد نابا',
    item2: 'Oxblood Aniline Finish',
    item2Ar: 'تشطيب جلد أنيلين فاخر'
  }
];

export const Hero: React.FC<HeroProps> = ({
  onShopCategory,
  onInspectProductById,
  language
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <section className="relative w-full bg-[#EAE8E3] overflow-hidden group">
      <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[680px] overflow-hidden">
        {SLIDES.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover object-center lg:object-[center_20%]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/55 via-neutral-900/20 to-transparent" />
          </div>
        ))}

        {/* Hero Content Overlay */}
        <div className="relative z-20 max-w-7xl mx-auto h-full px-6 sm:px-12 flex flex-col justify-between py-12 sm:py-16">
          <div />

          {/* Editorial Headline Box */}
          <div className="max-w-xl text-start">
            <span className="inline-block text-xs sm:text-sm font-sans tracking-[0.25em] text-white/90 uppercase font-medium drop-shadow-sm mb-3">
              {language === 'ar' ? slide.collectionAr : slide.collection}
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal text-white tracking-tight drop-shadow-sm leading-[1.06] mb-8 [text-wrap:balance]">
              {language === 'ar' ? slide.titleAr : slide.title}
            </h1>
            <div>
              <button
                onClick={() => onShopCategory(slide.targetCategory)}
                className="group/btn inline-flex items-center gap-3 px-8 py-3.5 bg-white text-neutral-900 text-xs sm:text-sm font-medium tracking-[0.18em] uppercase hover:bg-neutral-900 hover:text-white transition-all duration-300 shadow-md cursor-pointer whitespace-nowrap"
              >
                <span>{language === 'ar' ? slide.ctaLabelAr : slide.ctaLabel}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 rtl:rotate-180" />
              </button>
            </div>
          </div>

          {/* Bottom Row: Pagination & Clickable Garment Credits */}
          <div className="flex items-end justify-between text-white/90">
            <div className="flex items-center gap-2.5 pb-1">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 cursor-pointer rounded-full ${
                    idx === currentSlide
                      ? 'w-7 h-2 bg-white'
                      : 'w-2 h-2 bg-white/50 hover:bg-white/85'
                  }`}
                  aria-label={`View slide ${idx + 1}: ${s.title}`}
                />
              ))}
            </div>

            <button
              onClick={() => onInspectProductById(slide.featuredProductId)}
              className="text-end text-[11px] sm:text-xs tracking-wider text-white/90 hover:text-white font-sans drop-shadow-sm leading-relaxed hidden sm:block cursor-pointer group/credit"
            >
              <p className="font-medium underline-offset-4 group-hover/credit:underline">
                {language === 'ar' ? slide.item1Ar : slide.item1}
              </p>
              <p className="text-white/75">{language === 'ar' ? slide.item2Ar : slide.item2}</p>
            </button>
          </div>
        </div>

        {/* Prev/Next Carousel Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/55 text-white flex items-center justify-center opacity-75 group-hover:opacity-100 transition-opacity cursor-pointer hidden md:flex"
          aria-label="Previous campaign slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/55 text-white flex items-center justify-center opacity-75 group-hover:opacity-100 transition-opacity cursor-pointer hidden md:flex"
          aria-label="Next campaign slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
