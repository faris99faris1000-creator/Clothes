import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Language, Currency } from '../types';
import { InfoModalType } from './InfoModal';

interface FooterProps {
  language: Language;
  currency: Currency;
  onSelectCurrency: (currency: Currency) => void;
  onSelectCategory: (catId: string) => void;
  onOpenInfoModal: (type: InfoModalType) => void;
  onOpenAccount: () => void;
  onNotify: (msg: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  currency,
  onSelectCurrency,
  onSelectCategory,
  onOpenInfoModal,
  onOpenAccount,
  onNotify
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      onNotify(
        language === 'ar'
          ? 'تم اشتراكك في النشرة الخاصة لدار أفينير'
          : 'Subscribed to AVENIR Atelier Dispatch'
      );
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  const boutiques = [
    'Paris — 14 Rue du Faubourg Saint-Honoré',
    'London — 32 New Bond Street',
    'New York — 780 Madison Avenue',
    'Dubai — Fashion Avenue, The Dubai Mall',
    'Milan — Via Montenapoleone 9'
  ];

  return (
    <footer className="w-full bg-[#18181A] text-[#D1D1D6] pt-16 pb-12 font-sans border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-14 border-b border-neutral-800">
          <div>
            <span className="font-editorial text-3xl sm:text-4xl tracking-[0.25em] text-white block mb-3 font-semibold">
              AVENIR
            </span>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md leading-relaxed font-light">
              {language === 'ar'
                ? 'دار أزياء فاخرة للرجال والنساء، متخصصة في الجلود الطبيعية بكل أنواعها، الخياطة الإيطالية، والأحذية الحرفية.'
                : 'Architectural silhouettes for men and women, heirloom Italian leather craftsmanship, and timeless footwear tailored for international wardrobes.'}
            </p>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-neutral-300 font-medium block">
              {language === 'ar' ? 'النشرة البريدية الحصرية' : 'ATELIER DISPATCH'}
            </span>
            <p className="text-xs text-neutral-400">
              {language === 'ar'
                ? 'اشترك لتصلك دعوات العروض الخاصة والوصول المبكر لتشكيلات الرجال والجلود.'
                : 'Subscribe for private salon invitations, menswear drops, and archival leather releases.'}
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <input
                type="email"
                required
                placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-[#242426] border border-neutral-700 text-white text-xs px-3.5 py-3 placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                disabled={subscribed}
                className="px-5 py-3 bg-white text-black hover:bg-neutral-200 text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'ar' ? 'تم الاشتراك' : 'Joined'}</span>
                  </>
                ) : (
                  <>
                    <span>{language === 'ar' ? 'اشتراك' : 'Join'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Links Columns (all wired to real interactive modals/filters) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-neutral-800 text-xs">
          {/* Column 1: Flagships */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.22em] text-white font-medium">
              {language === 'ar' ? 'بوتيكاتنا' : 'FLAGSHIPS'}
            </h4>
            <ul className="space-y-2 text-neutral-400">
              {boutiques.map((b) => (
                <li key={b}>
                  <button
                    type="button"
                    onClick={() => onOpenInfoModal('appointment')}
                    className="text-start hover:text-white transition-colors cursor-pointer"
                  >
                    {b}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Client Care */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.22em] text-white font-medium">
              {language === 'ar' ? 'خدمة العملاء' : 'CLIENT CARE'}
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('appointment')}
                  className="hover:text-white transition-colors cursor-pointer text-start"
                >
                  {language === 'ar' ? 'حجز موعد قياس خاص' : 'Private Atelier Appointment'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAccount}
                  className="hover:text-white transition-colors cursor-pointer text-start"
                >
                  {language === 'ar' ? 'تتبع طلباتي وسجل الشراء' : 'Track Orders & Account'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('shipping')}
                  className="hover:text-white transition-colors cursor-pointer text-start"
                >
                  {language === 'ar' ? 'الشحن والإرجاع المجاني' : 'Global Shipping & Returns'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('care-guide')}
                  className="hover:text-white transition-colors cursor-pointer text-start"
                >
                  {language === 'ar' ? 'دليل العناية بالجلود والكشمير' : 'Leather & Cashmere Care'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('size-guide')}
                  className="hover:text-white transition-colors cursor-pointer text-start"
                >
                  {language === 'ar' ? 'دليل المقاسات العالمي' : 'Atelier Size Guide'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Collections */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.22em] text-white font-medium">
              {language === 'ar' ? 'الأقسام' : 'COLLECTIONS'}
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('menswear')}
                  className="hover:text-white transition-colors cursor-pointer text-start"
                >
                  {language === 'ar' ? 'ملابس الرجال' : 'Menswear Atelier'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('womenswear')}
                  className="hover:text-white transition-colors cursor-pointer text-start"
                >
                  {language === 'ar' ? 'ملابس النساء' : 'Womenswear Atelier'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('leather')}
                  className="hover:text-white transition-colors cursor-pointer text-start"
                >
                  {language === 'ar' ? 'الجلود بكل أنواعها' : 'Leather Outerwear'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('shoes')}
                  className="hover:text-white transition-colors cursor-pointer text-start"
                >
                  {language === 'ar' ? 'الأحذية الفاخرة' : 'Artisanal Shoes'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Preferences & Region */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.22em] text-white font-medium">
              {language === 'ar' ? 'العملة والمنطقة' : 'CURRENCY & REGION'}
            </h4>
            <p className="text-neutral-400 text-xs">
              {language === 'ar'
                ? 'اختر العملة المفضلة لعرض الأسعار شاملة الضرائب.'
                : 'Select your local currency for landed duty-paid pricing.'}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {(['USD', 'EUR', 'GBP', 'SAR', 'AED'] as Currency[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onSelectCurrency(c)}
                  className={`px-2.5 py-1 text-[11px] border cursor-pointer transition-colors ${
                    currency === c
                      ? 'border-white bg-white text-black font-semibold'
                      : 'border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} AVENIR Haute Couture S.A. All rights reserved.</p>
          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => onOpenInfoModal('shipping')}
              className="hover:text-neutral-300 cursor-pointer"
            >
              {language === 'ar' ? 'سياسة الشحن' : 'Shipping Policy'}
            </button>
            <button
              type="button"
              onClick={() => onOpenInfoModal('care-guide')}
              className="hover:text-neutral-300 cursor-pointer"
            >
              {language === 'ar' ? 'ضمان الجودة' : 'Craft Guarantee'}
            </button>
            <button
              type="button"
              onClick={() => onOpenInfoModal('appointment')}
              className="hover:text-neutral-300 cursor-pointer"
            >
              {language === 'ar' ? 'تواصل معنا' : 'Concierge'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
