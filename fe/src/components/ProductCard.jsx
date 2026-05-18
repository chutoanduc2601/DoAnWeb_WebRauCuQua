import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ShoppingBag, Check } from 'lucide-react';

const ProductCard = ({ product, onAdd, onClick }) => {
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 group flex flex-col h-full"
    >
      {/* Image Area */}
      <div className="relative aspect-square overflow-hidden bg-white flex items-center justify-center p-2">
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10 bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            {product.badge}
          </div>
        )}

        {/* Action Buttons (Center Box) */}
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-lg flex items-center border border-slate-50 overflow-hidden">
            <button 
              onClick={handleAdd}
              className={`p-3 transition-colors border-r border-slate-100 ${added ? 'bg-emerald-50 text-emerald-500' : 'hover:bg-slate-50 text-brand-600'}`}
            >
              {added ? <Check size={22} className="animate-bounce" /> : <ShoppingBag size={22} />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onClick(product); }}
              className="p-3 hover:bg-slate-50 text-slate-400 transition-colors"
            >
              <Eye size={22} />
            </button>
          </div>
        </div>

        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Info Area */}
      <div className="p-4 flex flex-col items-center text-center flex-1">
        <h3 className="font-bold text-slate-700 mb-4 text-sm sm:text-base line-clamp-2">
          {product.name}
        </h3>
        
        <div className="mt-auto">
          <div className="text-brand-600 font-extrabold text-lg">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
