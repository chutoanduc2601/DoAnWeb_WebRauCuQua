import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Check } from 'lucide-react';

const ProductDetail = ({ product, isOpen, onClose, onAddToCart }) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
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
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Image Gallery */}
            <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-slate-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <div className="absolute top-6 left-6 bg-brand-500 text-white px-3 py-1 text-sm font-bold rounded-lg shadow-sm">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/2 p-8 md:p-10 overflow-y-auto">
              <div className="flex gap-2 mb-4">
                {product.categories.map((cat, idx) => (
                  <span key={idx} className="text-xs uppercase font-bold tracking-wider text-brand-700 bg-brand-50 px-2 py-1 rounded-md">
                    {cat}
                  </span>
                ))}
              </div>
              
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h2>
              <div className="text-3xl font-extrabold text-brand-600 mb-6">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                <span className="text-base font-medium text-slate-500 ml-1">{product.unit}</span>
              </div>
              
              <p className="text-slate-600 leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Nutrition Facts Tablet */}
              <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Check size={18} className="text-brand-500"/> Nutrition Facts (100g)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Calories</span>
                    <span className="font-semibold text-slate-800">{product.nutrition.calories}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Protein</span>
                    <span className="font-semibold text-slate-800">{product.nutrition.protein}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Carbs</span>
                    <span className="font-semibold text-slate-800">{product.nutrition.carbs}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Fat</span>
                    <span className="font-semibold text-slate-800">{product.nutrition.fat}</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button 
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/30 hover:-translate-y-1"
              >
                <ShoppingBag size={22} />
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
