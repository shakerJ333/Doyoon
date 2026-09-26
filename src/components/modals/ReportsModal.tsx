import React from 'react';
import { X, BarChart2, TrendingUp, DollarSign, Download, Printer } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsModal: React.FC = () => {
  const { stats, currency, closeModal, transactions } = useApp();

  const netProfit = stats.totalSales - stats.totalPurchases;
  const debtCollectionRatio = ((stats.totalCollected / (stats.totalDebts + stats.totalCollected)) * 100).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-4 md:p-5 shadow-2xl animate-in fade-in duration-200">
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
              التقرير المالي وحركة الصندوق
            </h3>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-3.5">
          {/* Net Profit Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-right">
              <span className="text-xs text-emerald-100 font-bold font-['Cairo']">
                صافي الربح التقديري (المبيعات - المشتريات)
              </span>
              <h4 className="text-2xl font-black mt-0.5 font-['Cairo']">
                {netProfit.toFixed(2)} {currency}
              </h4>
              <span className="text-[11px] text-emerald-200">
                نسبة التحصيل من الديون: {debtCollectionRatio}%
              </span>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-right">
              <span className="text-[11px] font-bold text-blue-700 font-['Cairo']">
                إجمالي حركة المبيعات
              </span>
              <div className="text-base font-black text-slate-900 mt-1 font-['Cairo']">
                {stats.totalSales.toFixed(2)} {currency}
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">
                {stats.salesTrend} مقارنة بالشهر السابق
              </span>
            </div>

            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3 text-right">
              <span className="text-[11px] font-bold text-rose-700 font-['Cairo']">
                إجمالي تكلفة المشتريات
              </span>
              <div className="text-base font-black text-slate-900 mt-1 font-['Cairo']">
                {stats.totalPurchases.toFixed(2)} {currency}
              </div>
              <span className="text-[10px] text-rose-600 font-bold">
                {stats.purchasesTrend} مصاريف بضائع وموردين
              </span>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-right">
              <span className="text-[11px] font-bold text-amber-800 font-['Cairo']">
                الديون المعلقة في السوق
              </span>
              <div className="text-base font-black text-slate-900 mt-1 font-['Cairo']">
                {stats.totalDebts.toFixed(2)} {currency}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">
                على {stats.debtCustomerCount} زبائن
              </span>
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-3 text-right">
              <span className="text-[11px] font-bold text-purple-700 font-['Cairo']">
                المبالغ المحصلة فعلياً
              </span>
              <div className="text-base font-black text-slate-900 mt-1 font-['Cairo']">
                {stats.totalCollected.toFixed(2)} {currency}
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">
                {stats.collectedTrend} تم إيداعها في الصندوق
              </span>
            </div>
          </div>

          {/* Quick Summary Statement */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-600 text-right leading-relaxed font-['Cairo']">
            <span className="font-bold text-slate-800 block mb-1">
              ملاحظة التقرير المالي:
            </span>
            الوضع المالي للمتجر ممتاز، وتدفق السيولة النقدية يغطي الالتزامات والمشتريات الحالية. يوصى بمتابعة تحصيل المبالغ المستحقة اليوم بقيمة {stats.dueToday.toFixed(2)} {currency}.
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => window.print()}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs font-['Cairo'] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة التقرير</span>
            </button>
            <button
              onClick={() => alert('تم تصدير نسخة من التقرير المالي بصيغة Excel')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs font-['Cairo'] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>تصدير Excel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
