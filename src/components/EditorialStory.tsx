import React from 'react';
import { ArrowRight, Compass, Layers, Feather } from 'lucide-react';
import { Language } from '../types';

interface EditorialStoryProps {
  language: Language;
  onExploreLeather: () => void;
  onExploreMenswear: () => void;
}

export const EditorialStory: React.FC<EditorialStoryProps> = ({
  language,
  onExploreLeather,
  onExploreMenswear
}) => {
  return (
    <section id="atelier-story" className="w-full bg-[#F5F2EB] py-16 sm:py-24 border-t border-[#E5E2DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Editorial Image Composition */}
          <div className="relative">
            <div className="aspect-[4/5] bg-[#E3DFD5] overflow-hidden shadow-lg border border-[#D5D0C5]">
              <img
                src="/src/assets/images/shearling_aviator_leather_1795127351394.jpg"
                alt="AVENIR Leather & Menswear Craftsmanship"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="absolute -bottom-6 -end-4 sm:-bottom-8 sm:-end-8 w-52 sm:w-64 bg-[#FAF9F6] p-4 sm:p-5 shadow-xl border border-[#DDD8CF] hidden sm:block">
              <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-sans block mb-1">
                {language === 'ar' ? 'دار الجلود' : 'Leather & Tailoring'}
              </span>
              <p className="font-editorial text-lg text-neutral-900 leading-snug">
                {language === 'ar'
                  ? 'جلد العجل، الشامواه، النابا والشيرلنغ المصنوع يدوياً'
                  : 'Full-grain calfskin, Tuscan suede, plongé lambskin & shearling.'}
              </p>
              <div className="mt-3 pt-3 border-t border-[#EAE6DE] flex justify-between items-center text-[10px] text-neutral-500 uppercase tracking-wider">
                <span>Atelier 2024</span>
                <span>Paris / Milan</span>
              </div>
            </div>
          </div>

          {/* Narrative Text */}
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-sans font-medium">
                {language === 'ar' ? 'فلسفة الدار' : 'THE ATELIER PHILOSOPHY'}
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-neutral-900 leading-[1.15] [text-wrap:balance]">
                {language === 'ar'
                  ? 'جلود طبيعية وأزياء رجالية ونسائية صُممت لتدوم.'
                  : 'Architectural tailoring & heirloom leather craft.'}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans font-light">
              {language === 'ar'
                ? 'تجمع دار أفينير بين الخياطة الرجالية والنسائية المتقنة وبين فنون دباغة الجلود الإيطالية الفاخرة. من معاطف الصوف البكر وجلود النابا والشامواه إلى الأحذية المصنوعة يدوياً في توسكانا.'
                : 'Founded on purposeful restraint, AVENIR crafts modular wardrobes for men and women from unblended natural fibers and vegetable-tanned hides: drum-dyed calfskin, split Tuscan suede, French lambskin, and double-faced Biella wool.'}
            </p>

            {/* 3 Craftsmanship Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#E5E2DC]">
              <div className="space-y-1.5">
                <Layers className="w-4 h-4 text-neutral-700" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                  {language === 'ar' ? 'جلود طبيعية كاملة' : 'All Leather Hides'}
                </h4>
                <p className="text-[11px] text-neutral-500 leading-normal">
                  {language === 'ar'
                    ? 'عجل طبيعي، شامواه، نابا، حمل وشيرلنغ.'
                    : 'Full-grain calfskin, suede, nappa, lambskin & nubuck.'}
                </p>
              </div>

              <div className="space-y-1.5">
                <Compass className="w-4 h-4 text-neutral-700" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                  {language === 'ar' ? 'خياطة إيطالية' : 'Tuscan Footwear'}
                </h4>
                <p className="text-[11px] text-neutral-500 leading-normal">
                  {language === 'ar'
                    ? 'أحذية تشيلسي وديربي مخيطة يدوياً.'
                    : 'Goodyear-welted derbies, boots & suede loafers.'}
                </p>
              </div>

              <div className="space-y-1.5">
                <Feather className="w-4 h-4 text-neutral-700" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                  {language === 'ar' ? 'ألياف نقية 100%' : 'Pure Natural Fibers'}
                </h4>
                <p className="text-[11px] text-neutral-500 leading-normal">
                  {language === 'ar'
                    ? 'كشمير منغولي وحرير التوت وصوف بكر.'
                    : 'Mongolian cashmere, Como silk & Biella virgin wool.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <button
                onClick={onExploreLeather}
                className="group inline-flex items-center gap-3 px-6 py-3 bg-neutral-900 text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <span>{language === 'ar' ? 'تصفح الملابس الجلدية' : 'EXPLORE LEATHER ATELIER'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
              </button>
              <button
                onClick={onExploreMenswear}
                className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer"
              >
                <span>{language === 'ar' ? 'مجموعة الرجال' : 'SHOP MENSWEAR'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
