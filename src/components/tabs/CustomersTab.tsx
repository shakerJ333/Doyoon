import React, { useState } from 'react';
import { UserPlus, Search, Phone, MessageSquare, Plus, CreditCard, MapPin, Filter, X, Receipt } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';

export const CustomersTab: React.FC = () => {
  const { customers, currency, openModal, recordCustomerPayment, openCustomerLedger } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'debt' | 'zero'>('all');

  const filteredCustomers = customers.filter((cust) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesName = cust.name.toLowerCase().includes(term);
    const matchesPhone = cust.phone.includes(term);
    const matchesAddress = cust.address ? cust.address.toLowerCase().includes(term) : false;
    const matchesNotes = cust.notes ? cust.notes.toLowerCase().includes(term) : false;
    const matchesSearch = term === '' || matchesName || matchesPhone || matchesAddress || matchesNotes;

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'debt' && cust.totalDebt > 0) ||
      (filterType === 'zero' && cust.totalDebt === 0);
    return matchesSearch && matchesFilter;
  });

  const totalOutstandingDebt = customers.reduce((sum, c) => sum + (c.totalDebt || 0), 0);

  const handleSendWhatsApp = (cust: Customer) => {
    const msg = `مرحباً أخي الكريم ${cust.name}، تحية طيبة من متجر الأمل التجاري. نود تذكيركم بأن رصيد حسابكم الحالي هو ${cust.totalDebt.toFixed(2)} ${currency}. شاكرين لكم حسن تعاونكم.`;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-3 md:p-4 space-y-3 pb-6">
      {/* Top Instant Search Bar */}
      <div className="bg-white rounded-2xl p-2.5 shadow-xs border border-slate-200/90 space-y-2">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-blue-600 absolute right-3 pointer-events-none" />
          <input
            type="text"
            placeholder="ابحث فوراً باسم الزبون، رقم الهاتف، أو العنوان..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 hover:border-blue-400 focus:border-blue-600 rounded-xl pr-9 pl-8 py-2 text-xs md:text-sm font-['Cairo'] focus:outline-none transition-colors"
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

        {/* Quick Filter Tags / Chips */}
        <div className="flex items-center justify-between gap-1.5 pt-0.5 border-t border-slate-100 text-xs font-['Cairo']">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">تصفية:</span>
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              الكل ({customers.length})
            </button>
            <button
              onClick={() => setFilterType('debt')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === 'debt'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              عليهم ديون ({customers.filter((c) => c.totalDebt > 0).length})
            </button>
            <button
              onClick={() => setFilterType('zero')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === 'zero'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              خالص الحساب ({customers.filter((c) => c.totalDebt === 0).length})
            </button>
          </div>

          <span className="text-[11px] font-bold text-slate-500">
            النتائج: {filteredCustomers.length}
          </span>
        </div>
      </div>

      {/* Customers Header Banner */}
      <div className="bg-gradient-to-r from-sky-700 to-blue-800 text-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-blue-200 font-bold font-['Cairo']">
            دليل الزبائن والذمم
          </span>
          <h2 className="text-xl md:text-2xl font-black mt-0.5 font-['Cairo']">
            {customers.length} زبون
          </h2>
          <span className="text-[11px] text-blue-200 mt-1 inline-block">
            إجمالي الديون على الزبائن: {totalOutstandingDebt.toFixed(2)} {currency}
          </span>
        </div>

        <button
          onClick={() => openModal('add_customer')}
          className="bg-white hover:bg-blue-50 text-blue-800 font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all text-xs font-['Cairo'] cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>إضافة زبون</span>
        </button>
      </div>

      {/* Customers List */}
      <div className="space-y-2.5">
        {filteredCustomers.map((cust) => {
          const hasDebt = cust.totalDebt > 0;
          return (
            <div
              key={cust.id}
              className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                {/* Left: Debt Badge & Quick Payment */}
                <div className="text-left flex flex-col items-start gap-1">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-black font-['Cairo'] ${
                      hasDebt
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {hasDebt
                      ? `دين: ${cust.totalDebt.toFixed(2)} ${currency}`
                      : 'الحساب خالص'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    سقف الدين: {cust.creditLimit} {currency}
                  </span>
                </div>

                {/* Right: Customer Profile */}
                <div className="text-right">
                  <h4 className="text-sm font-bold text-slate-900 font-['Cairo']">
                    {cust.name}
                  </h4>
                  <div className="flex items-center justify-end gap-1 text-[11px] text-slate-600 mt-0.5">
                    <span>{cust.phone}</span>
                    <Phone className="w-3 h-3 text-slate-400" />
                  </div>
                  {cust.address && (
                    <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 mt-0.5">
                      <span>{cust.address}</span>
                      <MapPin className="w-3 h-3 text-slate-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${cust.phone}`}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 text-[11px] font-bold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>اتصال</span>
                  </a>
                  {hasDebt && (
                    <button
                      onClick={() => handleSendWhatsApp(cust)}
                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center gap-1 text-[11px] font-bold transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>واتساب</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Customer Payments Ledger Button */}
                  <button
                    onClick={() => openCustomerLedger(cust)}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold font-['Cairo'] flex items-center gap-1 transition-colors cursor-pointer border border-indigo-200/80"
                    title="سجل دفعات الزبون باليوم والتاريخ"
                  >
                    <Receipt className="w-3.5 h-3.5 text-indigo-600" />
                    <span>سجل الدفعات</span>
                  </button>

                  {hasDebt && (
                    <button
                      onClick={() => openCustomerLedger(cust)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>تحصيل دفعة</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
