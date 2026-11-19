/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { PRODUCTS, INITIAL_CART_ITEMS } from './data/products';
import { Product, CartItem, Language, Currency, Order, OrderCustomer } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryNav } from './components/CategoryNav';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AccountModal } from './components/AccountModal';
import { InfoModal, InfoModalType } from './components/InfoModal';
import { EditorialStory } from './components/EditorialStory';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

const DEFAULT_CUSTOMER: OrderCustomer = {
  name: 'Alexander Vance',
  email: 'client@avenir-atelier.com',
  phone: '+1 (555) 234-8910',
  address: '450 Mercer Street, Residence 6B',
  city: 'New York',
  country: 'United States'
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  // Default language is English ('en'), with instant toggle to Arabic ('ar')
  const [language, setLanguage] = useState<Language>(() => readStorage<Language>('avenir_lang', 'en'));
  const [currency, setCurrency] = useState<Currency>(() => readStorage<Currency>('avenir_currency', 'USD'));
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    readStorage<CartItem[]>('avenir_cart', INITIAL_CART_ITEMS)
  );
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    readStorage<string[]>('avenir_wishlist', ['prod-mens-biker', 'prod-mens-chelsea-boots'])
  );
  const [orders, setOrders] = useState<Order[]>(() => readStorage<Order[]>('avenir_orders', []));
  const [customerProfile, setCustomerProfile] = useState<OrderCustomer>(() =>
    readStorage<OrderCustomer>('avenir_profile', DEFAULT_CUSTOMER)
  );

  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [accountInitialTab, setAccountInitialTab] = useState<'orders' | 'profile'>('orders');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<InfoModalType>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(t);
  }, [toastMessage]);

  // Sync HTML lang/dir attributes & persist user preferences
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('avenir_lang', JSON.stringify(language));
  }, [language]);

  useEffect(() => {
    localStorage.setItem('avenir_currency', JSON.stringify(currency));
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('avenir_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('avenir_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem('avenir_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('avenir_profile', JSON.stringify(customerProfile));
  }, [customerProfile]);

  // Global Escape key handler for overlays
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null);
        setIsCartOpen(false);
        setIsWishlistOpen(false);
        setIsSearchOpen(false);
        setIsAccountOpen(false);
        setIsCheckoutOpen(false);
        setInfoModalType(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleAddToCart = (
    product: Product,
    size?: string,
    color?: string,
    quantity: number = 1
  ) => {
    const chosenSize = size || product.sizes[0] || 'One Size';
    const chosenColor = color || product.colors[0]?.name || 'Standard';

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.size === chosenSize &&
          item.color === chosenColor
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      }

      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          productId: product.id,
          product,
          size: chosenSize,
          color: chosenColor,
          quantity
        }
      ];
    });

    setIsCartOpen(true);
    showToast(
      language === 'ar'
        ? `تمت إضافة "${product.nameAr}" إلى الحقيبة`
        : `Added "${product.name}" to your bag`
    );
  };

  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (cartId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartId));
  };

  const handleToggleWishlist = (product: Product) => {
    const exists = wishlistIds.includes(product.id);
    setWishlistIds((prev) =>
      exists ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    );
    showToast(
      exists
        ? language === 'ar'
          ? `تمت إزالة "${product.nameAr}" من المفضلة`
          : `Removed "${product.name}" from wishlist`
        : language === 'ar'
        ? `تم حفظ "${product.nameAr}" في المفضلة`
        : `Saved "${product.name}" to wishlist`
    );
  };

  const handleMoveToBag = (product: Product) => {
    handleAddToCart(product);
    setWishlistIds((prev) => prev.filter((id) => id !== product.id));
  };

  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId);
    const element = document.getElementById('collection-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'AVENIR10' || clean === 'ELEGANCE10' || clean === 'VIP') {
      setDiscountPercent(10);
      showToast(language === 'ar' ? 'تم تفعيل خصم 10%' : '10% Privilege discount applied');
      return true;
    }
    return false;
  };

  const handlePlaceOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCustomerProfile(order.customer);
    setCartItems([]);
    setDiscountPercent(0);
    showToast(
      language === 'ar'
        ? `تم تأكيد الطلب #${order.orderNumber}`
        : `Order #${order.orderNumber} confirmed`
    );
  };

  const handleInspectProductById = (productId: string) => {
    const found = PRODUCTS.find((p) => p.id === productId);
    if (found) setSelectedProduct(found);
  };

  const handleToggleLanguage = () => {
    const next = language === 'en' ? 'ar' : 'en';
    setLanguage(next);
    showToast(next === 'ar' ? 'تم التحويل إلى اللغة العربية' : 'Switched to English');
  };

  return (
    <div
      id="top"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1A1A1A] antialiased selection:bg-neutral-900 selection:text-white"
    >
      {/* Header */}
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        orderCount={orders.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => {
          setAccountInitialTab('orders');
          setIsAccountOpen(true);
        }}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        currency={currency}
        onSelectCurrency={(c) => {
          setCurrency(c);
          showToast(language === 'ar' ? `تم تغيير العملة إلى ${c}` : `Currency updated to ${c}`);
        }}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onShopCategory={handleSelectCategory}
          onInspectProductById={handleInspectProductById}
          language={language}
        />

        {/* 6 Category Tiles Showcase */}
        <CategoryNav
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          language={language}
        />

        {/* Product Grid with Menswear, Leather Varieties, Footwear & Filters */}
        <ProductGrid
          products={PRODUCTS}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          currency={currency}
          language={language}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={(p) => setSelectedProduct(p)}
          onAddToCart={(p, size, color) => handleAddToCart(p, size, color)}
        />

        {/* Editorial Craftsmanship Story */}
        <EditorialStory
          language={language}
          onExploreLeather={() => handleSelectCategory('leather')}
          onExploreMenswear={() => handleSelectCategory('menswear')}
        />
      </main>

      {/* Luxury Footer */}
      <Footer
        language={language}
        currency={currency}
        onSelectCurrency={setCurrency}
        onSelectCategory={handleSelectCategory}
        onOpenInfoModal={(type) => setInfoModalType(type)}
        onOpenAccount={() => {
          setAccountInitialTab('orders');
          setIsAccountOpen(true);
        }}
        onNotify={showToast}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenSizeGuide={() => setInfoModalType('size-guide')}
        currency={currency}
        language={language}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={(p, size, color, qty) => handleAddToCart(p, size, color, qty)}
      />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => setIsCheckoutOpen(true)}
        discountPercent={discountPercent}
        onApplyPromoCode={handleApplyPromoCode}
        currency={currency}
        language={language}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={PRODUCTS}
        wishlistIds={wishlistIds}
        onRemoveFromWishlist={(id) => setWishlistIds((prev) => prev.filter((i) => i !== id))}
        onMoveToBag={handleMoveToBag}
        currency={currency}
        language={language}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={PRODUCTS}
        onSelectProduct={(p) => setSelectedProduct(p)}
        currency={currency}
        language={language}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        discountPercent={discountPercent}
        defaultCustomer={customerProfile}
        onPlaceOrder={handlePlaceOrder}
        onViewOrders={() => {
          setAccountInitialTab('orders');
          setIsAccountOpen(true);
        }}
        currency={currency}
        language={language}
      />

      {/* Private Client Account & Order History Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        orders={orders}
        profile={customerProfile}
        onSaveProfile={(p) => {
          setCustomerProfile(p);
          showToast(language === 'ar' ? 'تم حفظ بيانات العميل' : 'Client profile saved');
        }}
        language={language}
        initialTab={accountInitialTab}
      />

      {/* Atelier Info & Services Modal */}
      <InfoModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
        language={language}
        onBookSuccess={showToast}
      />

      {/* Subtle Editorial Toast Feedback */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
        isRtl={language === 'ar'}
      />
    </div>
  );
}
