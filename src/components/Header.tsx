import React from 'react';
import { Bell, Settings, ChevronDown, Store } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StoreGraphic } from './StoreGraphic';

export const Header: React.FC = () => {
  const { store, unreadNotificationCount, openModal } = useApp();

  return (
    <header className="relative bg-gradient-to-b from-[#1b5cb8] via-[#164da3] to-[#124294] text-white pt-2.5 pb-4 px-3.5 sm:px-5 rounded-b-[28px] shadow-lg shadow-blue-950/20 overflow-hidden select-none">
      {/* Decorative ambient background sparkles/glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 -left-12 w-36 h-36 bg-sky-300/15 rounded-full blur-xl pointer-events-none" />

      {/* Top action bar: Settings, Bell, Title, Store 3D Graphic */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        {/* Left Side: Notification & Settings buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Notifications Bell */}
          <button
            onClick={() => openModal('notifications')}
            className="relative w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition-all flex items-center justify-center text-white backdrop-blur-md shadow-xs border border-white/20 cursor-pointer"
            title="الإشعارات"
            aria-label="الإشعارات"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#ef4444] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md border border-white">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Settings Gear */}
          <button
            onClick={() => openModal('settings')}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition-all flex items-center justify-center text-white backdrop-blur-md shadow-xs border border-white/20 cursor-pointer"
            title="الإعدادات"
            aria-label="الإعدادات"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Center & Right: Title, Subtitle, and 3D Store Graphic */}
        <div className="flex-1 flex items-center justify-end gap-2 text-right">
          <div className="flex flex-col items-end">
            <h1 className="text-base sm:text-lg font-black text-white tracking-tight drop-shadow-xs font-['Cairo'] leading-tight">
              إدارة المُشتريات والديون
            </h1>
            <p className="text-[10px] sm:text-xs text-blue-100/90 font-medium mt-0.5">
              كل ما تحتاجه لإدارة عملك في مكان واحد
            </p>
          </div>

          {/* 3D Store Graphic */}
          <div className="shrink-0 transform hover:scale-105 transition-transform">
            <StoreGraphic size="sm" className="w-11 h-11 sm:w-13 sm:h-13" />
          </div>
        </div>
      </div>

      {/* Store Selector Dropdown Button */}
      <div className="relative z-10 mt-2.5 flex justify-center">
        <button
          onClick={() => openModal('store_switcher')}
          className="w-full bg-white hover:bg-slate-50 text-slate-800 rounded-full px-3.5 py-1.5 flex items-center justify-between shadow-sm active:scale-[0.99] transition-all border border-blue-100 cursor-pointer"
        >
          {/* Dropdown Chevron Arrow */}
          <div className="text-slate-400 p-0.5 flex items-center">
            <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
          </div>

          {/* Store Name & Store Icon */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs sm:text-sm text-slate-800 tracking-tight font-['Cairo'] truncate max-w-[210px] sm:max-w-none">
              {store.name}
            </span>
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Store className="w-3.5 h-3.5" />
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};
