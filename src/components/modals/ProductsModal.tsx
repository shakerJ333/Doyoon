import React, { useState } from 'react';
import { X, Package, Plus, Search, Edit2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProductsModal: React.FC = () => {
  const { products, currency, addProduct, updateProductStock, closeModal } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New product form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('المواد الغذائية');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('قطعة');

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProduct({
      name: name.trim(),
      barcode: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      category,
      purchasePrice: parseFloat(purchasePrice) || 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      stock: parseInt(stock, 10) || 0,
      unit,
    });

    setIsAddingNew(false);
    setName('');
    setPurchasePrice('');
    setSellingPrice('');
    setStock('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-4 md:p-5 shadow-2xl animate-in fade-in duration-200">
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
              إدارة المنتجات والمخزون
            </h3>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 font-['Cairo']"
          >
            <Plus className="w-4 h-4" />
            <span>{isAddingNew ? 'إلغاء' : 'منتج جديد'}</span>
          </button>

          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث في قائمة المنتجات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs font-['Cairo'] text-right focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Add Product Form Drawer */}
        {isAddingNew && (
          <form
            onSubmit={handleCreateProduct}
            className="mt-3 p-3 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2.5"
          >
            <h4 className="text-xs font-bold text-amber-900 font-['Cairo'] text-right">
              إضافة منتج جديد للمستودع
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="اسم المنتج"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-right font-['Cairo']"
              />
              <input
                type="text"
                placeholder="التصنيف (مثال: ألبان)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-right font-['Cairo']"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="سعر الشراء"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-right font-['Cairo']"
              />
              <input
                type="number"
                placeholder="سعر البيع"
                required
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className="bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-right font-['Cairo'] font-bold text-blue-700"
              />
              <input
                type="number"
                placeholder="الكمية المتوفرة"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-right font-['Cairo']"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded-lg text-xs font-['Cairo'] flex items-center justify-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>إدراج في قائمة المخزون</span>
            </button>
          </form>
        )}

        {/* Product List */}
        <div className="mt-3 space-y-2 max-h-96 overflow-y-auto">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between"
            >
              {/* Left: Prices & Stock */}
              <div className="text-left flex items-center gap-2">
                <div>
                  <span className="text-xs md:text-sm font-black text-slate-900 block font-['Cairo']">
                    {p.sellingPrice.toFixed(2)} {currency}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    تكلفة: {p.purchasePrice.toFixed(2)} {currency}
                  </span>
                </div>

                {/* Stock Editor */}
                <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs">
                  <button
                    onClick={() => updateProductStock(p.id, p.stock - 1)}
                    className="text-slate-500 font-bold px-1 hover:text-red-600"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-blue-700 min-w-5 text-center">
                    {p.stock}
                  </span>
                  <button
                    onClick={() => updateProductStock(p.id, p.stock + 1)}
                    className="text-slate-500 font-bold px-1 hover:text-emerald-600"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Right: Info */}
              <div className="text-right">
                <h4 className="text-xs md:text-sm font-bold text-slate-800 font-['Cairo']">
                  {p.name}
                </h4>
                <div className="flex items-center justify-end gap-2 text-[10px] text-slate-500 mt-0.5">
                  <span>{p.category}</span>
                  <span>•</span>
                  <span>الوحدة: {p.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
