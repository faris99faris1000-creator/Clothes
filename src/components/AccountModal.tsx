import React, { useState } from 'react';
import { X, User, Package, MapPin, Check, Truck } from 'lucide-react';
import { Order, Language, OrderCustomer } from '../types';
import { formatPrice } from '../utils/currency';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  profile: OrderCustomer;
  onSaveProfile: (profile: OrderCustomer) => void;
  language: Language;
  initialTab?: 'orders' | 'profile';
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  orders,
  profile,
  onSaveProfile,
  language,
  initialTab = 'orders'
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>(initialTab);
  const [form, setForm] = useState<OrderCustomer>(profile);
  const [savedNotice, setSavedNotice] = useState(false);

  React.useEffect(() => {
    setForm(profile);
  }, [profile]);

  React.useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(form);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#FAF9F6] shadow-2xl z-10 border border-[#E5E2DC] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E5DF] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-neutral-900" />
            <h2 className="text-xs uppercase tracking-[0.22em] font-sans font-semibold text-neutral-900">
              {language === 'ar' ? 'حساب العميل الخاص' : 'PRIVATE CLIENT SUITE'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black cursor-pointer"
            aria-label="Close account suite"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E8E5DF] bg-[#F4F1EA] px-6 gap-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 text-xs uppercase tracking-[0.18em] font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>
              {language === 'ar' ? `طلباتي (${orders.length})` : `My Orders (${orders.length})`}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 text-xs uppercase tracking-[0.18em] font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'الملف والعنوان' : 'Profile & Address'}</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'orders' ? (
            orders.length === 0 ? (
              <div className="py-14 text-center space-y-3">
                <Package className="w-8 h-8 text-neutral-300 mx-auto" />
                <p className="text-sm text-neutral-600">
                  {language === 'ar'
                    ? 'لا توجد طلبات مسجلة حتى الآن. يمكنك إتمام الشراء من حقيبة التسوق.'
                    : 'No orders placed yet. Select pieces from the collection and complete checkout to track your shipment here.'}
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-[#E4E0D7] p-4 sm:p-5 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EFECE6]">
                    <div>
                      <span className="text-[11px] uppercase tracking-widest text-neutral-400 block">
                        {language === 'ar' ? 'مرجع الطلب' : 'ORDER REFERENCE'}
                      </span>
                      <span className="text-sm font-semibold text-neutral-900 tabular-nums">
                        #{order.orderNumber}
                      </span>
                    </div>
                    <div className="text-end">
                      <span className="text-[11px] text-neutral-500 block">{order.createdAt}</span>
                      <span className="text-xs font-medium text-emerald-800 inline-flex items-center gap-1 mt-0.5">
                        <Truck className="w-3.5 h-3.5" />
                        {language === 'ar' ? 'تم التأكيد · قيد التجهيز' : order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2.5">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-10 h-12 object-cover bg-neutral-100 border border-[#E5E2DC]"
                          />
                          <div>
                            <p className="font-medium text-neutral-900">
                              {language === 'ar' ? item.product.nameAr : item.product.name}
                            </p>
                            <p className="text-[11px] text-neutral-500">
                              {item.size} · {item.color} · x{item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-medium tabular-nums text-neutral-900">
                          {formatPrice(item.product.price * item.quantity, order.currency)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#EFECE6] flex items-center justify-between text-xs">
                    <span className="text-neutral-500">
                      {language === 'ar' ? 'الوجهة:' : 'Ship to:'} {order.customer.city}, {order.customer.country}
                    </span>
                    <span className="font-semibold text-neutral-900 tabular-nums">
                      {language === 'ar' ? 'الإجمالي:' : 'Total:'} {formatPrice(order.total, order.currency)}
                    </span>
                  </div>
                </div>
              ))
            )
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                    {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 bg-white border border-[#D9D5CC] focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 bg-white border border-[#D9D5CC] focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                    {language === 'ar' ? 'رقم الهاتف' : 'Phone'}
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 bg-white border border-[#D9D5CC] focus:outline-none focus:border-black"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                    {language === 'ar' ? 'عنوان التوصيل' : 'Street Address'}
                  </label>
                  <input
                    required
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 bg-white border border-[#D9D5CC] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-[0.2em] font-medium cursor-pointer"
                >
                  {language === 'ar' ? 'حفظ البيانات' : 'Save Client Details'}
                </button>
                {savedNotice && (
                  <span className="text-xs text-emerald-700 inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {language === 'ar' ? 'تم التحديث' : 'Profile updated'}
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
