import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem, Currency, Language } from '../types';
import { formatPrice } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  discountPercent: number;
  onApplyPromoCode: (code: string) => boolean;
  currency: Currency;
  language: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  discountPercent,
  onApplyPromoCode,
  currency,
  language
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(rawSubtotal * (discountPercent / 100));
  const subtotalAfterDiscount = rawSubtotal - discountAmount;
  const freeShippingThreshold = 300;
  const progressPercent = Math.min(100, Math.round((rawSubtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - rawSubtotal);
  const shippingCost = amountToFreeShipping === 0 ? 0 : 25;
  const finalTotal = subtotalAfterDiscount + shippingCost;

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = onApplyPromoCode(promoCode);
    if (valid) {
      setPromoMessage(language === 'ar' ? 'تم تطبيق خصم 10% بنجاح' : '10% Privilege discount applied');
    } else {
      setPromoMessage(language === 'ar' ? 'الرمز الترويجي غير صالح (جرب VIP)' : 'Invalid code (try VIP or AVENIR10)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-[#FAF9F6] h-full shadow-2xl flex flex-col z-10 border-s border-[#E5E2DC] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8E5DF] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-[0.2em] uppercase font-sans text-neutral-900">
              {language === 'ar' ? 'حقيبة التسوق' : 'SHOPPING BAG'}
            </h2>
            <span className="text-xs text-neutral-500 font-sans tabular-nums">
              ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black cursor-pointer transition-colors"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#F4F1EA] px-6 py-3 border-b border-[#E8E5DF] text-xs">
          {amountToFreeShipping > 0 ? (
            <p className="text-neutral-700">
              {language === 'ar'
                ? `أضف ${formatPrice(amountToFreeShipping, currency)} للحصول على شحن دولي مجاني.`
                : `Add ${formatPrice(amountToFreeShipping, currency)} more for complimentary worldwide express shipping.`}
            </p>
          ) : (
            <p className="text-neutral-900 font-medium">
              {language === 'ar'
                ? 'طلبك مؤهل للشحن الدولي السريع مجاناً.'
                : 'Your order qualifies for complimentary worldwide express shipping.'}
            </p>
          )}
          <div className="w-full bg-[#E0DCD3] h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-neutral-900 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#EBE8E1]">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="text-sm text-neutral-500 font-sans">
                {language === 'ar' ? 'حقيبة التسوق فارغة حالياً.' : 'Your shopping bag is currently empty.'}
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase tracking-widest font-medium cursor-pointer"
              >
                {language === 'ar' ? 'استكشف المجموعة' : 'Explore The Collection'}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-4 flex gap-4">
                <div className="w-20 h-24 bg-[#EBE7DF] overflow-hidden shrink-0 border border-[#E0DCD3]">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs sm:text-sm font-medium text-neutral-900">
                        {language === 'ar' ? item.product.nameAr : item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-neutral-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-neutral-500 flex items-center gap-1.5 mt-1">
                      <span>{language === 'ar' ? 'المقاس:' : 'Size:'} {item.size}</span>
                      <span>·</span>
                      <span>{item.color}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="inline-flex items-center border border-[#D9D5CC] bg-white text-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="px-2.5 py-0.5 text-neutral-600 hover:text-black cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 tabular-nums text-neutral-800 font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="px-2.5 py-0.5 text-neutral-600 hover:text-black cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-semibold text-neutral-900 tabular-nums">
                      {formatPrice(item.product.price * item.quantity, currency)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#E8E5DF] bg-white space-y-4">
            <form onSubmit={handlePromoSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder={language === 'ar' ? 'كود الخصم (جرب VIP)' : 'Privilege Code (try VIP)'}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 text-xs px-3 py-2 border border-[#D9D5CC] bg-[#FAF9F6] text-neutral-900 uppercase tracking-wider focus:outline-none focus:border-neutral-900"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs uppercase tracking-wider font-medium cursor-pointer border border-[#D9D5CC]"
              >
                {language === 'ar' ? 'تطبيق' : 'Apply'}
              </button>
            </form>
            {(promoMessage || discountPercent > 0) && (
              <p className={`text-[11px] ${discountPercent > 0 ? 'text-emerald-700' : 'text-neutral-500'}`}>
                {promoMessage || (language === 'ar' ? 'تم تطبيق خصم 10% بنجاح' : '10% Privilege discount applied')}
              </p>
            )}

            <div className="space-y-1.5 text-xs text-neutral-600 font-sans">
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                <span className="tabular-nums">{formatPrice(rawSubtotal, currency)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>{language === 'ar' ? `خصم خاص (${discountPercent}%):` : `Privilege Discount (${discountPercent}%):`}</span>
                  <span className="tabular-nums">-{formatPrice(discountAmount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'الشحن السريع:' : 'Shipping:'}</span>
                <span className="text-neutral-900 font-medium tabular-nums">
                  {shippingCost === 0
                    ? (language === 'ar' ? 'مجاني' : 'Complimentary')
                    : formatPrice(shippingCost, currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-neutral-900 pt-2 border-t border-[#E8E5DF]">
                <span>{language === 'ar' ? 'المجموع الكلي:' : 'Total Amount:'}</span>
                <span className="tabular-nums font-sans">
                  {formatPrice(finalTotal, currency)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full py-3.5 bg-neutral-900 text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>{language === 'ar' ? 'إتمام الطلب بأمان' : 'PROCEED TO CHECKOUT'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-600" />
              <span>{language === 'ar' ? 'دفع آمن ومشفر 100% · إرجاع مجاني 30 يوماً' : 'Encrypted 256-bit checkout · 30-day returns'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
