import React from 'react';
import { X, Bell, CheckCheck, AlertTriangle, Package, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationsModal: React.FC = () => {
  const { notifications, markNotificationsAsRead, closeModal } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'debt':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'stock':
        return <Package className="w-4 h-4 text-rose-600" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-3xl w-full max-w-md p-4 md:p-5 shadow-2xl animate-in fade-in duration-200">
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
              مركز الإشعارات والتنبيهات
            </h3>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="mt-3 flex items-center justify-between text-xs pb-1">
          <button
            onClick={markNotificationsAsRead}
            className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer font-['Cairo']"
          >
            <CheckCheck className="w-4 h-4" />
            <span>تحديد الكل كمقروء</span>
          </button>
          <span className="text-slate-500 font-bold font-['Cairo']">
            {notifications.length} إشعارات
          </span>
        </div>

        {/* Notifications list */}
        <div className="mt-2 space-y-2 max-h-80 overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-2xl border transition-all text-right ${
                n.isRead
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-blue-50/50 border-blue-200 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] text-slate-400 font-medium">
                  {n.time}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 font-['Cairo']">
                    {n.title}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-white shadow-xs flex items-center justify-center shrink-0">
                    {getIcon(n.type)}
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug font-medium">
                {n.message}
              </p>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <div className="mt-4 pt-2 border-t border-slate-100">
          <button
            onClick={closeModal}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs font-['Cairo'] transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
