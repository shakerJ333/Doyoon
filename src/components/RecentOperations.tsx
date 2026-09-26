import React from 'react';
import { ShoppingCart, Banknote, Truck, ChevronLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';

export const RecentOperations: React.FC = () => {
  const { transactions, currency, openModal } = useApp();

  const recentTx = transactions.slice(0, 4);

  const getIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'sale':
        return {
          icon: ShoppingCart,
          bg: 'bg-[#10b981]',
          color: 'text-white',
        };
      case 'collection':
        return {
          icon: Banknote,
          bg: 'bg-[#0284c7]',
          color: 'text-white',
        };
      case 'purchase':
        return {
          icon: Truck,
          bg: 'bg-[#8b5cf6]',
          color: 'text-white',
        };
      default:
        return {
          icon: ShoppingCart,
          bg: 'bg-slate-500',
          color: 'text-white',
        };
    }
  };

  return (
    <div
      id="recent-operations-section"
      className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs flex-1 flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-100">
        <button
          onClick={() => openModal('reports')}
          className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          عرض الكل
        </button>
        <h2 className="text-xs md:text-sm font-extrabold text-slate-900 font-['Cairo']">
          آخر العمليات
        </h2>
      </div>

      {/* Transaction List */}
      <div className="divide-y divide-slate-100">
        {recentTx.map((tx) => {
          const { icon: Icon, bg, color } = getIcon(tx.type);
          const isNegative = tx.isDebit || tx.amount < 0;

          return (
            <div
              key={tx.id}
              onClick={() => openModal('view_receipt', tx)}
              className="py-2 flex items-center justify-between hover:bg-slate-50/80 rounded-xl px-1.5 transition-colors cursor-pointer group"
            >
              {/* Left Side: Amount & Chevron Arrow */}
              <div className="flex items-center gap-1.5 text-left">
                <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
                <span
                  className={`text-xs md:text-sm font-black font-['Cairo'] ${
                    isNegative ? 'text-[#dc2626]' : 'text-[#10b981]'
                  }`}
                >
                  {isNegative ? '' : '+'}
                  {tx.amount.toFixed(2)} {currency}
                </span>
              </div>

              {/* Right Side: Title, Details, and Circular Icon */}
              <div className="flex items-center gap-2 text-right">
                <div className="flex flex-col items-end">
                  <span className="text-[11px] md:text-xs font-bold text-slate-800 font-['Cairo'] line-clamp-1">
                    {tx.title} - {tx.type === 'purchase' ? 'مورد:' : 'زبون:'} {tx.partyName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {tx.date} - {tx.time}
                  </span>
                </div>

                <div
                  className={`w-7 h-7 md:w-8 md:h-8 rounded-full ${bg} ${color} flex items-center justify-center shrink-0 shadow-xs`}
                >
                  <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
