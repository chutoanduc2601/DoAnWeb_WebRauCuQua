import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Check } from 'lucide-react';

const ProductDetail = ({ product, isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setQuantity(product.unit === 'kg' ? 0.5 : 1);
    }
  }, [product, isOpen]);

  if (!product) return null;

  return (
      <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
              {/* Backdrop */}
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                  onClick={onClose}
              />

              {/* Modal Content */}
              <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.95 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="relative w-full sm:max-w-4xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] sm:max-h-[90vh]"
              >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <X size={18} className="sm:w-5 sm:h-5" />
                </button>

                {/* Image Gallery */}
                <div className="w-full md:w-1/2 h-48 sm:h-64 md:h-auto relative bg-slate-100 flex-shrink-0">
                  <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                  />
                  {product.badge && (
                      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-brand-500 text-white px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-bold rounded-lg shadow-sm">
                        {product.badge}
                      </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-10 overflow-y-auto flex-1">
                  <div className="flex gap-2 mb-3 sm:mb-4 flex-wrap">
                    {product.categories.map((cat, idx) => (
                        <span key={idx} className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-brand-700 bg-brand-50 px-2 py-1 rounded-md">
                    {cat}
                  </span>
                    ))}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{product.name}</h2>
                  <div className="text-2xl sm:text-3xl font-extrabold text-brand-600 mb-4 sm:mb-6">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    <span className="text-sm sm:text-base font-medium text-slate-500 ml-1">{product.unit}</span>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 sm:mb-8">
                    {product.description}
                  </p>

                  {/* Nutrition Facts Tablet */}
                  <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                      <Check size={16} className="text-brand-500 sm:w-[18px] sm:h-[18px]"/> Nutrition Facts (100g)
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                        <span className="text-slate-500">Calories</span>
                        <span className="font-semibold text-slate-800">{product.nutrition?.calories}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                        <span className="text-slate-500">Protein</span>
                        <span className="font-semibold text-slate-800">{product.nutrition?.protein}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                        <span className="text-slate-500">Carbs</span>
                        <span className="font-semibold text-slate-800">{product.nutrition?.carbs}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                        <span className="text-slate-500">Fat</span>
                        <span className="font-semibold text-slate-800">{product.nutrition?.fat}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity/Weight Selection */}
                  <div className="mb-8">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      Số lượng / Khối lượng
                    </h3>

                    {product.unit === 'kg' ? (
                        <div className="grid grid-cols-4 gap-2 items-center">
                          {[0.2, 0.5, 1].map(w => (
                              <button
                                  key={w}
                                  onClick={() => setQuantity(w)}
                                  className={`py-2 rounded-xl border-2 font-bold transition-all text-sm sm:text-base ${
                                      quantity === w
                                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                                          : 'border-slate-100 hover:border-slate-200 text-slate-500'
                                  }`}
                              >
                                {w < 1 ? `${w * 1000}g` : `${w}kg`}
                              </button>
                          ))}
                          <div className="relative flex items-center col-span-1 h-full">
                            <input
                                type="number"
                                min="0"
                                placeholder="Khác"
                                value={quantity ? Math.round(quantity * 1000) : ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '') {
                                        setQuantity('');
                                    } else {
                                        setQuantity(Math.max(0, parseInt(val)) / 1000);
                                    }
                                }}
                                className={`w-full h-full py-2 pr-5 pl-1 sm:pr-6 sm:pl-2 border-2 rounded-xl text-center font-bold text-sm sm:text-base focus:outline-none transition-all ${
                                    ![0.2, 0.5, 1].includes(quantity) && quantity !== '' && quantity !== 0
                                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                                        : 'border-slate-100 hover:border-slate-200 text-slate-700 focus:border-brand-500'
                                }`}
                            />
                            <span className="absolute right-1 sm:right-2 text-slate-400 font-medium text-xs sm:text-sm pointer-events-none">g</span>
                          </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 sm:gap-4">
                          <button
                              onClick={() => setQuantity(Math.max(1, (quantity || 1) - 1))}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-slate-100 flex items-center justify-center font-bold text-lg sm:text-xl hover:bg-slate-50 transition-colors"
                          >
                            -
                          </button>
                          <input
                              type="number"
                              min="1"
                              value={quantity || ''}
                              onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === '') {
                                      setQuantity('');
                                  } else {
                                      setQuantity(Math.max(1, parseInt(val)));
                                  }
                              }}
                              className="w-16 h-10 sm:w-20 sm:h-12 border-2 border-slate-100 rounded-xl text-center font-bold text-lg sm:text-xl focus:border-brand-500 focus:outline-none transition-colors"
                          />
                          <button
                              onClick={() => setQuantity((quantity || 0) + 1)}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-slate-100 flex items-center justify-center font-bold text-lg sm:text-xl hover:bg-slate-50 transition-colors"
                          >
                            +
                          </button>
                          <span className="text-slate-500 font-medium text-sm sm:text-base">{product.unit}</span>
                        </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-8 p-4 bg-brand-50 rounded-2xl border border-brand-100">
                    <span className="font-bold text-brand-800">Tổng cộng:</span>
                    <span className="text-2xl font-black text-brand-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price * quantity)}
                </span>
                  </div>

                  {/* CTA */}
                  <button
                      onClick={() => {
                        onAddToCart({ ...product, quantity });
                        onClose();
                      }}
                      className="w-full py-3.5 sm:py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/30 hover:-translate-y-1"
                  >
                    <ShoppingBag size={20} className="sm:w-[22px] sm:h-[22px]" />
                    Thêm Vào Giỏ Hàng
                  </button>
                </div>

              </motion.div>
            </div>
        )}
      </AnimatePresence>
  );
};

export default ProductDetail;
