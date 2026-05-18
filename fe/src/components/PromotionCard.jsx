import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Clock, ShoppingBag, Truck, Tag } from 'lucide-react';

const PromotionCard = ({ promotion }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(promotion.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formatVND = (n) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  const isPercent = promotion.type === 'PERCENT';
  const daysLeft = Math.ceil((new Date(promotion.endDate) - new Date()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysLeft <= 3;

  // Category-based colors
  const getCatStyle = () => {
    if (promotion.category === 'SHIP') return {
      gradient: 'from-blue-600 via-blue-500 to-cyan-500',
      light: 'bg-blue-50 text-blue-700 border-blue-100',
      badge: 'bg-blue-500',
      icon: <Truck size={14} />,
      label: 'Miễn phí ship',
    };
    if (promotion.category === 'COMBO') return {
      gradient: 'from-purple-600 via-purple-500 to-violet-500',
      light: 'bg-purple-50 text-purple-700 border-purple-100',
      badge: 'bg-purple-500',
      icon: <ShoppingBag size={14} />,
      label: 'Combo deal',
    };
    return {
      gradient: 'from-emerald-600 via-emerald-500 to-teal-500',
      light: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      badge: 'bg-emerald-500',
      icon: <Tag size={14} />,
      label: 'Giảm giá',
    };
  };

  const cat = getCatStyle();

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 20px 40px -8px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col h-full"
    >
      {/* Gradient header */}
      <div className={`relative bg-gradient-to-br ${cat.gradient} p-5 pb-8`}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-10 flex items-start justify-between gap-3">
          {/* Discount badge */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
            <p className="text-white/70 text-xs font-semibold mb-0.5">Giảm ngay</p>
            <p className="text-white text-xl font-black">
              {isPercent ? `${promotion.value}%` : formatVND(promotion.value)}
            </p>
          </div>

          {/* Category tag */}
          <span className="flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg border border-white/20">
            {cat.icon} {cat.label}
          </span>
        </div>

        {/* Promotion name */}
        <h3 className="relative z-10 text-white font-bold text-base mt-4 leading-snug line-clamp-2">
          {promotion.name}
        </h3>
      </div>

      {/* Notch divider */}
      <div className="relative h-0 flex items-center">
        <div className="absolute left-0 w-5 h-5 bg-slate-50 rounded-full -translate-y-1/2 -translate-x-1/2 border-r border-slate-100" />
        <div className="flex-1 mx-5 border-t border-dashed border-slate-200" />
        <div className="absolute right-0 w-5 h-5 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 border-l border-slate-100" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 pt-4">
        {/* Description */}
        {promotion.description && (
          <p className="text-slate-500 text-xs mb-3 line-clamp-2 leading-relaxed">
            {promotion.description}
          </p>
        )}

        {/* Min order */}
        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border w-fit mb-4 ${cat.light}`}>
          <ShoppingBag size={12} />
          Đơn từ {formatVND(promotion.minOrderAmount)}
        </div>

        {/* Code copy row */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
            <span className="font-mono font-bold tracking-widest text-emerald-700 text-sm flex-1">
              {promotion.code}
            </span>
            <motion.button
              onClick={handleCopy}
              whileTap={{ scale: 0.92 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-600'
              }`}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Check size={13} /> Đã lưu
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Copy size={13} /> Sao chép
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Expiry */}
          <div className={`flex items-center gap-1.5 mt-2.5 text-xs font-medium ${isUrgent ? 'text-red-500' : 'text-slate-400'}`}>
            <Clock size={12} className={isUrgent ? 'animate-pulse' : ''} />
            {isUrgent
              ? `⚡ Còn ${daysLeft} ngày — nhanh tay nào!`
              : `Hết hạn: ${new Date(promotion.endDate).toLocaleDateString('vi-VN')}`}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PromotionCard;
