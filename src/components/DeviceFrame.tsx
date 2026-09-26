import React from 'react';
import { Smartphone, Tablet, Monitor, Wifi, Battery, Signal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DeviceMode } from '../types';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { deviceMode, setDeviceMode } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start p-0 sm:p-3 md:p-6 select-none">
      {/* Device Mode Switcher Floating Bar */}
      <header className="sticky top-2 z-40 my-2 bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md border border-slate-700/80 rounded-full px-2.5 py-1.5 shadow-2xl flex items-center gap-1.5 text-white max-w-full overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-slate-300 font-['Cairo'] hidden sm:inline px-1">
          شاشات العرض:
        </span>

        {/* iPhone Option */}
        <button
          onClick={() => setDeviceMode('iphone')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer font-['Cairo'] shrink-0 ${
            deviceMode === 'iphone'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>آيفون (iPhone)</span>
        </button>

        {/* Android Option */}
        <button
          onClick={() => setDeviceMode('android')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer font-['Cairo'] shrink-0 ${
            deviceMode === 'android'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>أندرويد (Android)</span>
        </button>

        {/* Tablet Option */}
        <button
          onClick={() => setDeviceMode('tablet')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer font-['Cairo'] shrink-0 ${
            deviceMode === 'tablet'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>تابلت (iPad)</span>
        </button>

        {/* Fullscreen Responsive */}
        <button
          onClick={() => setDeviceMode('responsive')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer font-['Cairo'] shrink-0 ${
            deviceMode === 'responsive'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>هاتف كامل</span>
        </button>
      </header>

      {/* Frame Container */}
      <div className="w-full flex justify-center items-start flex-1">
        {deviceMode === 'iphone' && (
          /* Realistic iPhone 15 Pro Frame matching the uploaded image */
          <div className="relative w-full max-w-[428px] sm:rounded-[50px] sm:p-[10px] sm:bg-gradient-to-b sm:from-slate-400 sm:via-slate-600 sm:to-slate-800 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.2)] sm:border-2 sm:border-slate-700/60 ring-1 ring-black/40">
            {/* Screen Inner Shell */}
            <div className="relative bg-[#f8fafc] sm:rounded-[42px] overflow-hidden flex flex-col min-h-screen sm:min-h-[860px] sm:max-h-[92vh] shadow-inner">
              {/* iPhone Status Bar (9:41, Dynamic Island, Wifi, Signal, Battery) */}
              <div className="relative z-30 bg-[#1b5cb8] text-white pt-2.5 pb-1 px-6 flex items-center justify-between text-xs font-semibold select-none">
                {/* Left: Time (9:41) */}
                <span className="font-bold text-[13px] tracking-tight">9:41</span>

                {/* Center: Dynamic Island */}
                <div className="w-24 h-6 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 shadow-sm transform -translate-y-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-950/80 border border-blue-900" />
                </div>

                {/* Right: Signal, Wifi, Battery */}
                <div className="flex items-center gap-1.5">
                  <Signal className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <Wifi className="w-3.5 h-3.5" strokeWidth={2.5} />
                  {/* Battery Icon */}
                  <div className="w-5 h-2.5 border border-white rounded-[4px] p-0.5 flex items-center">
                    <div className="w-full h-full bg-white rounded-[2px]" />
                  </div>
                </div>
              </div>

              {/* Scrollable App Body */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar bg-slate-50">
                {children}
              </div>

              {/* iPhone Bottom Home Bar Indicator */}
              <div className="bg-[#0f1c34] pt-1 pb-2 flex justify-center items-center">
                <div className="w-32 h-1 bg-slate-500/80 rounded-full" />
              </div>
            </div>
          </div>
        )}

        {deviceMode === 'android' && (
          /* Realistic Android Smartphone Frame */
          <div className="relative w-full max-w-[420px] sm:rounded-[42px] sm:p-[8px] sm:bg-gradient-to-b sm:from-zinc-700 sm:via-zinc-800 sm:to-zinc-900 sm:shadow-2xl sm:border-2 sm:border-zinc-600">
            <div className="relative bg-[#f8fafc] sm:rounded-[36px] overflow-hidden flex flex-col min-h-screen sm:min-h-[860px] sm:max-h-[92vh]">
              {/* Android Status Bar with centered punch-hole camera */}
              <div className="relative z-30 bg-[#1b5cb8] text-white pt-2 pb-1 px-6 flex items-center justify-between text-xs select-none">
                <span className="font-bold text-[12px]">09:41</span>
                {/* Punch-hole camera */}
                <div className="w-3.5 h-3.5 rounded-full bg-black border border-zinc-800" />
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span>88%</span>
                  <Battery className="w-3.5 h-3.5" />
                  <Wifi className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* App Body */}
              <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50">
                {children}
              </div>

              {/* Android Bottom Navigation Line */}
              <div className="bg-[#0f1c34] py-1.5 flex justify-center items-center">
                <div className="w-20 h-1 bg-slate-400 rounded-full" />
              </div>
            </div>
          </div>
        )}

        {deviceMode === 'tablet' && (
          /* Realistic Tablet / iPad Frame */
          <div className="relative w-full max-w-4xl sm:rounded-[40px] sm:p-[14px] sm:bg-gradient-to-b sm:from-slate-600 sm:via-slate-700 sm:to-slate-800 sm:shadow-2xl sm:border-4 sm:border-slate-500">
            <div className="relative bg-[#f8fafc] sm:rounded-[30px] overflow-hidden flex flex-col min-h-screen sm:min-h-[820px] sm:max-h-[92vh]">
              {/* Tablet Top Bar */}
              <div className="relative z-30 bg-[#1b5cb8] text-white pt-2 pb-1 px-8 flex items-center justify-between text-xs select-none">
                <span className="font-bold">09:41 AM - iPad Pro</span>
                {/* Top Camera Sensor */}
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
                <div className="flex items-center gap-2">
                  <Signal className="w-3.5 h-3.5" />
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="font-bold">100%</span>
                </div>
              </div>

              {/* Scrollable Tablet Layout */}
              <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50">
                <div className="max-w-2xl mx-auto">{children}</div>
              </div>
            </div>
          </div>
        )}

        {deviceMode === 'responsive' && (
          /* Clean full mobile frame */
          <div className="w-full max-w-[430px] bg-white sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col min-h-screen sm:min-h-[860px] sm:max-h-[94vh]">
            <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
