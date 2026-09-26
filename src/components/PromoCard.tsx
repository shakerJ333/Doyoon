import React from 'react';
import { BarChart2, Lightbulb, ChevronLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StoreGraphic } from './StoreGraphic';

export const PromoCard: React.FC = () => {
  const { openModal } = useApp();

  return (
    <div className="flex-1 flex flex-col justify-between gap-2.5">
      {/* Smart Management Card */}
      <div className="bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/50 rounded-2xl border border-blue-100 p-3 shadow-xs flex flex-col justify-between relative overflow-hidden">
        {/* Top Content: Graphic + Text */}
        <div className="flex items-center justify-between gap-2">
          {/* Text on Right */}
          <div className="text-right flex-1">
            <h3 className="text-xs md:text-sm font-black text-slate-900 font-['Cairo']">
              بإدارة ذكية..
            </h3>
            <p className="text-[10px] md:text-[11px] text-slate-600 font-medium mt-0.5 leading-snug">
              تستطيع متابعة مبيعاتك ومشترياتك وديون زبائنك بكل سهولة
            </p>
          </div>

          {/* 3D Store Graphic */}
          <div className="shrink-0 transform hover:scale-105 transition-transform">
            <StoreGraphic size="sm" className="w-12 h-12 md:w-14 md:h-14" />
          </div>
        </div>

        {/* Action Button: عرض التقارير */}
        <div className="mt-2.5">
          <button
            onClick={() => openModal('reports')}
            className="w-full bg-[#1b62cd] hover:bg-[#154fa8] text-white py-1.5 px-3 rounded-full flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all cursor-pointer font-['Cairo'] text-xs font-bold"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>عرض التقارير</span>
          </button>
        </div>
      </div>

      {/* Reminder Card */}
      <div
        onClick={() => openModal('debt_reminder')}
        className="bg-[#f0f7ff] hover:bg-[#e4f0fe] border border-blue-200/80 rounded-2xl p-2.5 shadow-xs flex items-center justify-between cursor-pointer transition-all group"
      >
        {/* Left Arrow */}
        <ChevronLeft className="w-4 h-4 text-blue-600 group-hover:-translate-x-0.5 transition-transform" />

        {/* Content on Right */}
        <div className="flex items-center gap-2 text-right">
          <div>
            <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-blue-800 font-['Cairo']">
              <span>تذكير</span>
              <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <Lightbulb className="w-2.5 h-2.5" />
              </div>
            </div>
            <p className="text-[10px] md:text-[11px] text-slate-700 font-semibold mt-0.5">
              هناك 3 زبائن لديهم ديون مستحقة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
