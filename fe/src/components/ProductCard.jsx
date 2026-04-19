import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus } from 'lucide-react';

const ProductCard = ({ product, onAdd, onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group cursor-pointer"
      onClick={() => onClick(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
        {product.badge && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-brand-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md mb-2">
            {product.badge}
          </div>
        )}
        <button 
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full bg-white/70 backdrop-blur-sm text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          onClick={(e) => { e.stopPropagation(); /* like logic */ }}
        >
          <Heart size={14} className="sm:w-[18px] sm:h-[18px]" />
        </button>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5">
        <div className="flex gap-1 mb-1.5 sm:mb-2 flex-wrap">
          {product.categories.map((cat, idx) => (
            <span key={idx} className="text-[8px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-sm">
              {cat}
            </span>
          ))}
        </div>
        <h3 className="font-bold text-sm sm:text-lg text-slate-900 mb-1 group-hover:text-brand-600 transition-colors line-clamp-1">{product.name}</h3>
        
        <div className="flex items-end justify-between mt-2 sm:mt-4">
          <div>
            <span className="text-base sm:text-xl font-extrabold text-brand-600">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </span>
            <span className="text-xs sm:text-sm text-slate-500 ml-0.5 sm:ml-1">{product.unit}</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onAdd(product); }}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors flex-shrink-0"
            title="Thêm nhanh"
          >
            <Plus size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
