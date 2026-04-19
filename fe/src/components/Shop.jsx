import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = ({ onAddToCart, onProductClick }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8082/api/products')
      .then(res => res.json())
      .then(data => {
        const formattedData = data.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          unit: `/${item.unit}`,
          image: item.imageUrl,
          categories: item.tags || [],
          badge: item.badge
        }));
        setProducts(formattedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const filters = ['All', 'Organic', 'VietGAP'];

  const filteredProducts = activeFilter === 'All' 
    ? products 
    : products.filter(p => p.categories.includes(activeFilter));

  const FilterContent = () => (
    <>
      <div className="flex items-center gap-2 font-bold text-lg text-slate-800 mb-6 border-b border-slate-200 pb-4">
        <Filter size={20} className="text-brand-600" />
        Danh Mục
      </div>
      <ul className="space-y-3">
        {filters.map(filter => (
          <li key={filter}>
            <button 
              onClick={() => {
                setActiveFilter(filter);
                setMobileFilterOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors font-medium flex justify-between items-center ${
                activeFilter === filter 
                  ? 'bg-brand-100 text-brand-700' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {filter === 'All' ? 'Tất cả sản phẩm' : filter}
              {activeFilter === filter && <span className="w-2 h-2 rounded-full bg-brand-500"></span>}
            </button>
          </li>
        ))}
      </ul>
      
      <div className="mt-8 pt-6 border-t border-slate-200">
        <h4 className="font-bold text-slate-800 mb-4">Khoảng Giá</h4>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <input type="number" placeholder="Từ" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500" />
          <span>-</span>
          <input type="number" placeholder="Đến" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500" />
        </div>
      </div>
    </>
  );

  return (
    <section id="shop" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 tracking-tight">Sản Phẩm Tươi Mới</h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto px-4">Khám phá nguồn thực phẩm sạch, đạt tiêu chuẩn khắt khe nhất để đảm bảo sức khỏe cho bạn và gia đình.</p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
          >
            <SlidersHorizontal size={16} />
            Bộ lọc
            {activeFilter !== 'All' && (
              <span className="bg-brand-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{activeFilter}</span>
            )}
          </button>
        </div>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-[200] lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={() => setMobileFilterOpen(false)}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[70vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <h3 className="font-bold text-lg text-slate-800">Bộ lọc</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-5">
                  <FilterContent />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          
          {/* Sidebar Filters (Desktop) */}
          <div className="w-full lg:w-1/4 hidden lg:block">
            <div className="sticky top-28 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <FilterContent />
            </div>
          </div>

          {/* Product Grid */}
          <div className="w-full lg:w-3/4">
            
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">
                    <div className="aspect-[4/3] bg-slate-200 animate-pulse"></div>
                    <div className="p-3 sm:p-5 flex-1 flex flex-col">
                      <div className="h-3 w-16 bg-slate-200 animate-pulse mb-3 rounded"></div>
                      <div className="h-5 w-3/4 bg-slate-200 animate-pulse mb-6 rounded"></div>
                      <div className="flex justify-between items-end mt-auto">
                        <div className="h-6 w-20 sm:w-24 bg-slate-200 animate-pulse rounded"></div>
                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-slate-200 animate-pulse rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 sm:py-20 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <p className="text-slate-500">Không tìm thấy sản phẩm phù hợp.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAdd={onAddToCart}
                    onClick={onProductClick}
                  />
                ))}
              </div>
            )}
            
            {!loading && filteredProducts.length > 0 && (
              <div className="text-center mt-8 sm:mt-12">
                <button className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border-2 border-slate-200 text-slate-700 font-medium hover:border-brand-600 hover:text-brand-600 transition-colors text-sm sm:text-base">
                  Xem Thêm
                </button>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Shop;
