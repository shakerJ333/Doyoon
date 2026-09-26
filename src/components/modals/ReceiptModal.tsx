import React from 'react';
import { X, Printer, Share2, CheckCircle2, Store } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReceiptModal: React.FC = () => {
  const { selectedReceipt, store, currency, closeModal } = useApp();

  if (!selectedReceipt) return null;

  const isSale = selectedReceipt.type === 'sale';
  const isCollection = selectedReceipt.type === 'collection';
  const isPurchase = selectedReceipt.type === 'purchase';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-3xl w-full max-w-sm p-4 md:p-5 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header Actions */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-slate-500 font-['Cairo']">
            سند العملية المالي
          </span>
        </div>

        {/* Thermal Receipt Paper Layout */}
        <div className="mt-3 p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center space-y-2.5 font-['Cairo']">
          {/* Store Logo/Name */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mb-1 shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-slate-900">{store.name}</h4>
            <span className="text-[10px] text-slate-500">{store.branch}</span>
            <span className="text-[10px] text-slate-500">هاتف: {store.phone}</span>
          </div>

          <div className="border-b border-dashed border-slate-300 my-1.5" />

          {/* Transaction Metadata */}
          <div className="text-xs text-slate-700 space-y-1 text-right">
            <div className="flex justify-between">
              <span className="font-mono text-slate-500">{selectedReceipt.invoiceNumber || 'TX-901'}</span>
              <span className="font-bold">رقم السند:</span>
            </div>
            <div className="flex justify-between">
              <span>{selectedReceipt.date} - {selectedReceipt.time}</span>
              <span className="font-bold">التاريخ:</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-blue-700">{selectedReceipt.partyName}</span>
              <span className="font-bold">
                {isPurchase ? 'المورد:' : 'الزبون:'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-700 font-bold">
                {isSale ? 'فاتورة مبيعات' : isCollection ? 'سند قبض / تحصيل' : 'فاتورة مشتريات'}
              </span>
              <span className="font-bold">النوع:</span>
            </div>
          </div>

          {/* Items if available */}
          {selectedReceipt.items && selectedReceipt.items.length > 0 && (
            <>
              <div className="border-b border-dashed border-slate-300 my-1.5" />
              <div className="space-y-1 text-right text-xs">
                <div className="flex justify-between font-bold text-slate-500 pb-1 text-[11px]">
                  <span>المجموع</span>
                  <span>الكمية × السعر</span>
                  <span>الصنف</span>
                </div>
                {selectedReceipt.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-slate-800 text-[11px]">
                    <span className="font-bold">{(it.quantity * it.price).toFixed(2)}</span>
                    <span className="text-slate-500">{it.quantity} × {it.price.toFixed(2)}</span>
                    <span className="font-medium truncate max-w-[120px]">{it.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="border-b border-dashed border-slate-300 my-1.5" />

          {/* Total */}
          <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-1">
            <span className="text-base text-blue-700 font-bold">
              {Math.abs(selectedReceipt.amount).toFixed(2)} {currency}
            </span>
            <span>المبلغ الإجمالي:</span>
          </div>

          <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-700 font-bold pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>العملية مؤكدة ومقيدة بالدفاتر المحاسبية</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 font-['Cairo'] transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة السند</span>
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `سند ${store.name}`,
                  text: `سند بقيمة ${Math.abs(selectedReceipt.amount).toFixed(2)} ${currency} - ${selectedReceipt.partyName}`,
                }).catch(() => {});
              } else {
                alert('تم نسخ تفاصيل السند إلى الحافظة');
              }
            }}
            className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
            title="مشاركة السند"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
