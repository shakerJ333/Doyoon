import React, { useState } from 'react';
import { X, Settings, Check, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsModal: React.FC = () => {
  const { currency, setCurrency, store, updateStore, closeModal } = useApp();

  const currencies = [
    { code: 'د.أ', label: 'دينار أردني (د.أ)' },
    { code: 'ر.س', label: 'ريال سعودي (ر.س)' },
    { code: 'د.إ', label: 'درهم إماراتي (د.إ)' },
    { code: 'د.ك', label: 'دينار كويتي (د.ك)' },
    { code: 'ج.م', label: 'جنيه مصري (ج.م)' },
    { code: '$', label: 'دولار أمريكي ($)' },
  ];

  const [storeName, setStoreName] = useState(store.name);
  const [storePhone, setStorePhone] = useState(store.phone);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStore({ name: storeName, phone: storePhone });
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-3xl w-full max-w-md p-4 md:p-5 shadow-2xl animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-right">
            <h3 className="text-base font-black text-slate-900 font-['Cairo']">
              إعدادات التطبيق والعملة
            </h3>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          {/* Currency Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 text-right font-['Cairo']">
              عملة الحسابات والتسعير:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {currencies.map((c) => {
                const isSelected = currency === c.code;
                return (
                  <button
                    type="button"
                    key={c.code}
                    onClick={() => setCurrency(c.code)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold font-['Cairo'] flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Store Info */}
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 text-right font-['Cairo']">
                اسم المتجر / النشاط التجاري:
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm font-['Cairo'] text-right focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 text-right font-['Cairo']">
                رقم هاتف المتجر:
              </label>
              <input
                type="tel"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm font-['Cairo'] text-right focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs font-['Cairo'] transition-colors shadow-md cursor-pointer"
            >
              حفظ التعديلات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
