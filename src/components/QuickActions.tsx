import React from 'react';
import { Truck, Users, FileText, ShoppingCart, Package, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QuickActions: React.FC = () => {
  const { openModal } = useApp();

  const actions = [
    {
      id: 'purchases',
      title: 'إضافة مشتريات',
      icon: Truck,
      bg: 'bg-[#fff0f2]',
      border: 'border-[#fed7dc]',
      textColor: 'text-[#e11d48]',
      iconColor: 'text-[#e11d48]',
      onClick: () => openModal('add_purchase'),
    },
    {
      id: 'customer',
      title: 'إضافة زبون',
      icon: Users,
      bg: 'bg-[#f6f0fe]',
      border: 'border-[#ecdffd]',
      textColor: 'text-[#7c3aed]',
      iconColor: 'text-[#8b5cf6]',
      onClick: () => openModal('add_customer'),
    },
    {
      id: 'invoice',
      title: 'فاتورة جديدة',
      icon: FileText,
      bg: 'bg-[#edf5fe]',
      border: 'border-[#d4e6fd]',
      textColor: 'text-[#1d4ed8]',
      iconColor: 'text-[#2563eb]',
      onClick: () => openModal('new_sale'),
    },
    {
      id: 'sale',
      title: 'عملية بيع',
      icon: ShoppingCart,
      bg: 'bg-[#eefaf4]',
      border: 'border-[#c8f0dd]',
      textColor: 'text-[#059669]',
      iconColor: 'text-[#10b981]',
      onClick: () => openModal('new_sale'),
    },
    {
      id: 'products',
      title: 'إدارة المنتجات',
      icon: Package,
      bg: 'bg-[#fff5e9]',
      border: 'border-[#fde1c2]',
      textColor: 'text-[#c2410c]',
      iconColor: 'text-[#f97316]',
      onClick: () => openModal('products'),
    },
  ];

  return (
    <div className="px-2.5 sm:px-4 mt-2">
      {/* 5 Quick Action Cards Grid */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={act.onClick}
              className={`${act.bg} ${act.border} border rounded-2xl py-2 px-1 flex flex-col items-center justify-between text-center min-w-[58px] sm:min-w-0 transition-transform active:scale-95 hover:shadow-xs group cursor-pointer shadow-xs`}
            >
              {/* Icon */}
              <div className={`${act.iconColor} p-0.5 mb-0.5 transition-transform group-hover:scale-110`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.2} />
              </div>

              {/* Title */}
              <span className={`text-[9px] sm:text-xs font-bold ${act.textColor} font-['Cairo'] leading-tight mb-0.5 line-clamp-1`}>
                {act.title}
              </span>

              {/* Arrow in RTL pointing left */}
              <div className={`${act.textColor}`}>
                <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" strokeWidth={2.5} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
