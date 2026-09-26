import React from 'react';
import {
  Package,
  Truck,
  BarChart2,
  Store,
  Settings,
  HelpCircle,
  RotateCcw,
  ChevronLeft,
  ShieldCheck,
  Smartphone,
  Database,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MoreTab: React.FC = () => {
  const { openModal, store, resetToDefaults, setDeviceMode, isFirestoreConnected } = useApp();

  const menuSections = [
    {
      title: 'إدارة العمليات والمخزون',
      items: [
        {
          id: 'products',
          label: 'إدارة المنتجات والمخزون',
          desc: 'الأسعار، الكميات المتوفرة، والباركود',
          icon: Package,
          color: 'text-amber-600 bg-amber-50',
          onClick: () => openModal('products'),
        },
        {
          id: 'purchases',
          label: 'المشتريات وحسابات الموردين',
          desc: 'تسجيل فواتير المشتريات ومتابعة المصاريف',
          icon: Truck,
          color: 'text-rose-600 bg-rose-50',
          onClick: () => openModal('add_purchase'),
        },
        {
          id: 'reports',
          label: 'التقارير المالية والأرباح',
          desc: 'إحصائيات تفصيلية، الأرباح، وحركة الصندوق',
          icon: BarChart2,
          color: 'text-blue-600 bg-blue-50',
          onClick: () => openModal('reports'),
        },
      ],
    },
    {
      title: 'الإعدادات والمتجر',
      items: [
        {
          id: 'store_settings',
          label: 'بيانات المتجر والفروع',
          desc: `${store.name} - ${store.branch}`,
          icon: Store,
          color: 'text-indigo-600 bg-indigo-50',
          onClick: () => openModal('store_switcher'),
        },
        {
          id: 'general_settings',
          label: 'إعدادات النظام والعملة',
          desc: 'تعديل العملة، نسبة الضريبة، والنسخ الاحتياطي',
          icon: Settings,
          color: 'text-slate-700 bg-slate-100',
          onClick: () => openModal('settings'),
        },
      ],
    },
  ];

  return (
    <div className="p-3 md:p-4 space-y-4 pb-8">
      {/* Store Profile Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
        <div className="text-right">
          <h3 className="text-base font-black text-slate-900 font-['Cairo']">
            {store.name}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {store.branch}
          </p>
          <div className="flex items-center justify-end gap-2 mt-1">
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Database className="w-3 h-3 text-emerald-600" />
              <span>قاعدة بيانات سحابية متصلة ومحفوظة</span>
            </div>
          </div>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
          <Store className="w-6 h-6" />
        </div>
      </div>

      {/* Menu Groups */}
      {menuSections.map((sec, idx) => (
        <div key={idx} className="space-y-1.5">
          <h4 className="text-xs font-bold text-slate-500 px-1 font-['Cairo'] text-right">
            {sec.title}
          </h4>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs divide-y divide-slate-100">
            {sec.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-right cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-xs md:text-sm font-bold text-slate-800 font-['Cairo']">
                        {item.label}
                      </div>
                      <div className="text-[10px] md:text-[11px] text-slate-500 font-medium">
                        {item.desc}
                      </div>
                    </div>
                    <div
                      className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center shrink-0`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Device Mode Switcher for Quick Testing */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs">
        <h4 className="text-xs font-bold text-slate-800 mb-2 font-['Cairo'] text-right">
          وضع المعاينة للأجهزة الذكية:
        </h4>
        <div className="grid grid-cols-4 gap-1.5 text-xs font-bold font-['Cairo']">
          <button
            onClick={() => setDeviceMode('iphone')}
            className="py-2 px-1 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition-colors cursor-pointer text-center"
          >
            آيفون 15
          </button>
          <button
            onClick={() => setDeviceMode('android')}
            className="py-2 px-1 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition-colors cursor-pointer text-center"
          >
            أندرويد
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className="py-2 px-1 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition-colors cursor-pointer text-center"
          >
            تابلت / iPad
          </button>
          <button
            onClick={() => setDeviceMode('responsive')}
            className="py-2 px-1 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition-colors cursor-pointer text-center"
          >
            ملء الشاشة
          </button>
        </div>
      </div>

      {/* Danger Zone / Reset */}
      <div className="pt-2">
        <button
          onClick={() => {
            if (window.confirm('هل تريد استعادة البيانات الافتراضية للتطبيق؟')) {
              resetToDefaults();
            }
          }}
          className="w-full py-2.5 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-['Cairo']"
        >
          <RotateCcw className="w-4 h-4" />
          <span>استعادة بيانات العرض التجريبي الافتراضية</span>
        </button>
      </div>
    </div>
  );
};
