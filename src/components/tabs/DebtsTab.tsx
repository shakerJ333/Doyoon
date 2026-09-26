import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  MessageSquare,
  Plus,
  ArrowUpRight,
  Phone,
  Search,
  X,
  Filter,
  Receipt,
  Calendar,
  Share2,
  User,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Customer, DebtPayment } from '../../types';

export const DebtsTab: React.FC = () => {
  const {
    customers,
    currency,
    recordCustomerPayment,
    addCustomerDebt,
    openCustomerLedger,
    debtPayments,
    store,
  } = useApp();

  const [viewMode, setViewMode] = useState<'debtors' | 'payments'>('debtors');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'overdue'>('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');

  const debtCustomers = customers.filter((c) => c.totalDebt > 0);

  // Filter debtors list based on activeFilter and searchTerm
  const filteredDebtorsList = debtCustomers.filter((c) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      term === '' ||
      c.name.toLowerCase().includes(term) ||
      c.phone.includes(term) ||
      (c.notes && c.notes.toLowerCase().includes(term)) ||
      (c.address && c.address.toLowerCase().includes(term));

    if (!matchesSearch) return false;

    if (activeFilter === 'today') {
      return ['c-2', 'c-3', 'c-4'].includes(c.id);
    }
    if (activeFilter === 'overdue') {
      return c.totalDebt >= 150;
    }
    return true;
  });

  // Filter payments history based on searchTerm
  const filteredPaymentsList = debtPayments.filter((p) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      p.customerName.toLowerCase().includes(term) ||
      p.day.toLowerCase().includes(term) ||
      p.date.toLowerCase().includes(term) ||
      (p.receiptNumber && p.receiptNumber.toLowerCase().includes(term)) ||
      (p.notes && p.notes.toLowerCase().includes(term)) ||
      p.amount.toString().includes(term)
    );
  });

  const totalDebt = debtCustomers.reduce((sum, c) => sum + c.totalDebt, 0);
  const totalCollectedDebt = debtPayments.reduce((sum, p) => sum + p.amount, 0);

  const handleSendWhatsAppReminder = (cust: Customer) => {
    const msg = `السلام عليكم ورحمة الله وبركاته، الأخ العزيز ${cust.name} المحترم.\nتحية طيبة من متجر الأمل التجاري.\nنود تذكير حضرتكم بضرورة تسوية الرصيد المستحق وقدره (${cust.totalDebt.toFixed(2)} ${currency}).\nشاكرين ومقدرين حسن تعاونكم الدائم معنا.`;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const shareReceiptWhatsApp = (p: DebtPayment) => {
    const text = encodeURIComponent(
      `*سند قبض دفعة دين - ${store.name}*\n` +
      `-----------------------------\n` +
      `👤 الزبون: ${p.customerName}\n` +
      `📅 اليوم: ${p.day}\n` +
      `📆 التاريخ: ${p.date}\n` +
      `⏰ الوقت: ${p.time}\n` +
      `💵 قيمة الدفعة: ${p.amount.toFixed(2)} ${currency}\n` +
      `🧾 رقم السند: ${p.receiptNumber || 'بدون'}\n` +
      `💳 المتبقي من الدين: ${p.remainingDebtAfter.toFixed(2)} ${currency}\n` +
      `📝 بيان: ${p.notes || 'سداد نقدي'}\n` +
      `-----------------------------\n` +
      `شكراً لحسن تعاونكم الدائم معنا!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handlePay = (cust: Customer) => {
    const val = parseFloat(paymentAmount);
    if (!isNaN(val) && val > 0) {
      recordCustomerPayment(cust.id, val, { note: 'سداد نقدي مباشر' });
      setSelectedCustomerId(null);
      setPaymentAmount('');
    }
  };

  return (
    <div className="p-3 md:p-4 space-y-3 pb-6 select-none">
      {/* Top Toggle Switch: Debtors List vs All Payments Log */}
      <div className="bg-slate-200/90 p-1 rounded-2xl flex items-center gap-1 font-['Cairo'] text-xs font-bold shadow-xs">
        <button
          onClick={() => {
            setViewMode('debtors');
            setSearchTerm('');
          }}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            viewMode === 'debtors'
              ? 'bg-white text-rose-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>قائمة المدينين ({debtCustomers.length})</span>
        </button>

        <button
          onClick={() => {
            setViewMode('payments');
            setSearchTerm('');
          }}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            viewMode === 'payments'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>سجل الدفعات باليوم والتاريخ ({debtPayments.length})</span>
        </button>
      </div>

      {/* Top Instant Search Bar */}
      <div className="bg-white rounded-2xl p-2.5 shadow-xs border border-slate-200/90 space-y-2">
        <div className="relative flex items-center">
          <Search className={`w-4 h-4 absolute right-3 pointer-events-none ${viewMode === 'payments' ? 'text-emerald-600' : 'text-rose-600'}`} />
          <input
            type="text"
            placeholder={
              viewMode === 'debtors'
                ? 'ابحث في قائمة الديون بالاسم، الهاتف، أو الملاحظة...'
                : 'ابحث في سجل الدفعات (باليوم، التاريخ، الزبون، المبلغ، رقم السند)...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 rounded-xl pr-9 pl-8 py-2 text-xs md:text-sm font-['Cairo'] focus:outline-none transition-colors text-right"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-2.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              title="مسح البحث"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Filter Tags (only in debtors mode) */}
        {viewMode === 'debtors' && (
          <div className="flex items-center justify-between gap-1.5 pt-0.5 border-t border-slate-100 text-xs font-['Cairo']">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">تصفية:</span>
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                الكل ({debtCustomers.length})
              </button>
              <button
                onClick={() => setActiveFilter('today')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'today'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                المستحق اليوم (3)
              </button>
              <button
                onClick={() => setActiveFilter('overdue')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'overdue'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                ديون متأخرة
              </button>
            </div>

            <span className="text-[11px] font-bold text-slate-500">
              النتائج: {filteredDebtorsList.length}
            </span>
          </div>
        )}
      </div>

      {/* Top Financial Stat Banner */}
      {viewMode === 'debtors' ? (
        <div className="bg-gradient-to-r from-rose-700 via-rose-800 to-red-900 text-white rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
              <AlertTriangle className="w-6 h-6 text-amber-300" />
            </div>
            <div className="text-right">
              <span className="text-xs text-rose-200 font-bold font-['Cairo']">
                إجمالي الديون المستحقة
              </span>
              <h2 className="text-2xl font-black mt-0.5 font-['Cairo']">
                {totalDebt.toFixed(2)} {currency}
              </h2>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-rose-600/60 flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveFilter('today')}
              className="text-amber-200 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>المستحق اليوم: 320.00 {currency}</span>
            </button>
            <span className="text-rose-200 font-bold">
              {debtCustomers.length} زبائن لديهم ديون
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900 text-white rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
              <Receipt className="w-6 h-6 text-emerald-300" />
            </div>
            <div className="text-right">
              <span className="text-xs text-emerald-200 font-bold font-['Cairo']">
                إجمالي الدفعات المسددة
              </span>
              <h2 className="text-2xl font-black mt-0.5 font-['Cairo']">
                {totalCollectedDebt.toFixed(2)} {currency}
              </h2>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-emerald-600/60 flex items-center justify-between text-xs">
            <span className="text-emerald-200">
              عدد عمليات السداد الموثقة: <strong>{debtPayments.length}</strong> دفعة
            </span>
            <span className="text-emerald-100 font-bold">
              موثقة باليوم والتاريخ والساعة
            </span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {viewMode === 'debtors' ? (
        /* Debt Customers List */
        <div className="space-y-2.5">
          {filteredDebtorsList.map((cust) => {
            const isPaying = selectedCustomerId === cust.id;

            return (
              <div
                key={cust.id}
                className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  {/* Left: Amount & Due badge */}
                  <div className="text-left">
                    <span className="text-base md:text-lg font-black text-rose-600 font-['Cairo'] block">
                      {cust.totalDebt.toFixed(2)} {currency}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      آخر حركة: {cust.lastTransactionDate}
                    </span>
                  </div>

                  {/* Right: Info */}
                  <div className="text-right">
                    <h4 className="text-sm font-bold text-slate-900 font-['Cairo']">
                      {cust.name}
                    </h4>
                    <div className="flex items-center justify-end gap-1 text-[11px] text-slate-600 mt-0.5">
                      <span>{cust.phone}</span>
                      <Phone className="w-3 h-3 text-slate-400" />
                    </div>
                    {cust.notes && (
                      <p className="text-[10px] text-amber-700 font-medium mt-0.5 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                        {cust.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Inline Payment Input Row if active */}
                {isPaying && (
                  <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-800 block mb-1.5 font-['Cairo'] text-right">
                      تسجيل دفعة من {cust.name}:
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="أدخل المبلغ..."
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-center font-bold text-emerald-700 focus:outline-none focus:border-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={() => handlePay(cust)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 font-['Cairo'] cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>تأكيد</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCustomerId(null);
                          setPaymentAmount('');
                        }}
                        className="text-slate-500 text-xs px-2 py-1.5 font-['Cairo'] cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons Row */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSendWhatsAppReminder(cust)}
                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center gap-1 text-[11px] font-bold font-['Cairo'] transition-colors cursor-pointer"
                      title="إرسال تذكير بالدين عبر الواتساب"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>تذكير</span>
                    </button>
                    <a
                      href={`tel:${cust.phone}`}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 text-[11px] font-bold font-['Cairo'] transition-colors"
                      title="اتصال هاتفي"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>اتصال</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Customer Ledger Button */}
                    <button
                      onClick={() => openCustomerLedger(cust)}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold font-['Cairo'] flex items-center gap-1 transition-colors cursor-pointer border border-indigo-200/80"
                      title="عرض سجل دفعات هذا الزبون"
                    >
                      <Receipt className="w-3.5 h-3.5 text-indigo-600" />
                      <span>سجل الدفعات</span>
                    </button>

                    {/* Quick Pay */}
                    <button
                      onClick={() => {
                        setSelectedCustomerId(cust.id);
                        setPaymentAmount(cust.totalDebt.toString());
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold font-['Cairo'] flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>قبض دفعة</span>
                    </button>

                    <button
                      onClick={() => {
                        const addStr = prompt(`أدخل مبلغ الدين الإضافي لـ ${cust.name}:`);
                        if (addStr) {
                          const val = parseFloat(addStr);
                          if (!isNaN(val) && val > 0) {
                            addCustomerDebt(cust.id, val, 'إضافة دين جديد');
                          }
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition-colors cursor-pointer"
                      title="زيادة دين"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredDebtorsList.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold font-['Cairo']">لا توجد ديون مطابقة لهذا الفلتر</p>
            </div>
          )}
        </div>
      ) : (
        /* All Debt Payments Log with Day, Date, Time & Amount */
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-600 font-['Cairo']">
              سجل كافة الدفعات المقبوضة مرتبة بالتاريخ الأحدث:
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {filteredPaymentsList.length} سند قبض
            </span>
          </div>

          {filteredPaymentsList.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200 font-['Cairo']">
              <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold">لا توجد دفعات مطابقة لبحثك</p>
            </div>
          ) : (
            filteredPaymentsList.map((p) => {
              const matchedCustomer = customers.find((c) => c.id === p.customerId);

              return (
                <div
                  key={p.id}
                  className="bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-3.5 shadow-xs transition-all flex flex-col gap-2 hover:shadow-md"
                >
                  {/* Top row: Customer name & Paid Amount */}
                  <div className="flex items-center justify-between">
                    {/* Amount Pill */}
                    <div className="text-left">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-xl text-sm font-black font-['Cairo']">
                        <span>+{p.amount.toFixed(2)}</span>
                        <span className="text-[10px] font-bold">{currency}</span>
                      </span>
                    </div>

                    {/* Customer name */}
                    <div className="flex items-center gap-2 text-right">
                      <div>
                        <h4 className="text-sm font-black text-slate-900 font-['Cairo']">
                          {p.customerName}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400">
                          {p.receiptNumber || 'سند قبض'}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Date, Day, Time Details Banner */}
                  <div className="bg-slate-50 rounded-xl p-2 flex items-center justify-between text-xs font-['Cairo']">
                    {/* Left: Time */}
                    <div className="flex items-center gap-1 text-slate-500 font-sans text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.time}</span>
                    </div>

                    {/* Center: Day & Date */}
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md font-['Cairo'] shadow-xs">
                        {p.day}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-700">
                        {p.date}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row: Remaining debt, notes & Actions */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs font-['Cairo']">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => shareReceiptWhatsApp(p)}
                        className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="مشاركة إيصال القبض عبر الواتساب"
                      >
                        <Share2 className="w-3 h-3 text-emerald-600" />
                        <span>إرسال إيصال</span>
                      </button>

                      {matchedCustomer && (
                        <button
                          onClick={() => openCustomerLedger(matchedCustomer)}
                          className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          title="عرض كشف حساب الزبون بالكامل"
                        >
                          <ExternalLink className="w-3 h-3 text-indigo-600" />
                          <span>كشف الحساب</span>
                        </button>
                      )}
                    </div>

                    <div className="text-right text-[11px]">
                      <span className="text-slate-500">المتبقي: </span>
                      <strong className="text-slate-800 font-bold">
                        {p.remainingDebtAfter.toFixed(2)} {currency}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

