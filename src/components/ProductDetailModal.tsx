import React, { useState, useEffect } from 'react';
import { X, Heart, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Product, Currency, Language } from '../types';
import { formatPrice } from '../utils/currency';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenSizeGuide: () => void;
  currency: Currency;
  language: Language;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenSizeGuide,
  currency,
  language,
  isWishlisted,
  onToggleWishlist,
  onAddToCart
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Standard');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // Sync state whenever a new product is opened
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'One Size');
      setSelectedColor(product.colors[0]?.name || 'Standard');
      setSelectedImage(product.image);
      setQuantity(1);
      setAddedSuccess(false);
    }
  }, [product]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 1800);
  };

  const activeColorObj = product.colors.find((c) => c.name === selectedColor);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-[#FAF9F6] shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col md:flex-row border border-[#E5E2DC]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 z-20 p-2 text-neutral-600 hover:text-black bg-white/85 rounded-full cursor-pointer transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery */}
        <div className="w-full md:w-1/2 bg-[#ECE9E2] relative flex flex-col justify-between overflow-hidden">
          <div className="aspect-[3/4] md:h-full w-full relative">
            <img
              src={selectedImage || product.image}
              alt={language === 'ar' ? product.nameAr : product.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>

          {product.secondaryImage && (
            <div className="absolute bottom-4 start-4 flex gap-2 z-10 bg-white/75 backdrop-blur-xs p-1 rounded">
              <button
                type="button"
                onClick={() => setSelectedImage(product.image)}
                className={`w-12 h-14 overflow-hidden border cursor-pointer ${
                  selectedImage === product.image
                    ? 'border-neutral-900 ring-1 ring-neutral-900'
                    : 'border-neutral-300 opacity-75'
                }`}
              >
                <img src={product.image} alt="Primary view" className="w-full h-full object-cover" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedImage(product.secondaryImage!)}
                className={`w-12 h-14 overflow-hidden border cursor-pointer ${
                  selectedImage === product.secondaryImage
                    ? 'border-neutral-900 ring-1 ring-neutral-900'
                    : 'border-neutral-300 opacity-75'
                }`}
              >
                <img src={product.secondaryImage} alt="Editorial view" className="w-full h-full object-cover" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Product Purchase Details */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[500px] md:max-h-[88vh]">
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between gap-2 pe-8">
                <span className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 font-sans">
                  {language === 'ar' ? product.categoryLabelAr : product.categoryLabel}
                </span>
                {product.tag && (
                  <span className="text-[11px] uppercase tracking-widest text-neutral-700 bg-neutral-200/60 px-2 py-0.5 whitespace-nowrap">
                    {language === 'ar' ? product.tagAr : product.tag}
                  </span>
                )}
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-neutral-900 mt-1.5">
                {language === 'ar' ? product.nameAr : product.name}
              </h2>
              <div className="flex items-baseline gap-3 mt-2 font-sans">
                <span className="text-xl font-semibold text-neutral-900 tabular-nums">
                  {formatPrice(product.price, currency)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-neutral-400 line-through tabular-nums">
                    {formatPrice(product.originalPrice, currency)}
                  </span>
                )}
                <span className="text-xs text-neutral-500 ms-auto font-normal">
                  {language === 'ar' ? 'شامل الضرائب' : 'Duties & taxes included'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
              {language === 'ar' ? product.descriptionAr : product.description}
            </p>

            {/* Material & Leather Hide Specifications */}
            <div className="text-xs py-3 px-3.5 bg-[#F3F0EA] border border-[#E4E0D7] text-neutral-700 space-y-1">
              <span className="font-medium text-neutral-900 block">
                {language === 'ar' ? 'الخامة والحرفية:' : 'Material & Craftsmanship:'}
              </span>
              <span>{language === 'ar' ? product.materialAr : product.material}</span>
              {product.leatherType && (
                <div className="text-[11px] text-neutral-600 pt-1 border-t border-[#E4E0D7] mt-1">
                  <span className="font-medium text-neutral-800">
                    {language === 'ar' ? 'نوع الجلد: ' : 'Leather Finish: '}
                  </span>
                  <span>{language === 'ar' ? product.leatherTypeAr : product.leatherType}</span>
                </div>
              )}
            </div>

            {/* Color Swatches */}
            {product.colors.length > 0 && (
              <div>
                <div className="flex justify-between items-center text-xs font-sans mb-2">
                  <span className="text-neutral-500 uppercase tracking-wider">
                    {language === 'ar' ? 'اللون:' : 'Color:'}
                  </span>
                  <span className="font-medium text-neutral-900">
                    {language === 'ar' ? activeColorObj?.nameAr || selectedColor : selectedColor}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-7 h-7 rounded-full border cursor-pointer transition-all ${
                        selectedColor === c.name
                          ? 'ring-2 ring-neutral-900 ring-offset-2'
                          : 'border-neutral-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={language === 'ar' ? c.nameAr : c.name}
                      aria-label={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center text-xs font-sans mb-2">
                <span className="text-neutral-500 uppercase tracking-wider">
                  {language === 'ar' ? 'المقاس:' : 'Select Size:'}
                </span>
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="text-neutral-600 hover:text-black underline text-[11px] cursor-pointer"
                >
                  {language === 'ar' ? 'دليل المقاسات' : 'Size Guide'}
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-xs font-medium tracking-wider uppercase border transition-colors cursor-pointer ${
                      selectedSize === size
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-[#D9D5CC] bg-white text-neutral-800 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs uppercase tracking-wider text-neutral-500 font-sans">
                {language === 'ar' ? 'الكمية:' : 'Quantity:'}
              </span>
              <div className="inline-flex items-center border border-[#D9D5CC] bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-sm text-neutral-600 hover:text-black cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-medium tabular-nums min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="px-3 py-1 text-sm text-neutral-600 hover:text-black cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Button & Trust Markers */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAdd}
                className={`flex-1 py-3.5 text-xs font-medium uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                  addedSuccess
                    ? 'bg-neutral-800 text-white'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'ar' ? 'تمت الإضافة للحقيبة' : 'Added to Shopping Bag'}</span>
                  </>
                ) : (
                  <span>{language === 'ar' ? 'إضافة إلى حقيبة التسوق' : 'Add to Shopping Bag'}</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => onToggleWishlist(product)}
                className="p-3.5 border border-[#D9D5CC] bg-white text-neutral-800 hover:border-black transition-colors cursor-pointer"
                aria-label="Save to Wishlist"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'fill-neutral-900 text-neutral-900' : 'text-neutral-600'
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E8E5DF] text-[10px] text-neutral-500 font-sans">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                <span>{language === 'ar' ? 'توصيل مجاني' : 'Express Delivery'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                <span>{language === 'ar' ? 'إرجاع 30 يوم' : '30-Day Returns'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                <span>{language === 'ar' ? 'أصلي 100%' : 'Authentic Craft'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
