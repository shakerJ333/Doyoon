import React, { useState } from 'react';
import { X, Store, Check, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StoreSwitcherModal: React.FC = () => {
  const { store, updateStore, closeModal } = useApp();

  const [branches, setBranches] = useState([
    { id: 'store-1', name: 'متجر الأمل التجاري', branch: 'الفرع الرئيسي - شارع الملك فيصل' },
    { id: 'store-2', name: 'متجر الأمل للمواد التموينية', branch: 'فرع الجبيهة - قرب الدوار' },
    { id: 'store-3', name: 'مستودع الأمل المركزي', branch: 'المنطقة الصناعية' },
  ]);

  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreBranch, setNewStoreBranch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSelect = (b: { id: string; name: string; branch: string }) => {
    updateStore({ name: b.name, branch: b.branch });
    closeModal();
  };

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim()) return;
    const newB = {
      id: 'store-' + Date.now(),
      name: newStoreName.trim(),
      branch: newStoreBranch.trim() || 'فرع جديد',
    };
    setBranches((prev) => [...prev, newB]);
    updateStore({ name: newB.name, branch: newB.branch });
    setShowAddForm(false);
    setNewStoreName('');
    setNewStoreBranch('');
    closeModal();
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
              اختيار المتجر أو الفرع
            </h3>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Branches list */}
        <div className="mt-4 space-y-2">
          {branches.map((b) => {
            const isSelected = store.name === b.name;
            return (
              <div
                key={b.id}
                onClick={() => handleSelect(b)}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50 border-blue-500 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-6 h-6" />
                )}

                <div className="text-right">
                  <h4 className="text-xs md:text-sm font-bold text-slate-900 font-['Cairo']">
                    {b.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{b.branch}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Branch Section */}
        {showAddForm ? (
          <form onSubmit={handleAddBranch} className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <input
              type="text"
              required
              placeholder="اسم المتجر / الفرع الجديد"
              value={newStoreName}
              onChange={(e) => setNewStoreName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-right font-['Cairo']"
            />
            <input
              type="text"
              placeholder="العنوان أو الحي"
              value={newStoreBranch}
              onChange={(e) => setNewStoreBranch(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-right font-['Cairo']"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-xs font-bold"
              >
                إضافة وتحديد
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
              >
                إلغاء
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full mt-3 py-2 border border-dashed border-blue-300 text-blue-600 hover:bg-blue-50/50 rounded-xl text-xs font-bold flex items-center justify-center gap-1 font-['Cairo'] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة فرع أو نقطة بيع جديدة</span>
          </button>
        )}
      </div>
    </div>
  );
};
