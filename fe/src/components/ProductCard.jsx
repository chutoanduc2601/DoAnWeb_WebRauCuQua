import React from 'react';
import { motion } from 'framer-motion';
import { Eye, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product, onAdd, onClick }) => {
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
          <div className="absolute top-3 left-3 z-10 bg-[#8cc63f] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            {product.badge}
          </div>
        )}

        {/* Action Buttons (Center Box) */}
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-lg flex items-center border border-slate-50 overflow-hidden">
            <button 
              onClick={(e) => { e.stopPropagation(); onAdd(product); }}
              className="p-3 hover:bg-slate-50 text-[#8cc63f] border-r border-slate-100 transition-colors"
            >
              <ShoppingBag size={22} />
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

      {/* Info Area (Centered like requested) */}
      <div className="p-4 flex flex-col items-center text-center flex-1">
        <h3 className="font-bold text-slate-700 mb-4 text-sm sm:text-base line-clamp-2">
          {product.name}
        </h3>
        
        <div className="mt-auto">
          <div className="text-[#8cc63f] font-bold text-lg">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
