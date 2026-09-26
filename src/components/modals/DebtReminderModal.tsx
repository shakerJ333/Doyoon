import React from 'react';
import { X, Lightbulb, MessageSquare, Phone, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DebtReminderModal: React.FC = () => {
  const { customers, currency, recordCustomerPayment, closeModal } = useApp();

  // Find customers with overdue or due debts
  const overdueCustomers = customers.filter((c) => c.totalDebt > 0).slice(0, 3);

  const handleSendWhatsApp = (name: string, debt: number) => {
    const msg = `السلام عليكم ورحمة الله، الأخ ${name} المحترم، نود تذكيركم بلطف بموعد سداد الدفعة المستحقة اليوم بقيمة ${debt.toFixed(2)} ${currency} لدى متجر الأمل التجاري. دمتم بخير.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
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
              الزبائن المستحق عليهم ديون اليوم
            </h3>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-2xl text-right">
          <span className="text-xs font-bold text-blue-900 font-['Cairo'] block">
            المستحق للتحصيل اليوم: 320.00 {currency}
          </span>
          <p className="text-[11px] text-blue-700 mt-0.5">
            هناك 3 زبائن متفق معهم على سداد دفعاتهم اليوم. يمكنك إرسال تذكير فوري عبر الواتساب بنقرة واحدة.
          </p>
        </div>

        {/* List of 3 customers */}
        <div className="mt-3 space-y-2.5">
          {overdueCustomers.map((cust) => (
            <div
              key={cust.id}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between"
            >
              {/* Action buttons on left */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleSendWhatsApp(cust.name, cust.totalDebt)}
                  className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors"
                  title="إرسال تذكير واتساب"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <a
                  href={`tel:${cust.phone}`}
                  className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
                  title="اتصال هاتفي"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <button
                  onClick={() => {
                    const amt = prompt(`أدخل قيمة الدفعة المحصلة من ${cust.name}:`, cust.totalDebt.toString());
                    if (amt) {
                      const val = parseFloat(amt);
                      if (!isNaN(val) && val > 0) {
                        recordCustomerPayment(cust.id, val, 'تحصيل تذكير اليوم');
                      }
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>تحصيل</span>
                </button>
              </div>

              {/* Info on right */}
              <div className="text-right">
                <span className="text-xs md:text-sm font-bold text-slate-900 font-['Cairo'] block">
                  {cust.name}
                </span>
                <span className="text-xs font-black text-rose-600 font-['Cairo']">
                  {cust.totalDebt.toFixed(2)} {currency}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  الهاتف: {cust.phone}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <div className="mt-4 pt-2 border-t border-slate-100">
          <button
            onClick={closeModal}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs font-['Cairo'] transition-colors"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
