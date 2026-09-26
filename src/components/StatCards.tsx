import React from 'react';
import {
  Coins,
  ShoppingCart,
  Users,
  Wallet,
  User,
  AlertTriangle,
  Calendar,
  Clock,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StatCards: React.FC = () => {
  const { stats, currency, setActiveTab, openModal } = useApp();

  return (
    <div className="space-y-2 mt-2 px-2.5 sm:px-4">
      {/* Row 1: Top 4 KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Card 1: Total Sales (Green) */}
        <div
          onClick={() => setActiveTab('sales')}
          className="cursor-pointer bg-[#edf9f3] hover:bg-[#e4f6ec] border border-[#c8f0db] rounded-2xl p-2.5 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between gap-1 mb-0.5">
            <div className="w-7 h-7 rounded-full bg-[#10b981] flex items-center justify-center text-white shadow-xs shrink-0">
              <Coins className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-700 font-['Cairo'] text-right line-clamp-1">
              إجمالي المبيعات
            </span>
          </div>

          <div className="mt-1 text-right">
            <div className="text-sm sm:text-base font-black text-slate-900 font-['Cairo'] tracking-tight">
              {stats.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              <span className="text-[10px] sm:text-xs font-bold text-slate-600">{currency}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1 text-[#10b981] text-[10px] font-bold">
            <div className="flex items-center gap-0.5">
              <span>{stats.salesTrend}</span>
            </div>
            <TrendingUp className="w-3 h-3" />
          </div>
        </div>

        {/* Card 2: Total Purchases (Blue) */}
        <div
          onClick={() => openModal('add_purchase')}
          className="cursor-pointer bg-[#eef6ff] hover:bg-[#e5f0fe] border border-[#d2e4fe] rounded-2xl p-2.5 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between gap-1 mb-0.5">
            <div className="w-7 h-7 rounded-full bg-[#2563eb] flex items-center justify-center text-white shadow-xs shrink-0">
              <ShoppingCart className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-700 font-['Cairo'] text-right line-clamp-1">
              إجمالي المشتريات
            </span>
          </div>

          <div className="mt-1 text-right">
            <div className="text-sm sm:text-base font-black text-slate-900 font-['Cairo'] tracking-tight">
              {stats.totalPurchases.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              <span className="text-[10px] sm:text-xs font-bold text-slate-600">{currency}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1 text-[#2563eb] text-[10px] font-bold">
            <div className="flex items-center gap-0.5">
              <span>{stats.purchasesTrend}</span>
            </div>
            <TrendingUp className="w-3 h-3" />
          </div>
        </div>

        {/* Card 3: Total Outstanding Debts (Red/Coral) */}
        <div
          onClick={() => setActiveTab('debts')}
          className="cursor-pointer bg-[#fff1f1] hover:bg-[#ffe7e7] border border-[#fdd1d1] rounded-2xl p-2.5 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between gap-1 mb-0.5">
            <div className="w-7 h-7 rounded-full bg-[#ef4444] flex items-center justify-center text-white shadow-xs shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-[#b91c1c] font-['Cairo'] text-right line-clamp-1">
              إجمالي الديون المستحقة
            </span>
          </div>

          <div className="mt-1 text-right">
            <div className="text-sm sm:text-base font-black text-[#dc2626] font-['Cairo'] tracking-tight">
              {stats.totalDebts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              <span className="text-[10px] sm:text-xs font-bold text-slate-600">{currency}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1 text-[#ef4444] text-[10px] font-bold">
            <div className="flex items-center gap-0.5">
              <span>{stats.debtsTrend}</span>
            </div>
            <TrendingUp className="w-3 h-3" />
          </div>
        </div>

        {/* Card 4: Total Collected Amounts (Purple) */}
        <div
          onClick={() => setActiveTab('debts')}
          className="cursor-pointer bg-[#f6f2fe] hover:bg-[#ede5fc] border border-[#e8d9fd] rounded-2xl p-2.5 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between gap-1 mb-0.5">
            <div className="w-7 h-7 rounded-full bg-[#8b5cf6] flex items-center justify-center text-white shadow-xs shrink-0">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-700 font-['Cairo'] text-right line-clamp-1">
              إجمالي المبالغ المحصلة
            </span>
          </div>

          <div className="mt-1 text-right">
            <div className="text-sm sm:text-base font-black text-slate-900 font-['Cairo'] tracking-tight">
              {stats.totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              <span className="text-[10px] sm:text-xs font-bold text-slate-600">{currency}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1 text-[#8b5cf6] text-[10px] font-bold">
            <div className="flex items-center gap-0.5">
              <span>{stats.collectedTrend}</span>
            </div>
            <TrendingUp className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Row 2: Secondary 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Number of Customers */}
        <div
          onClick={() => setActiveTab('customers')}
          className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-2 shadow-xs flex items-center justify-between transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-[#3b82f6] flex items-center justify-center text-white shadow-xs shrink-0">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="text-right">
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-700 font-['Cairo']">
              عدد الزبائن
            </div>
            <div className="text-base font-black text-slate-900 mt-0.5 leading-none">
              {stats.customerCount}
            </div>
            <div className="flex justify-end text-[#3b82f6] mt-0.5">
              <Users className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Customers with Debts */}
        <div
          onClick={() => setActiveTab('debts')}
          className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-2 shadow-xs flex items-center justify-between transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-[#f97316] flex items-center justify-center text-white shadow-xs shrink-0">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="text-right">
            <div className="text-[10px] sm:text-[11px] font-bold text-amber-900 font-['Cairo']">
              زبائن لديهم ديون
            </div>
            <div className="text-base font-black text-[#ea580c] mt-0.5 leading-none">
              {stats.debtCustomerCount}
            </div>
            <div className="flex justify-end text-[#ea580c] mt-0.5">
              <Users className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Due Today */}
        <div
          onClick={() => openModal('debt_reminder')}
          className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-2 shadow-xs flex items-center justify-between transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-[#0d9488] flex items-center justify-center text-white shadow-xs shrink-0">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="text-right">
            <div className="text-[10px] sm:text-[11px] font-bold text-[#0f766e] font-['Cairo']">
              المستحق اليوم
            </div>
            <div className="text-xs sm:text-sm font-black text-slate-900 mt-0.5 flex items-center justify-end gap-1 leading-none">
              <Calendar className="w-3 h-3 text-emerald-600 inline" />
              <span>
                {stats.dueToday.toFixed(2)} {currency}
              </span>
            </div>
          </div>
        </div>

        {/* Latest Operations */}
        <div
          onClick={() => {
            const el = document.getElementById('recent-operations-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-2 shadow-xs flex items-center justify-between transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-[#8b5cf6] flex items-center justify-center text-white shadow-xs shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="text-right">
            <div className="text-[10px] sm:text-[11px] font-bold text-[#6d28d9] font-['Cairo']">
              آخر العمليات
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-0.5 flex items-center justify-end gap-1">
              <FileText className="w-2.5 h-2.5 text-purple-600" />
              <span>فاتورة مبيعات</span>
            </div>
            <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">
              اليوم - 10:24 ص
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
