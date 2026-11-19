import React, { useEffect, useRef } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, Globe } from 'lucide-react';
import { Language, Currency } from '../types';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  orderCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  activeCategory: string;
  onSelectCategory: (catId: string) => void;
  language: Language;
  onToggleLanguage: () => void;
  currency: Currency;
  onSelectCurrency: (currency: Currency) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  orderCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAccount,
  activeCategory,
  onSelectCategory,
  language,
  onToggleLanguage,
  currency,
  onSelectCurrency
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = React.useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'new-arrivals', label: 'NEW ARRIVALS', labelAr: 'وصل حديثاً' },
    { id: 'menswear', label: 'MENSWEAR', labelAr: 'الرجال' },
    { id: 'womenswear', label: 'WOMENSWEAR', labelAr: 'النساء' },
    { id: 'leather', label: 'LEATHER', labelAr: 'الجلود' },
    { id: 'shoes', label: 'SHOES', labelAr: 'الأحذية' },
    { id: 'accessories', label: 'ACCESSORIES', labelAr: 'الإكسسوارات' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E5E2DC] transition-all duration-200">
      {/* Top Black Minimalist Strip */}
      <div className="bg-[#1C1C1E] text-[#D1D1D6] text-[11px] tracking-wider py-1.5 px-4 sm:px-8 flex justify-between items-center uppercase font-sans">
        <div className="hidden lg:block text-[11px] text-[#A1A1A6] font-normal whitespace-nowrap">
          {language === 'ar' ? 'دار أزياء أفينير · باريس وميلانو' : 'AVENIR ATELIER · PARIS & MILAN'}
        </div>
        <div className="text-center text-[#E5E5EA] tracking-widest text-[11px] font-medium mx-auto lg:mx-0 whitespace-nowrap truncate">
          {language === 'ar'
            ? 'شحن دولي مجاني للطلبات فوق 300 دولار · الدفع عند الاستلام أو بالبطاقة'
            : 'Complimentary Worldwide Express Shipping Over $300'}
        </div>
        <div className="flex items-center gap-3 sm:gap-4 text-[#A1A1A6] shrink-0">
          {/* Currency Selector */}
          <div className="relative" ref={currencyRef}>
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 uppercase whitespace-nowrap"
              aria-label="Select Currency"
            >
              <span>{currency}</span>
            </button>
            {currencyDropdownOpen && (
              <div className="absolute end-0 mt-2 py-1 w-24 bg-[#2C2C2E] text-white text-xs rounded shadow-lg z-50 border border-neutral-700">
                {(['USD', 'EUR', 'GBP', 'SAR', 'AED'] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      onSelectCurrency(c);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-start px-3 py-1.5 hover:bg-[#3A3A3C] transition-colors cursor-pointer ${
                      currency === c ? 'text-amber-300 font-semibold' : ''
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-neutral-600 hidden sm:inline">|</span>

          {/* Language Switch */}
          <button
            onClick={onToggleLanguage}
            className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-sans whitespace-nowrap"
            title="Switch Language (English / العربية)"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="font-medium">{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          <span className="text-neutral-600 hidden sm:inline">|</span>

          {/* Quick Bag Status */}
          <button
            onClick={onOpenCart}
            className="hover:text-white transition-colors cursor-pointer hidden sm:flex items-center gap-1 whitespace-nowrap"
          >
            <span>{language === 'ar' ? 'الحقيبة:' : 'Bag:'} {cartCount}</span>
          </button>
        </div>
      </div>

      {/* Main Brand Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-800 hover:text-black focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Brand Logo - AVENIR */}
        <div className="flex items-center shrink-0">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex flex-col items-center"
          >
            <span className="font-editorial text-3xl sm:text-4xl tracking-[0.25em] text-[#121212] font-semibold select-none transition-opacity group-hover:opacity-85 whitespace-nowrap">
              AVENIR
            </span>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-[12px] tracking-[0.16em] font-medium text-neutral-700">
          {navLinks.map((link) => {
            const isActive = activeCategory === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectCategory(link.id)}
                className={`relative py-1 uppercase whitespace-nowrap shrink-0 transition-colors cursor-pointer hover:text-black ${
                  isActive ? 'text-black font-semibold' : 'text-neutral-600'
                }`}
              >
                {language === 'ar' ? link.labelAr : link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-neutral-900 transition-all duration-300" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Interactive Action Icons Zone */}
        <div className="flex items-center space-x-3 sm:space-x-5 text-neutral-800 shrink-0">
          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-1.5 hover:text-black hover:scale-105 transition-transform cursor-pointer relative"
            aria-label="Search collection"
            title={language === 'ar' ? 'بحث' : 'Search'}
          >
            <Search className="w-5 h-5 stroke-[1.6]" />
          </button>

          {/* Client Account & Order History Icon */}
          <button
            onClick={onOpenAccount}
            className="p-1.5 hover:text-black hover:scale-105 transition-transform cursor-pointer relative"
            aria-label="Client Account & Orders"
            title={language === 'ar' ? 'حسابي وطلباتي' : 'Account & Orders'}
          >
            <User className="w-5 h-5 stroke-[1.6]" />
            {orderCount > 0 && (
              <span className="absolute -top-1 -end-1 w-4 h-4 bg-emerald-700 text-white text-[10px] flex items-center justify-center rounded-full font-sans font-medium tabular-nums">
                {orderCount}
              </span>
            )}
          </button>

          {/* Wishlist Icon with count badge */}
          <button
            onClick={onOpenWishlist}
            className="p-1.5 hover:text-black hover:scale-105 transition-transform cursor-pointer relative"
            aria-label="Wishlist"
            title={language === 'ar' ? 'المفضلة' : 'Wishlist'}
          >
            <Heart className="w-5 h-5 stroke-[1.6]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -end-1 w-4 h-4 bg-neutral-900 text-white text-[10px] flex items-center justify-center rounded-full font-sans font-medium tabular-nums">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Icon with count badge */}
          <button
            onClick={onOpenCart}
            className="p-1.5 hover:text-black hover:scale-105 transition-transform cursor-pointer relative flex items-center"
            aria-label="Shopping Bag"
            title={language === 'ar' ? 'حقيبة التسوق' : 'Shopping Bag'}
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
            <span className="absolute -top-1 -end-1 w-4 h-4 bg-neutral-900 text-white text-[10px] flex items-center justify-center rounded-full font-sans font-medium tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-[#FAF9F6] px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-3 pb-4 border-b border-neutral-200">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onSelectCategory(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-start text-xs uppercase tracking-widest py-2.5 px-3 transition-colors cursor-pointer ${
                  activeCategory === link.id ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-200/50'
                }`}
              >
                {language === 'ar' ? link.labelAr : link.label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-600 pt-2">
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 font-medium py-1.5 px-3 border border-neutral-300 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>
            <div className="flex items-center gap-1.5">
              {(['USD', 'EUR', 'SAR'] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => onSelectCurrency(c)}
                  className={`px-2 py-1 text-xs cursor-pointer ${currency === c ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-black'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
