import React, { useState } from 'react';
import { Heart, Eye, Check } from 'lucide-react';
import { Product, Currency, Language } from '../types';
import { formatPrice } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  language: Language;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  language,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onAddToCart
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'One Size');
  const [imgError, setImgError] = useState(false);

  const selectedColor = product.colors[selectedColorIndex]?.name || 'Standard';

  const handleQuickAdd = (e: React.MouseEvent, sizeOverride?: string) => {
    e.stopPropagation();
    const chosenSize = sizeOverride || selectedSize;
    onAddToCart(product, chosenSize, selectedColor);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col cursor-pointer bg-transparent transition-transform duration-200 hover:-translate-y-0.5"
    >
      {/* Product Image Frame */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#EFECE6] mb-3.5">
        {!imgError ? (
          <img
            src={isHovered && product.secondaryImage ? product.secondaryImage : product.image}
            alt={language === 'ar' ? product.nameAr : product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#EFECE6] to-[#E3DFD5] text-neutral-600">
            <span className="font-editorial text-lg text-neutral-800">{product.name}</span>
            <span className="text-[11px] uppercase tracking-widest mt-1">{product.categoryLabel}</span>
          </div>
        )}

        {/* Quiet Editorial Tag */}
        {product.tag && (
          <div className="absolute top-3 start-3 z-10">
            <span className="text-[11px] tracking-widest uppercase text-neutral-800 bg-[#FAF9F6]/90 backdrop-blur-xs px-2.5 py-1 font-sans font-medium">
              {language === 'ar' ? product.tagAr : product.tag}
            </span>
          </div>
        )}

        {/* Quick View & Size Strip on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-1.5">
            {product.sizes.length > 1 && (
              <div className="flex items-center gap-1 flex-wrap">
                {product.sizes.slice(0, 4).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(sz);
                      handleQuickAdd(e, sz);
                    }}
                    className={`px-2 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-neutral-900 text-white'
                        : 'bg-white/95 text-neutral-900 hover:bg-neutral-900 hover:text-white'
                    }`}
                    title={language === 'ar' ? `إضافة مقاس ${sz}` : `Quick add size ${sz}`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="ms-auto bg-white/95 text-neutral-900 text-[10px] tracking-wider uppercase px-2.5 py-1 font-medium flex items-center gap-1 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              <Eye className="w-3 h-3" />
              <span>{language === 'ar' ? 'معاينة' : 'View'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Details & Action Bar */}
      <div className="flex flex-col space-y-2 flex-1 justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-neutral-900 tracking-wide font-sans group-hover:text-neutral-700 transition-colors">
              {language === 'ar' ? product.nameAr : product.name}
            </h3>
          </div>
          <p className="text-[12px] text-neutral-500 font-sans mt-0.5">
            {language === 'ar' ? product.categoryLabelAr : product.categoryLabel}
          </p>

          {/* Interactive Color Swatches */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              {product.colors.map((c, idx) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColorIndex(idx);
                  }}
                  className={`w-3.5 h-3.5 rounded-full border cursor-pointer transition-transform ${
                    selectedColorIndex === idx
                      ? 'ring-1 ring-neutral-900 ring-offset-1 scale-110'
                      : 'border-neutral-300 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={language === 'ar' ? c.nameAr : c.name}
                  aria-label={`Select color ${c.name}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Price and Add to Bag Bar */}
        <div className="flex items-center justify-between pt-1.5 gap-2">
          <div className="flex items-baseline gap-2 font-sans">
            <span className="text-sm font-semibold text-neutral-900 tabular-nums">
              {formatPrice(product.price, currency)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through tabular-nums">
                {formatPrice(product.originalPrice, currency)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={(e) => handleQuickAdd(e)}
              disabled={addedAnimation}
              className={`px-3.5 py-1.5 text-[11px] font-medium tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                addedAnimation
                  ? 'bg-neutral-800 text-white'
                  : 'bg-neutral-900 text-white hover:bg-neutral-800 active:scale-95'
              }`}
              title="Add to Shopping Bag"
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>{language === 'ar' ? 'أضيف' : 'Added'}</span>
                </>
              ) : (
                <span>{language === 'ar' ? 'أضف للحقيبة' : 'Add to Bag'}</span>
              )}
            </button>

            <button
              type="button"
              onClick={handleHeartClick}
              className="p-1 text-neutral-600 hover:text-black hover:scale-110 transition-transform cursor-pointer"
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={`w-4 h-4 stroke-[1.8] ${
                  isWishlisted ? 'fill-neutral-900 text-neutral-900' : 'text-neutral-500 hover:text-black'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
