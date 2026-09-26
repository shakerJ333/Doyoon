import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  DollarSign,
  User,
  Phone,
  MessageSquare,
  Plus,
  Receipt,
  FileText,
  Search,
  CheckCircle2,
  Share2,
  TrendingDown,
  CreditCard,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Customer, DebtPayment } from '../../types';

export const CustomerLedgerModal: React.FC = () => {
  const {
    selectedCustomerForLedger,
    closeCustomerLedger,
    getCustomerPayments,
    recordCustomerPayment,
    addCustomerDebt,
    currency,
    store,
  } = useApp();

  const customer: Customer | null = selectedCustomerForLedger;

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [showAddDebtForm, setShowAddDebtForm] = useState(false);

  // Helper date generators
  const now = new Date();
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const todayDayName = days[now.getDay()];
  const todayFormatted = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(
    now.getDate()
  ).padStart(2, '0')}`;
  const currentTimeFormatted = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

  // Add Payment form state
  const [payAmount, setPayAmount] = useState('');
  const [payDay, setPayDay] = useState(todayDayName);
  const [payDate, setPayDate] = useState(todayFormatted);
  const [payTime, setPayTime] = useState(currentTimeFormatted);
  const [payNote, setPayNote] = useState('');
  const [receiptNumber, setReceiptNumber] = useState(
    () => `REC-${Math.floor(1000 + Math.random() * 9000)}`
  );

  // Add Debt form state
  const [debtAmount, setDebtAmount] = useState('');
  const [debtNote, setDebtNote] = useState('');

  if (!customer) return null;

  const payments: DebtPayment[] = getCustomerPayments(customer.id);

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.day.toLowerCase().includes(term) ||
      p.date.toLowerCase().includes(term) ||
      (p.receiptNumber && p.receiptNumber.toLowerCase().includes(term)) ||
      (p.notes && p.notes.toLowerCase().includes(term)) ||
      p.amount.toString().includes(term)
    );
  });

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(payAmount);
    if (isNaN(val) || val <= 0) return;

    recordCustomerPayment(customer.id, val, {
      day: payDay,
      date: payDate,
      time: payTime,
      receiptNumber,
      note: payNote || 'سداد دفعة نقدية',
    });

    setPayAmount('');
    setPayNote('');
    setReceiptNumber(`REC-${Math.floor(1000 + Math.random() * 9000)}`);
    setShowAddPaymentForm(false);
  };

  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(debtAmount);
    if (isNaN(val) || val <= 0) return;

    addCustomerDebt(customer.id, val, debtNote || 'زيادة مديونية / مشتريات');
    setDebtAmount('');
    setDebtNote('');
    setShowAddDebtForm(false);
  };

  const shareReceiptWhatsApp = (p: DebtPayment) => {
    const text = encodeURIComponent(
      `*سند قبض دفعة دين - ${store.name}*\n` +
      `-----------------------------\n` +
      `👤 الزبون: ${customer.name}\n` +
      `📅 اليوم: ${p.day}\n` +
      `📆 التاريخ: ${p.date}\n` +
      `⏰ الوقت: ${p.time}\n` +
      `💵 قيمة الدفعة: ${p.amount.toFixed(2)} ${currency}\n` +
      `🧾 رقم السند: ${p.receiptNumber || 'بدون'}\n` +
      `💳 المتبقي من الدين: ${p.remainingDebtAfter.toFixed(2)} ${currency}\n` +
      `📝 ملاحظة: ${p.notes || 'سداد نقدي'}\n` +
      `-----------------------------\n` +
      `شكراً لتعاملكم معنا!`
    );
    window.open(`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 select-none">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-4 sm:p-5 shrink-0 relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <button
              onClick={closeCustomerLedger}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-right">
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  سجل الدفعات والديون
                </span>
                <Receipt className="w-4 h-4 text-blue-200" />
              </div>
              <h2 className="text-lg sm:text-xl font-black font-['Cairo'] mt-1 text-white">
                {customer.name}
              </h2>
              <div className="flex items-center justify-end gap-3 text-xs text-blue-100 mt-1 font-sans">
                <span>{customer.phone}</span>
                {customer.address && (
                  <span className="font-['Cairo'] opacity-90 truncate max-w-[180px]">
                    📍 {customer.address}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* KPI Summary Cards inside Header */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/20 text-center font-['Cairo']">
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-2">
              <span className="text-[10px] text-blue-100 block">الدين المتبقي</span>
              <span className="text-sm sm:text-base font-black text-amber-300">
                {customer.totalDebt.toFixed(2)} {currency}
              </span>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-2">
              <span className="text-[10px] text-blue-100 block">إجمالي المسدد</span>
              <span className="text-sm sm:text-base font-black text-emerald-300">
                {totalPaid.toFixed(2)} {currency}
              </span>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-2">
              <span className="text-[10px] text-blue-100 block">سقف الائتمان</span>
              <span className="text-sm sm:text-base font-black text-white">
                {customer.creditLimit.toFixed(2)} {currency}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <a
              href={`tel:${customer.phone}`}
              className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center gap-1 text-xs font-bold font-['Cairo'] transition-colors"
              title="اتصال هاتفي"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">اتصال</span>
            </a>
            <a
              href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center gap-1 text-xs font-bold font-['Cairo'] transition-colors"
              title="مراسلة واتساب"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">واتساب</span>
            </a>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setShowAddDebtForm(false);
                setShowAddPaymentForm((prev) => !prev);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-['Cairo'] flex items-center gap-1 cursor-pointer transition-all shadow-xs ${
                showAddPaymentForm
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>تسجيل دفعة</span>
            </button>

            <button
              onClick={() => {
                setShowAddPaymentForm(false);
                setShowAddDebtForm((prev) => !prev);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-['Cairo'] flex items-center gap-1 cursor-pointer transition-all ${
                showAddDebtForm
                  ? 'bg-rose-700 text-white'
                  : 'bg-rose-100 hover:bg-rose-200 text-rose-800'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
              <span>إضافة دين</span>
            </button>
          </div>
        </div>

        {/* Collapsible New Payment Form */}
        {showAddPaymentForm && (
          <form
            onSubmit={handleAddPayment}
            className="bg-emerald-50/90 border-b border-emerald-200 p-3.5 space-y-3 shrink-0 animate-in slide-in-from-top-2 duration-150"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900 font-['Cairo'] flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-emerald-600" />
                تسجيل دفعة جديدة للزبون
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                {receiptNumber}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Payment Amount */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[11px] font-bold text-slate-700 mb-1 text-right font-['Cairo']">
                  قيمة الدفعة ({currency}):
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full bg-white border border-emerald-300 rounded-xl px-2.5 py-1.5 text-sm font-bold text-emerald-700 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              {/* Day of Week */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 text-right font-['Cairo']">
                  اليوم:
                </label>
                <select
                  value={payDay}
                  onChange={(e) => setPayDay(e.target.value)}
                  className="w-full bg-white border border-emerald-300 rounded-xl px-2 py-1.5 text-xs font-bold font-['Cairo'] text-right focus:outline-none"
                >
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 text-right font-['Cairo']">
                  التاريخ:
                </label>
                <input
                  type="text"
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                  className="w-full bg-white border border-emerald-300 rounded-xl px-2 py-1.5 text-xs text-center font-mono font-semibold focus:outline-none"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 text-right font-['Cairo']">
                  الوقت:
                </label>
                <input
                  type="text"
                  value={payTime}
                  onChange={(e) => setPayTime(e.target.value)}
                  className="w-full bg-white border border-emerald-300 rounded-xl px-2 py-1.5 text-xs text-center font-bold font-['Cairo'] focus:outline-none"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ملاحظات الدفعة (مثال: دفعة نقدية، عبر تطبيق كليك، شيك...)"
                value={payNote}
                onChange={(e) => setPayNote(e.target.value)}
                className="flex-1 bg-white border border-emerald-300 rounded-xl px-3 py-1.5 text-xs font-['Cairo'] text-right focus:outline-none"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold font-['Cairo'] shadow-sm transition-colors cursor-pointer shrink-0"
              >
                تأكيد وقبض
              </button>
            </div>
          </form>
        )}

        {/* Collapsible Add Debt Form */}
        {showAddDebtForm && (
          <form
            onSubmit={handleAddDebt}
            className="bg-rose-50 border-b border-rose-200 p-3.5 space-y-2 shrink-0 animate-in slide-in-from-top-2 duration-150"
          >
            <span className="text-xs font-black text-rose-900 font-['Cairo'] flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-rose-600" />
              إضافة دين جديد على الحساب
            </span>

            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                required
                placeholder={`المبلغ (${currency})`}
                value={debtAmount}
                onChange={(e) => setDebtAmount(e.target.value)}
                className="w-32 bg-white border border-rose-300 rounded-xl px-2.5 py-1.5 text-sm font-bold text-rose-700 text-center focus:outline-none"
              />
              <input
                type="text"
                placeholder="بيان الدين أو الفاتورة الآجلة..."
                value={debtNote}
                onChange={(e) => setDebtNote(e.target.value)}
                className="flex-1 bg-white border border-rose-300 rounded-xl px-3 py-1.5 text-xs font-['Cairo'] text-right focus:outline-none"
              />
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold font-['Cairo'] shadow-sm transition-colors cursor-pointer shrink-0"
              >
                إضافة الدين
              </button>
            </div>
          </form>
        )}

        {/* Search Bar inside Ledger */}
        <div className="px-3.5 py-2 bg-white border-b border-slate-100 flex items-center gap-2 shrink-0">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="بحث في الدفعات (باليوم، التاريخ، المبلغ، رقم السند)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-8 pl-3 py-1.5 text-xs font-['Cairo'] text-right focus:outline-none focus:border-blue-500"
            />
          </div>
          <span className="text-[11px] font-bold text-slate-500 font-['Cairo'] whitespace-nowrap">
            {filteredPayments.length} دفعة
          </span>
        </div>

        {/* Payment History List (The Ledger) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 bg-slate-50/50">
          {filteredPayments.length === 0 ? (
            <div className="text-center py-10 px-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-2">
                <Receipt className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700 font-['Cairo']">
                {searchTerm ? 'لا توجد نتائج مطابقة لبحثك' : 'لا توجد دفعات مسجلة لهذا الزبون بعد'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 font-['Cairo']">
                يمكنك تسجيل أول دفعة بالضغط على زر "تسجيل دفعة" أعلاه.
              </p>
            </div>
          ) : (
            filteredPayments.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 p-3 sm:p-3.5 shadow-xs transition-all flex flex-col gap-2 hover:shadow-md"
              >
                {/* Top Row: Day, Date, Time & Amount */}
                <div className="flex items-center justify-between">
                  {/* Left: Paid Amount badge */}
                  <div className="text-left">
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-xl text-xs sm:text-sm font-black font-['Cairo']">
                      <span>{p.amount.toFixed(2)}</span>
                      <span className="text-[10px] font-bold">{currency}</span>
                    </span>
                  </div>

                  {/* Right: Day, Date, Time */}
                  <div className="flex items-center gap-2 text-right">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-blue-50 text-blue-700 text-[11px] font-black px-2 py-0.5 rounded-md font-['Cairo'] border border-blue-100">
                          {p.day}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-800">
                          {p.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-['Cairo'] mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{p.time}</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Receipt No, Remaining Debt & Notes */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-['Cairo'] text-slate-600">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => shareReceiptWhatsApp(p)}
                      className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="إرسال إيصال السداد عبر الواتساب"
                    >
                      <Share2 className="w-3 h-3 text-emerald-600" />
                      <span>إرسال إشعار</span>
                    </button>
                    {p.receiptNumber && (
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">
                        {p.receiptNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    {p.notes && (
                      <span className="text-slate-500 text-[11px] truncate max-w-[150px] sm:max-w-[200px]">
                        {p.notes}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 font-bold whitespace-nowrap">
                      المتبقي بعد الدفعة:{' '}
                      <span className="font-black text-slate-800">
                        {p.remainingDebtAfter.toFixed(2)} {currency}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-slate-600 font-['Cairo']">
            المجموع المسدد: <strong className="text-emerald-700">{totalPaid.toFixed(2)} {currency}</strong>
          </span>
          <button
            onClick={closeCustomerLedger}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold font-['Cairo'] transition-colors cursor-pointer"
          >
            إغلاق السجل
          </button>
        </div>

      </div>
    </div>
  );
};
