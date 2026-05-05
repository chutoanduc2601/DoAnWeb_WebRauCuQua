import React from 'react';

const PromotionFilter = ({ activeCategory, onSelectCategory }) => {
  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'ship', label: 'Voucher Ship' },
    { id: 'discount', label: 'Voucher Giảm giá' },
    { id: 'combo', label: 'Voucher Combo' },
  ];

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`
                px-5 py-2 rounded-xl font-bold text-sm sm:text-base transition-all
                ${isActive 
                  ? 'bg-forest-green text-white shadow-sm' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}
              `}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PromotionFilter;
