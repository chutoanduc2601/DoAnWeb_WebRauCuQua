import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Tag, Truck, Layers, Sparkles } from 'lucide-react';
import PromotionCard from './PromotionCard';
import { API_BASE_URL } from '../config';
import PromotionBanner from './PromotionBanner';

const CATEGORIES = [
  { id: 'all',      label: 'Tất cả',          icon: <Sparkles size={15} /> },
  { id: 'ship',     label: 'Miễn phí ship',    icon: <Truck size={15} /> },
  { id: 'discount', label: 'Giảm giá',         icon: <Tag size={15} /> },
  { id: 'combo',    label: 'Combo',             icon: <Layers size={15} /> },
];

const PromotionsUser = ({ onBack }) => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const voucherSectionRef = useRef(null);

  useEffect(() => { fetchPromotions(); }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/promotions`);
      if (!response.ok) throw new Error('Không thể tải danh sách khuyến mãi');
      const data = await response.json();
      const now = new Date();
      setPromotions(data.filter(p =>
        p.status === 'ACTIVE' &&
        new Date(p.endDate) > now &&
        (p.maxUsage === 0 || p.usageCount < (p.maxUsage || 999999))
      ));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const matchesCategory = (promo) => {
    if (activeCategory === 'all') return true;
    if (promo.category) {
      if (activeCategory === 'ship') return promo.category === 'SHIP';
      if (activeCategory === 'discount') return promo.category === 'DISCOUNT';
      if (activeCategory === 'combo') return promo.category === 'COMBO';
    }
    const text = (promo.name + ' ' + (promo.description || '')).toLowerCase();
    if (activeCategory === 'ship') return text.includes('ship') || text.includes('vận chuyển');
    if (activeCategory === 'discount') return promo.type === 'PERCENT' || promo.type === 'FIXED';
    if (activeCategory === 'combo') return text.includes('combo') || text.includes('mua');
    return true;
  };

  const filteredPromotions = promotions.filter(p =>
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     p.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
    matchesCategory(p)
  );

  const scrollToVouchers = () => voucherSectionRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50/30 pb-20">
      {/* Hero Banner — nhường padding-top cho Navbar cố định */}
      <div className="pt-20">
        <PromotionBanner
          onScrollToVouchers={scrollToVouchers}
          targetDate={promotions.length > 0
            ? new Date(Math.min(...promotions.map(p => new Date(p.endDate).getTime())))
            : null}
        />
      </div>

      {/* Voucher Section */}
      <main className="container mx-auto px-4 sm:px-6 md:px-8 mt-12 sm:mt-16" ref={voucherSectionRef}>

        {/* Section heading */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
            <Tag size={12} /> Kho voucher
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Chọn voucher yêu thích của bạn
          </h2>
          <p className="text-slate-500 mt-2 text-sm sm:text-base max-w-lg mx-auto">
            Áp dụng khi thanh toán để nhận ngay ưu đãi hấp dẫn từ Farmily
          </p>
        </div>

        {/* Search + Filter Row */}
        <div className="max-w-2xl mx-auto mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm mã giảm giá hoặc tên ưu đãi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-5 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all text-slate-800 font-medium placeholder-slate-400 text-sm"
            />
          </div>

          {/* Category pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
                <div className="h-40 bg-slate-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
                  <div className="h-3 bg-slate-100 rounded-lg w-full" />
                  <div className="h-10 bg-slate-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto py-16 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Tag size={28} className="text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Đã có lỗi xảy ra</h3>
            <p className="text-slate-500 text-sm mb-6">{error}</p>
            <button
              onClick={fetchPromotions}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all"
            >
              Thử lại
            </button>
          </div>
        ) : filteredPromotions.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          >
            {filteredPromotions.map((promo) => (
              <motion.div
                key={promo.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } }
                }}
              >
                <PromotionCard promotion={promo} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
              <Tag size={28} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có ưu đãi nào'}
            </h3>
            <p className="text-slate-500 text-sm max-w-xs">
              {searchTerm
                ? 'Bạn thử tìm với từ khóa khác xem sao nhé!'
                : 'Chúng tôi đang chuẩn bị những món quà bất ngờ, quay lại sau nhé!'}
            </p>
            <button
              onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
              className="mt-6 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-all"
            >
              Xem tất cả ưu đãi
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default PromotionsUser;
