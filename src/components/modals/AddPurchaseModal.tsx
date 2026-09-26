import React, { useState } from 'react';
import { X, Truck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AddPurchaseModal: React.FC = () => {
  const { currency, addTransaction, closeModal } = useApp();

  const [supplierName, setSupplierName] = useState<string>('شركة الأمل للتجارة العامة');
  const [amount, setAmount] = useState<string>('250.00');
  const [description, setDescription] = useState<string>('شراء كرتونة سكر أبيض ومواد تموينية');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'credit'>('transfer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    addTransaction({
      type: 'purchase',
      title: 'شراء من المورد',
      partyName: supplierName,
      amount: -val,
      isDebit: true,
      date: 'اليوم',
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      invoiceNumber: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      paymentMethod,
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
              إضافة فاتورة مشتريات جديدة
            </h3>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {/* Supplier Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 text-right font-['Cairo']">
              اسم المورد أو الشركة:
            </label>
            <input
              type="text"
              required
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm font-['Cairo'] text-right focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 text-right font-['Cairo']">
              قيمة الفاتورة ({currency}):
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm font-['Cairo'] text-right font-bold focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 text-right font-['Cairo']">
              بيان المشتريات / تفاصيل البضاعة:
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm font-['Cairo'] text-right focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 text-right font-['Cairo']">
              طريقة دفع المشتريات:
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-bold font-['Cairo']">
              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`py-2 rounded-xl border text-center transition-all ${
                  paymentMethod === 'transfer'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                تحويل بنكي
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 rounded-xl border text-center transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                نقداً
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('credit')}
                className={`py-2 rounded-xl border text-center transition-all ${
                  paymentMethod === 'credit'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                آجل للمورد
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end">
            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all text-xs font-['Cairo'] cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تسجيل فاتورة الشراء</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
