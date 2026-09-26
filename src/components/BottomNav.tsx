import React from 'react';
import { Home, ShoppingBag, Users, Wallet, MoreHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, stats } = useApp();

  const tabs: Array<{
    id: TabType;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }> = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'sales', label: 'المبيعات', icon: ShoppingBag },
    { id: 'customers', label: 'الزبائن', icon: Users },
    { id: 'debts', label: 'الديون', icon: Wallet, badge: stats.debtCustomerCount },
    { id: 'more', label: 'المزيد', icon: MoreHorizontal },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-30 bg-[#0f1c34] text-slate-300 pt-1.5 pb-2 px-2 sm:px-4 shadow-2xl border-t border-slate-800/80 select-none">
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200 active:scale-95'
              }`}
            >
              {/* Active Indicator Glow/Pill */}
              {isActive && (
                <div className="absolute -top-1 w-8 sm:w-10 h-0.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative">
                <div
                  className={`w-8 h-6 sm:w-9 sm:h-7 flex items-center justify-center rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-600/30 text-blue-400 scale-105'
                      : 'text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={isActive ? 2.5 : 2} />
                </div>

                {/* Badge (e.g. 12 on Debts) */}
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 min-w-3.5 h-3.5 sm:min-w-4 sm:h-4 bg-[#ef4444] text-white text-[9px] sm:text-[10px] font-black rounded-full flex items-center justify-center shadow-md border border-[#0f1c34]">
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Caption */}
              <span
                className={`text-[10px] sm:text-[11px] font-bold mt-0.5 tracking-tight font-['Cairo'] ${
                  isActive ? 'text-blue-400 font-black' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
