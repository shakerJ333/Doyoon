import React, { useState } from 'react';
import { Plus, Search, FileText, Calendar, Filter, Printer } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SalesTab: React.FC = () => {
  const { transactions, currency, openModal } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'cash' | 'credit'>('all');

  const sales = transactions.filter((t) => t.type === 'sale');

  const filteredSales = sales.filter((item) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesCustomer = item.partyName.toLowerCase().includes(term);
    const matchesInvoice = item.invoiceNumber ? item.invoiceNumber.toLowerCase().includes(term) : false;
    const matchesProducts = item.items
      ? item.items.some((it) => it.name.toLowerCase().includes(term))
      : false;
    const matchesSearch = term === '' || matchesCustomer || matchesInvoice || matchesProducts;

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'cash' && item.paymentMethod === 'cash') ||
      (filterType === 'credit' && item.paymentMethod === 'credit');
    return matchesSearch && matchesFilter;
  });

  const totalSalesAmount = sales.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="p-3 md:p-4 space-y-3 pb-6">
      {/* Top Instant Search Bar */}
      <div className="bg-white rounded-2xl p-2.5 shadow-xs border border-slate-200/90 space-y-2">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-blue-600 absolute right-3 pointer-events-none" />
          <input
            type="text"
            placeholder="ابحث فوراً بالاسم، رقم الفاتورة، أو اسم المنتج..."
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
              <Filter className="w-3.5 h-3.5 text-blue-600" />
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
              الكل ({sales.length})
            </button>
            <button
              onClick={() => setFilterType('cash')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === 'cash'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              نقدي
            </button>
            <button
              onClick={() => setFilterType('credit')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === 'credit'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              آجل / ذمم
            </button>
          </div>

          <span className="text-[11px] font-bold text-slate-500">
            النتائج: {filteredSales.length}
          </span>
        </div>
      </div>
      {/* Sales Summary Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-blue-200 font-bold font-['Cairo']">
            إجمالي فواتير المبيعات
          </span>
          <h2 className="text-xl md:text-2xl font-black mt-0.5 font-['Cairo']">
            {totalSalesAmount.toFixed(2)} {currency}
          </h2>
          <span className="text-[11px] text-blue-200 mt-1 inline-block">
            عدد الفواتير: {sales.length} فاتورة
          </span>
        </div>

        <button
          onClick={() => openModal('new_sale')}
          className="bg-white hover:bg-blue-50 text-blue-800 font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all text-xs font-['Cairo'] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>فاتورة جديدة</span>
        </button>
      </div>

      {/* Sales List */}
      <div className="space-y-2">
        {filteredSales.map((sale) => (
          <div
            key={sale.id}
            onClick={() => openModal('view_receipt', sale)}
            className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-between"
          >
            {/* Left: Amount & Action */}
            <div className="text-left flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openModal('view_receipt', sale);
                }}
                className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center transition-colors"
                title="طباعة / تفاصيل"
              >
                <Printer className="w-4 h-4" />
              </button>
              <div>
                <span className="text-sm md:text-base font-black text-slate-900 font-['Cairo']">
                  {sale.amount.toFixed(2)} {currency}
                </span>
                <span
                  className={`block text-[10px] font-bold text-left ${
                    sale.paymentMethod === 'cash'
                      ? 'text-emerald-600'
                      : 'text-amber-600'
                  }`}
                >
                  {sale.paymentMethod === 'cash' ? 'مدفوع نقداً' : 'مؤجل / ذمة'}
                </span>
              </div>
            </div>

            {/* Right: Customer & Invoice details */}
            <div className="flex items-center gap-2.5 text-right">
              <div>
                <h4 className="text-xs md:text-sm font-bold text-slate-800 font-['Cairo']">
                  فاتورة مبيعات - {sale.partyName}
                </h4>
                <div className="flex items-center justify-end gap-2 text-[11px] text-slate-500 mt-0.5">
                  <span>{sale.invoiceNumber || 'INV-001'}</span>
                  <span>•</span>
                  <span>{sale.date} - {sale.time}</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}

        {filteredSales.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold">لا توجد فواتير مبيعات مطابقة</p>
          </div>
        )}
      </div>
    </div>
  );
};
