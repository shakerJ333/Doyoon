import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2, ShoppingCart, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NewSaleModal: React.FC = () => {
  const { customers, products, currency, addTransaction, addCustomerDebt, closeModal } = useApp();

  const [customerName, setCustomerName] = useState<string>('زبون نقدي');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash');
  const [items, setItems] = useState<Array<{ name: string; quantity: number; price: number }>>([
    { name: 'أرز بسمتي فاخر (5 كغم)', quantity: 1, price: 35.0 },
  ]);

  const handleAddItem = (productName: string, price: number) => {
    setItems((prev) => [...prev, { name: productName, quantity: 1, price }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, qty: number) => {
    if (qty <= 0) return;
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: qty } : item))
    );
  };

  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalAmount <= 0) return;

    const party = selectedCustomerId
      ? customers.find((c) => c.id === selectedCustomerId)?.name || customerName
      : customerName;

    // Add transaction
    addTransaction({
      type: 'sale',
      title: 'فاتورة مبيعات',
      partyName: party,
      amount: totalAmount,
      date: 'اليوم',
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentMethod,
      items,
    });

    // If on credit, add debt to customer
    if (paymentMethod === 'credit' && selectedCustomerId) {
      addCustomerDebt(selectedCustomerId, totalAmount, 'فاتورة مبيعات مؤجلة');
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-4 md:p-5 shadow-2xl animate-in fade-in duration-200">
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
              إنشاء فاتورة مبيعات جديدة
            </h3>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Customer Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 text-right font-['Cairo']">
              الزبون:
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                const cust = customers.find((c) => c.id === e.target.value);
                if (cust) setCustomerName(cust.name);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm font-['Cairo'] text-right focus:outline-none focus:border-blue-500"
            >
              <option value="">زبون نقدي مباشر</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.totalDebt > 0 ? `(عليه دين: ${c.totalDebt} ${currency})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 text-right font-['Cairo']">
              طريقة الدفع:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 px-3 rounded-xl text-xs font-bold font-['Cairo'] border transition-all cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                نقداً (كاش)
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('credit')}
                className={`py-2 px-3 rounded-xl text-xs font-bold font-['Cairo'] border transition-all cursor-pointer ${
                  paymentMethod === 'credit'
                    ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                آجل (ذمة / دين)
              </button>
            </div>
          </div>

          {/* Quick Product Pick */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 text-right font-['Cairo']">
              إضافة منتج من المخزن سريعاً:
            </label>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
              {products.slice(0, 4).map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => handleAddItem(p.name, p.sellingPrice)}
                  className="shrink-0 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200/80 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>{p.name.split(' ')[0]} ({p.sellingPrice} {currency})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Items List */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 text-right font-['Cairo']">
              بنود الفاتورة:
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">
                      {(item.quantity * item.price).toFixed(2)} {currency}
                    </span>
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-1.5 py-0.5">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(idx, item.quantity - 1)}
                        className="text-slate-500 font-bold px-1"
                      >
                        -
                      </button>
                      <span className="font-bold px-1">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(idx, item.quantity + 1)}
                        className="text-slate-500 font-bold px-1"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <span className="font-bold text-slate-800 truncate max-w-[140px] text-right">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total & Submit */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all text-xs font-['Cairo'] cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>حفظ الفاتورة</span>
            </button>

            <div className="text-right">
              <span className="text-[11px] text-slate-500 font-bold block">
                الإجمالي المستحق
              </span>
              <span className="text-lg font-black text-slate-900 font-['Cairo']">
                {totalAmount.toFixed(2)} {currency}
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
