import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AddCustomerModal: React.FC = () => {
  const { currency, addCustomer, closeModal } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [initialDebt, setInitialDebt] = useState('0');
  const [creditLimit, setCreditLimit] = useState('500');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCustomer({
      name: name.trim(),
      phone: phone.trim() || '0790000000',
      totalDebt: parseFloat(initialDebt) || 0,
      creditLimit: parseFloat(creditLimit) || 500,
      address: address.trim(),
      notes: notes.trim(),
    });

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
              إضافة زبون جديد
            </h3>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 text-right font-['Cairo']">
              اسم الزبون الكامل:
            </label>
            <input
              type="text"
              required
              placeholder="مثال: يوسف أحمد السالم"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm font-['Cairo'] text-right focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 text-right font-['Cairo']">
              رقم الهاتف المحمول:
            </label>
            <input
              type="tel"
              placeholder="079XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm font-['Cairo'] text-right focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Initial Debt & Credit Limit */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 text-right font-['Cairo']">
                سقف الدين المسموح ({currency}):
              </label>
              <input
                type="number"
                value={creditLimit}
                onChange={(e) => setCreditLimit(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm font-['Cairo'] text-right focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 text-right font-['Cairo']">
                رصيد دين سابق ({currency}):
              </label>
              <input
                type="number"
                value={initialDebt}
                onChange={(e) => setInitialDebt(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm font-['Cairo'] text-right focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 text-right font-['Cairo']">
              العنوان / المنطقة:
            </label>
            <input
              type="text"
              placeholder="مثال: عمان - الدوار السابع"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm font-['Cairo'] text-right focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 text-right font-['Cairo']">
              ملاحظات إضافية:
            </label>
            <textarea
              rows={2}
              placeholder="ملاحظات حول مواعيد السداد أو الاتفاق..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm font-['Cairo'] text-right focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 border-t border-slate-200">
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all text-xs font-['Cairo'] cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>إضافة الزبون وتثبيت حسابه</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
