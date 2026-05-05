import React, { useState, useRef } from 'react';

const PromotionCard = ({ promotion }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(promotion.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatVND = (n) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  const isPercent = promotion.type === 'PERCENT';
  const fallbackBg = "linear-gradient(135deg, #064e3b 0%, #10b981 100%)";

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full">
      {/* Visual Header */}
      <div 
        className="h-32 sm:h-40 w-full bg-cover bg-center"
        style={{ 
          backgroundImage: promotion.imageUrl ? `url(${promotion.imageUrl})` : fallbackBg,
          backgroundColor: '#064e3b'
        }}
      >
        <div className="absolute top-3 left-3">
          <div className="bg-coral-sale text-white px-3 py-1 rounded-lg font-bold text-xs shadow-sm">
            {isPercent ? `${promotion.value}% GIẢM` : `-${formatVND(promotion.value)}`}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1 truncate">
          {promotion.name}
        </h3>
        <p className="text-slate-500 text-xs mb-4 line-clamp-2">
          {promotion.description || `Đơn tối thiểu ${formatVND(promotion.minOrderAmount)}`}
        </p>

        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-2 flex items-center justify-between w-full">
              <span className="font-mono font-bold tracking-wider text-forest-green dark:text-lime-green">
                {promotion.code}
              </span>
              <button 
                onClick={handleCopy}
                className={`
                  ml-4 px-3 py-1 rounded-lg text-xs font-bold transition-all
                  ${copied ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300'}
                `}
              >
                {copied ? 'ĐÃ LƯU' : 'SAO CHÉP'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Đơn từ {formatVND(promotion.minOrderAmount)}</span>
            <span>Hết hạn: {new Date(promotion.endDate).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionCard;
