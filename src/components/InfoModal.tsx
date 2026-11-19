import React, { useState } from 'react';
import { X, MapPin, Calendar, ShieldCheck, Check } from 'lucide-react';
import { Language } from '../types';

export type InfoModalType = 'appointment' | 'size-guide' | 'care-guide' | 'shipping' | null;

interface InfoModalProps {
  type: InfoModalType;
  onClose: () => void;
  language: Language;
  onBookSuccess?: (msg: string) => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  type,
  onClose,
  language,
  onBookSuccess
}) => {
  const [selectedBoutique, setSelectedBoutique] = useState('Paris — 14 Rue du Faubourg Saint-Honoré');
  const [date, setDate] = useState('2026-11-28');
  const [guestName, setGuestName] = useState('');
  const [booked, setBooked] = useState(false);

  if (!type) return null;

  const boutiques = [
    'Paris — 14 Rue du Faubourg Saint-Honoré',
    'London — 32 New Bond Street',
    'New York — 780 Madison Avenue',
    'Dubai — Fashion Avenue, The Dubai Mall',
    'Milan — Via Montenapoleone 9'
  ];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
    onBookSuccess?.(
      language === 'ar'
        ? `تم حجز موعدك الخاص في ${selectedBoutique}`
        : `Private appointment reserved at ${selectedBoutique}`
    );
    setTimeout(() => {
      setBooked(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-[#FAF9F6] shadow-2xl z-10 border border-[#E5E2DC] overflow-hidden max-h-[88vh] flex flex-col">
        <div className="px-6 py-4 border-b border-[#E8E5DF] flex items-center justify-between bg-white">
          <h2 className="text-xs uppercase tracking-[0.22em] font-sans font-semibold text-neutral-900">
            {type === 'appointment' && (language === 'ar' ? 'حجز موعد في الأتيليه الخاص' : 'PRIVATE ATELIER APPOINTMENT')}
            {type === 'size-guide' && (language === 'ar' ? 'دليل المقاسات العالمي' : 'ATELIER SIZE & FIT GUIDE')}
            {type === 'care-guide' && (language === 'ar' ? 'دليل العناية بالجلود والأقمشة' : 'LEATHER & FABRIC CARE GUIDE')}
            {type === 'shipping' && (language === 'ar' ? 'الشحن الدولي والإرجاع' : 'GLOBAL SHIPPING & RETURNS')}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-xs sm:text-sm text-neutral-700 space-y-5 font-sans">
          {type === 'appointment' && (
            <form onSubmit={handleBook} className="space-y-4">
              <p className="text-neutral-600 leading-relaxed">
                {language === 'ar'
                  ? 'استمتع بتجربة تسوق فردية مع مستشار الأزياء الخاص لقياس المعاطف والبدلات والجلود الفاخرة.'
                  : 'Experience one-on-one styling and made-to-measure leather or suiting fittings with an AVENIR master tailor.'}
              </p>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 inline me-1" />
                  {language === 'ar' ? 'اختر البوتيك' : 'Select Flagship Boutique'}
                </label>
                <select
                  value={selectedBoutique}
                  onChange={(e) => setSelectedBoutique(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#D9D5CC] text-xs focus:outline-none focus:border-black"
                >
                  {boutiques.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1.5">
                    {language === 'ar' ? 'الاسم' : 'Client Name'}
                  </label>
                  <input
                    required
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                    className="w-full px-3 py-2 bg-white border border-[#D9D5CC] text-xs focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 inline me-1" />
                    {language === 'ar' ? 'التاريخ المفضل' : 'Preferred Date'}
                  </label>
                  <input
                    required
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D9D5CC] text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={booked}
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-[0.2em] font-medium cursor-pointer flex items-center justify-center gap-2"
              >
                {booked ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'ar' ? 'تم تأكيد الموعد' : 'Appointment Confirmed'}</span>
                  </>
                ) : (
                  <span>{language === 'ar' ? 'تأكيد الحجز الخاص' : 'Confirm Private Appointment'}</span>
                )}
              </button>
            </form>
          )}

          {type === 'size-guide' && (
            <div className="space-y-4">
              <p className="text-neutral-600">
                {language === 'ar'
                  ? 'تعتمد دار أفينير مقاسات الخياطة الإيطالية الدقيقة. لمعاطف الجلد والصوف الفضفاضة، ننصح باختيار مقاسك المعتاد.'
                  : 'AVENIR follows tailored Italian proportions. For oversized leather trench coats and wool outerwear, take your true size.'}
              </p>
              <div className="overflow-x-auto border border-[#E4E0D7] bg-white">
                <table className="w-full text-xs tabular-nums">
                  <thead className="bg-[#F4F1EA] text-neutral-700 uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'المقاس' : 'Size'}</th>
                      <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'رجال (IT)' : 'Men (IT)'}</th>
                      <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'نساء (IT)' : 'Women (IT)'}</th>
                      <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'الصدر (سم)' : 'Chest (cm)'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFECE6]">
                    <tr><td className="py-2 px-3 font-medium">XS</td><td className="py-2 px-3">44</td><td className="py-2 px-3">36</td><td className="py-2 px-3">84–88</td></tr>
                    <tr><td className="py-2 px-3 font-medium">S</td><td className="py-2 px-3">46</td><td className="py-2 px-3">38</td><td className="py-2 px-3">90–94</td></tr>
                    <tr><td className="py-2 px-3 font-medium">M</td><td className="py-2 px-3">48–50</td><td className="py-2 px-3">40</td><td className="py-2 px-3">96–100</td></tr>
                    <tr><td className="py-2 px-3 font-medium">L</td><td className="py-2 px-3">52</td><td className="py-2 px-3">42</td><td className="py-2 px-3">102–106</td></tr>
                    <tr><td className="py-2 px-3 font-medium">XL</td><td className="py-2 px-3">54</td><td className="py-2 px-3">44</td><td className="py-2 px-3">108–112</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {type === 'care-guide' && (
            <div className="space-y-4">
              <div className="p-4 bg-white border border-[#E4E0D7] space-y-1.5">
                <h4 className="font-semibold text-neutral-900">
                  {language === 'ar' ? 'جلد العجل والنابا والشيرلنغ' : 'Full-Grain Calfskin, Nappa & Shearling'}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {language === 'ar'
                    ? 'يُحفظ بعيداً عن الرطوبة والحرارة المباشرة على شماعة عريضة مبطنة. يُنظف لدى مختصي الجلود فقط مع ترطيب سنوي بكريم طبيعي محايد.'
                    : 'Store on wide sculpted cedar hangers away from direct sunlight. Condition once a season with neutral beeswax balm; clean exclusively by leather specialists.'}
                </p>
              </div>
              <div className="p-4 bg-white border border-[#E4E0D7] space-y-1.5">
                <h4 className="font-semibold text-neutral-900">
                  {language === 'ar' ? 'الشامواه الإيطالي والنوبوك' : 'Italian Suede & Nubuck'}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {language === 'ar'
                    ? 'استخدم فرشاة شامواه ناعمة بعد الارتداء لإزالة الغبار والحفاظ على الملمس المخملي.'
                    : 'Brush gently in one direction using a soft crepe or brass-bristle suede brush after wear to preserve the velvet nap.'}
                </p>
              </div>
              <div className="p-4 bg-white border border-[#E4E0D7] space-y-1.5">
                <h4 className="font-semibold text-neutral-900">
                  {language === 'ar' ? 'الكشمير المنغولي وحرير التوت' : 'Mongolian Cashmere & Mulberry Silk'}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {language === 'ar'
                    ? 'يُغسل يدوياً بماء فاتر أو تنظيف جاف لطيف، ويُجفف مسطحاً للحفاظ على ثبات الألياف.'
                    : 'Hand wash in cold water with pH-neutral wool wash or dry clean delicately. Always dry flat on a cotton towel.'}
                </p>
              </div>
            </div>
          )}

          {type === 'shipping' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-white border border-[#E4E0D7]">
                <ShieldCheck className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-neutral-900">
                    {language === 'ar' ? 'شحن دولي مجاني فوق 300 دولار' : 'Complimentary Global Express Over $300'}
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    {language === 'ar'
                      ? 'تُشحن جميع الطلبات في صناديق فاخرة مقاومة للرطوبة عبر DHL Express خلال 2-4 أيام عمل مع تأمين شامل.'
                      : 'All orders ship worldwide via insured DHL Express within 2–4 business days inside custom archival garment boxes.'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {language === 'ar'
                  ? 'نوفر خدمة الاستبدال والإرجاع المجاني خلال 30 يوماً مع استلام مباشر من باب المنزل.'
                  : 'Complimentary 30-day courier pickup returns and size exchanges from any international address.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
