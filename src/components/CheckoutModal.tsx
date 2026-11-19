import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck, CreditCard, Banknote, Package } from 'lucide-react';
import { CartItem, Currency, Language, Order, OrderCustomer } from '../types';
import { formatPrice } from '../utils/currency';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discountPercent: number;
  defaultCustomer: OrderCustomer;
  onPlaceOrder: (order: Order) => void;
  onViewOrders: () => void;
  currency: Currency;
  language: Language;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discountPercent,
  defaultCustomer,
  onPlaceOrder,
  onViewOrders,
  currency,
  language
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState<OrderCustomer>(defaultCustomer);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [cardLast4, setCardLast4] = useState('4242');
  const [cardExpiry, setCardExpiry] = useState('09/29');
  const [cardCvc, setCardCvc] = useState('842');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(defaultCustomer);
    }
  }, [isOpen, defaultCustomer]);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(rawSubtotal * (discountPercent / 100));
  const shippingCost = rawSubtotal >= 300 ? 0 : 25;
  const total = rawSubtotal - discountAmount + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNumber = `AVN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      items: items.map((i) => ({ ...i })),
      subtotal: rawSubtotal,
      discountAmount,
      shippingCost,
      total,
      currency,
      paymentMethod,
      status: 'Confirmed',
      customer: { ...formData }
    };

    onPlaceOrder(newOrder);
    setConfirmedOrder(newOrder);
    setStep('success');
  };

  const handleCloseAfterOrder = () => {
    setStep('form');
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={handleCloseAfterOrder} />

      <div className="relative w-full max-w-2xl bg-[#FAF9F6] shadow-2xl z-10 border border-[#E5E2DC] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E5DF] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-neutral-900" />
            <h2 className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-neutral-900">
              {step === 'form'
                ? language === 'ar'
                  ? 'إتمام عملية الشراء الآمنة'
                  : 'SECURE ATELIER CHECKOUT'
                : language === 'ar'
                ? 'تم تأكيد طلبك بنجاح'
                : 'ORDER CONFIRMED'}
            </h2>
          </div>
          <button
            onClick={handleCloseAfterOrder}
            className="p-1.5 text-neutral-400 hover:text-black cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* Order Summary */}
            <div className="bg-[#F4F1EA] p-4 border border-[#E4E0D7] space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-800 flex justify-between">
                <span>{language === 'ar' ? 'ملخص الطلب' : 'ORDER SUMMARY'}</span>
                <span className="tabular-nums">{formatPrice(total, currency)}</span>
              </div>
              <div className="text-xs text-neutral-600 space-y-1">
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between">
                    <span>
                      {language === 'ar' ? i.product.nameAr : i.product.name} ({i.size}) × {i.quantity}
                    </span>
                    <span className="tabular-nums">{formatPrice(i.product.price * i.quantity, currency)}</span>
                  </div>
                ))}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>{language === 'ar' ? 'خصم خاص' : 'Privilege Discount'}</span>
                    <span className="tabular-nums">-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-500">
                  <span>{language === 'ar' ? 'الشحن الدولي' : 'Express Shipping'}</span>
                  <span>{shippingCost === 0 ? (language === 'ar' ? 'مجاني' : 'Complimentary') : formatPrice(shippingCost, currency)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                {language === 'ar' ? '1. بيانات العميل والتوصيل' : '1. Client & Delivery Details'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                    {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 bg-white border border-[#D9D5CC] focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 bg-white border border-[#D9D5CC] focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                    {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 bg-white border border-[#D9D5CC] focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                    {language === 'ar' ? 'المدينة' : 'City'}
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 bg-white border border-[#D9D5CC] focus:outline-none focus:border-black"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                    {language === 'ar' ? 'عنوان التوصيل بالتفصيل' : 'Street Address'}
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 bg-white border border-[#D9D5CC] focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                {language === 'ar' ? '2. وسيلة الدفع' : '2. Payment Method'}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 border text-start flex items-center gap-2.5 cursor-pointer transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-neutral-900 bg-white ring-1 ring-neutral-900'
                      : 'border-[#D9D5CC] bg-white/60'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-neutral-800 shrink-0" />
                  <span className="text-xs font-medium text-neutral-900">
                    {language === 'ar' ? 'بطاقة ائتمان' : 'Credit / Debit Card'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 border text-start flex items-center gap-2.5 cursor-pointer transition-colors ${
                    paymentMethod === 'cod'
                      ? 'border-neutral-900 bg-white ring-1 ring-neutral-900'
                      : 'border-[#D9D5CC] bg-white/60'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-neutral-800 shrink-0" />
                  <span className="text-xs font-medium text-neutral-900">
                    {language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                  </span>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white border border-[#D9D5CC]">
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                      {language === 'ar' ? 'آخر 4 أرقام / رقم البطاقة' : 'Card Number'}
                    </label>
                    <input
                      required
                      type="text"
                      value={`•••• •••• •••• ${cardLast4}`}
                      onChange={(e) => setCardLast4(e.target.value.slice(-4))}
                      className="w-full text-xs px-3 py-2 bg-[#FAF9F6] border border-[#D9D5CC] tabular-nums focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                      {language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry (MM/YY)'}
                    </label>
                    <input
                      required
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-[#FAF9F6] border border-[#D9D5CC] tabular-nums focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                      CVC
                    </label>
                    <input
                      required
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-[#FAF9F6] border border-[#D9D5CC] tabular-nums focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-[0.25em] font-medium transition-colors cursor-pointer"
              >
                {language === 'ar'
                  ? `تأكيد وشراء الآن — ${formatPrice(total, currency)}`
                  : `COMPLETE PURCHASE — ${formatPrice(total, currency)}`}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 sm:p-12 text-center space-y-6 overflow-y-auto">
            <CheckCircle className="w-16 h-16 text-neutral-900 mx-auto" />
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                {language === 'ar' ? 'رقم الطلب المؤكد' : 'ORDER REFERENCE'}
              </span>
              <h3 className="font-editorial text-3xl font-normal text-neutral-900 tabular-nums">
                #{confirmedOrder?.orderNumber}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto pt-2 leading-relaxed">
                {language === 'ar'
                  ? `شكراً لك، ${formData.name}. تم تأكيد طلبك وحفظه في سجل طلباتك، وسيبدأ فريق الأتيليه بتجهيزه للشحن إلى ${formData.city}.`
                  : `Thank you, ${formData.name}. Your order has been recorded in your Private Client Suite and is being prepared with archival packaging for express dispatch to ${formData.city}.`}
              </p>
            </div>

            <div className="bg-[#F4F1EA] p-4 text-start border border-[#E5E2DC] text-xs text-neutral-700 space-y-1.5">
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'العميل:' : 'Client:'}</span>
                <span className="font-medium text-neutral-900">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'العنوان:' : 'Destination:'}</span>
                <span className="font-medium text-neutral-900">{formData.address}, {formData.city}</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'طريقة الدفع:' : 'Payment:'}</span>
                <span className="font-medium text-neutral-900">
                  {paymentMethod === 'cod'
                    ? language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'
                    : language === 'ar' ? 'بطاقة ائتمان' : 'Card Payment'}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#E0DCD3]">
                <span>{language === 'ar' ? 'المبلغ الإجمالي:' : 'Total Billed:'}</span>
                <span className="font-semibold text-neutral-900 tabular-nums">
                  {formatPrice(confirmedOrder?.total ?? total, currency)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  handleCloseAfterOrder();
                  onViewOrders();
                }}
                className="w-full sm:w-auto px-7 py-3 border border-neutral-900 text-neutral-900 hover:bg-neutral-100 text-xs uppercase tracking-[0.2em] font-medium cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Package className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تتبع طلبي' : 'Track My Order'}</span>
              </button>
              <button
                type="button"
                onClick={handleCloseAfterOrder}
                className="w-full sm:w-auto px-8 py-3 bg-neutral-900 text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-800 cursor-pointer"
              >
                {language === 'ar' ? 'مواصلة التسوق' : 'Continue Shopping'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
