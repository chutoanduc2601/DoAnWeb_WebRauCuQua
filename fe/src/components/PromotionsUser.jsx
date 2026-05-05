import React, { useState, useEffect, useRef } from 'react';
import PromotionCard from './PromotionCard';
import PromotionBanner from './PromotionBanner';
import PromotionFilter from './PromotionFilter';

const PromotionsUser = ({ onBack }) => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const voucherSectionRef = useRef(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8082/api/admin/promotions');
      if (!response.ok) throw new Error('Không thể tải danh sách khuyến mãi');
      
      const data = await response.json();
      const now = new Date();
      const activePromos = data.filter(p => 
        p.status === 'ACTIVE' && 
        new Date(p.endDate) > now &&
        (p.maxUsage === 0 || p.usageCount < (p.maxUsage || 999999))
      );
      
      setPromotions(activePromos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const matchesCategory = (promo) => {
    if (activeCategory === 'all') return true;
    
    // Support new category field
    if (promo.category) {
      if (activeCategory === 'ship') return promo.category === 'SHIP';
      if (activeCategory === 'discount') return promo.category === 'DISCOUNT';
      if (activeCategory === 'combo') return promo.category === 'COMBO';
    }

    // Fallback to keyword matching for old data
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

  const scrollToVouchers = () => {
    voucherSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32">
      {/* Header */}
      <header className="fixed top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">
          <button 
            onClick={onBack}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors text-slate-600 dark:text-slate-400 font-bold"
          >
            QUAY LẠI
          </button>
          
          <div className="flex-1 flex items-center gap-3 justify-center">
             <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
               SIÊU ƯU ĐÃI RAU CỦ QUẢ
             </h1>
          </div>

          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 sm:pt-20">
        {/* Hero Banner */}
        <PromotionBanner 
          onScrollToVouchers={scrollToVouchers} 
          targetDate={promotions.length > 0 ? new Date(Math.min(...promotions.map(p => new Date(p.endDate).getTime()))) : null}
        />

        <div className="container mx-auto px-4 mt-8 sm:mt-12" ref={voucherSectionRef}>
          {/* Search & Filter Section */}
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm mã giảm giá của bạn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:border-forest-green outline-none transition-all text-slate-900 dark:text-white font-medium"
              />
            </div>

            {/* Categories */}
            <PromotionFilter 
              activeCategory={activeCategory} 
              onSelectCategory={setActiveCategory} 
            />
          </div>

          {/* Promotion Grid */}
          <div className="mt-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Đang tải...</p>
              </div>
            ) : error ? (
              <div className="max-w-md mx-auto p-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 flex flex-col items-center text-center shadow-sm">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Đã có lỗi xảy ra</h3>
                <p className="text-slate-500 font-medium mb-8">{error}</p>
                <button 
                  onClick={fetchPromotions}
                  className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all"
                >
                  THỬ LẠI
                </button>
              </div>
            ) : filteredPromotions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPromotions.map((promo) => (
                  <PromotionCard 
                    key={promo.id} 
                    promotion={promo} 
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                  {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có ưu đãi nào'}
                </h3>
                <p className="text-slate-500 max-w-sm font-medium">
                  {searchTerm 
                    ? 'Bạn thử tìm với từ khóa khác xem sao nhé!' 
                    : 'Chúng tôi đang chuẩn bị những món quà bất ngờ, quay lại sau nha!'}
                </p>
                <button 
                  onClick={() => {setSearchTerm(''); setActiveCategory('all');}}
                  className="mt-8 text-forest-green font-bold underline underline-offset-8"
                >
                  XEM TẤT CẢ ƯU ĐÃI
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PromotionsUser;
