import React from 'react';
import { X, Trash2, ShoppingBag, Heart } from 'lucide-react';
import { Product, Currency, Language } from '../types';
import { formatPrice } from '../utils/currency';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  wishlistIds: string[];
  onRemoveFromWishlist: (productId: string) => void;
  onMoveToBag: (product: Product) => void;
  currency: Currency;
  language: Language;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  products,
  wishlistIds,
  onRemoveFromWishlist,
  onMoveToBag,
  currency,
  language
}) => {
  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#FAF9F6] h-full shadow-2xl flex flex-col z-10 border-s border-[#E5E2DC] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8E5DF] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-neutral-900 fill-neutral-900" />
            <h2 className="text-sm font-semibold tracking-[0.2em] uppercase font-sans text-neutral-900">
              {language === 'ar' ? 'قائمة الرغبات' : 'YOUR WISHLIST'}
            </h2>
            <span className="text-xs text-neutral-500 font-sans">
              ({wishlistedProducts.length})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black cursor-pointer transition-colors"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#EBE8E1]">
          {wishlistedProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <Heart className="w-8 h-8 text-neutral-300 mx-auto" />
              <p className="text-sm text-neutral-500 font-sans">
                {language === 'ar' ? 'لم تقم بحفظ أي قطع في قائمة الرغبات بعد.' : 'You have not saved any pieces to your wishlist yet.'}
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase tracking-widest font-medium cursor-pointer"
              >
                {language === 'ar' ? 'تصفح المجموعة' : 'Discover Silhouettes'}
              </button>
            </div>
          ) : (
            wishlistedProducts.map((product) => (
              <div key={product.id} className="py-4 flex gap-4">
                <div className="w-20 h-24 bg-[#EBE7DF] overflow-hidden shrink-0 border border-[#E0DCD3]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs sm:text-sm font-medium text-neutral-900">
                        {language === 'ar' ? product.nameAr : product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveFromWishlist(product.id)}
                        className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5 tabular-nums">
                      {formatPrice(product.price, currency)}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        onClose();
                        onMoveToBag(product);
                      }}
                      className="w-full py-2 bg-neutral-900 text-white text-[11px] uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>{language === 'ar' ? 'نقل إلى الحقيبة' : 'Move to Bag'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
