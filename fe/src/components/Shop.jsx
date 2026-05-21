import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from './ProductCard';
import { Filter, X, SlidersHorizontal, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

const Shop = ({ onAddToCart, onProductClick }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [displayCount, setDisplayCount] = useState(20);

  // Fetch Categories
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  // Fetch Products with Search & Filter
  const fetchProducts = useCallback((categoryId, name, min, max) => {
    setLoading(true);
    let url = `${API_BASE_URL}/api/products`;
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId);
    if (name) params.append('name', name);
    if (min) params.append('minPrice', min);
    if (max) params.append('maxPrice', max);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const formattedData = data.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          image: item.imageUrl,
          categories: [item.category?.name].filter(Boolean),
          categoryId: item.category?.id,
          badge: item.badge,
          tags: item.tags || []
        }));
        setProducts(formattedData);
        setDisplayCount(20);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  // Debounce Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(activeCategory, searchTerm, priceRange.min, priceRange.max);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, activeCategory, priceRange, fetchProducts]);

  const handleCategoryClick = (catId) => {
    const newCat = activeCategory === catId ? null : catId;
    setActiveCategory(newCat);
    setMobileFilterOpen(false);
  };

  const filterJSX = (
    <div className="space-y-8">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Tìm tên rau củ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm shadow-sm"
        />
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center gap-2 font-bold text-lg text-slate-800 mb-6 border-b border-slate-200 pb-4">
          <Filter size={20} className="text-brand-600" />
          Danh Mục
        </div>
        <ul className="space-y-2">
          <li>
            <button 
              onClick={() => handleCategoryClick(null)}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors font-medium flex justify-between items-center ${
                activeCategory === null 
                  ? 'bg-brand-50 text-brand-700' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tất cả sản phẩm
              {activeCategory === null && <span className="w-2 h-2 rounded-full bg-brand-500"></span>}
            </button>
          </li>
          {categories.map(cat => (
            <li key={cat.id}>
              <button 
                onClick={() => handleCategoryClick(cat.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors font-medium flex justify-between items-center ${
                  activeCategory === cat.id 
                    ? 'bg-brand-50 text-brand-700' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.name}
                {activeCategory === cat.id && <span className="w-2 h-2 rounded-full bg-brand-500"></span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Price Range */}
      <div className="pt-6 border-t border-slate-200">
        <h4 className="font-bold text-slate-800 mb-4">Khoảng Giá (VNĐ)</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <input 
              type="number" 
              placeholder="Từ" 
              value={priceRange.min}
              onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500" 
            />
            <span>-</span>
            <input 
              type="number" 
              placeholder="Đến" 
              value={priceRange.max}
              onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500" 
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="shop" className="py-12 sm:py-16 md:py-20 bg-slate-50/30">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-3 sm:mb-4 tracking-tight uppercase">Sản Phẩm Tươi Mới</h2>
          <div className="w-24 h-1.5 bg-brand-500 mx-auto rounded-full mb-6"></div>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto px-4 font-medium">Khám phá nguồn thực phẩm sạch, đạt tiêu chuẩn khắt khe nhất để đảm bảo sức khỏe cho bạn và gia đình.</p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-6 flex gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm transition-all shadow-sm active:scale-95"
          >
            <SlidersHorizontal size={18} className="text-brand-500" />
            Bộ lọc & Tìm kiếm
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
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] shadow-2xl max-h-[85vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                  <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                    <Filter className="text-brand-500" /> Bộ lọc
                  </h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="p-6">
                  {filterJSX}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10">
          
          {/* Sidebar Filters (Desktop) */}
          <div className="w-full lg:w-1/4 hidden lg:block">
            <div className="sticky top-28 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              {filterJSX}
            </div>
          </div>

          {/* Product Grid */}
          <div className="w-full lg:w-3/4">
            
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col">
                    <div className="aspect-[4/3] bg-slate-100 animate-pulse"></div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="h-3 w-16 bg-slate-100 animate-pulse mb-3 rounded"></div>
                      <div className="h-5 w-3/4 bg-slate-100 animate-pulse mb-6 rounded"></div>
                      <div className="flex justify-between items-end mt-auto">
                        <div className="h-6 w-20 bg-slate-100 animate-pulse rounded"></div>
                        <div className="h-10 w-10 bg-slate-100 animate-pulse rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                  <Search size={40} />
                </div>
                <p className="text-slate-500 font-bold text-lg">Không tìm thấy sản phẩm phù hợp.</p>
                <button 
                  onClick={() => {
                    setActiveCategory(null);
                    setSearchTerm('');
                    setPriceRange({ min: '', max: '' });
                  }}
                  className="mt-6 text-brand-600 font-bold hover:underline"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.slice(0, displayCount).map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAdd={onAddToCart}
                    onClick={onProductClick}
                  />
                ))}
              </div>
            )}
            
            {!loading && products.length > displayCount && (
              <div className="text-center mt-12 sm:mt-16">
                <button 
                  onClick={() => setDisplayCount(prev => prev + 20)}
                  className="px-10 py-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-bold hover:border-brand-600 hover:text-brand-600 hover:shadow-xl hover:shadow-brand-500/10 transition-all active:scale-95"
                >
                  Xem Thêm Sản Phẩm
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
