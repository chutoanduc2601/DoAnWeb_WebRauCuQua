import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { mockProducts } from '../data';
import { Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const Shop = ({ onAddToCart, onProductClick }) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Organic', 'VietGAP'];

  const filteredProducts = activeFilter === 'All' 
    ? mockProducts 
    : mockProducts.filter(p => p.categories.includes(activeFilter));

  return (
    <section id="shop" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Sản Phẩm Tươi Mới</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Khám phá nguồn thực phẩm sạch, đạt tiêu chuẩn khắt khe nhất để đảm bảo sức khỏe cho bạn và gia đình.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4">
            <div className="sticky top-28 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 font-bold text-lg text-slate-800 mb-6 border-b border-slate-200 pb-4">
                <Filter size={20} className="text-brand-600" />
                Danh Mục
              </div>
              <ul className="space-y-3">
                {filters.map(filter => (
                  <li key={filter}>
                    <button 
                      onClick={() => setActiveFilter(filter)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium flex justify-between items-center ${
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
            </div>
          </div>

          {/* Product Grid */}
          <div className="w-full lg:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAdd={onAddToCart}
                  onClick={onProductClick}
                />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <p className="text-slate-500">Không tìm thấy sản phẩm phù hợp.</p>
              </div>
            )}
            
            {filteredProducts.length > 0 && (
              <div className="text-center mt-12">
                <button className="px-8 py-3 rounded-full border-2 border-slate-200 text-slate-700 font-medium hover:border-brand-600 hover:text-brand-600 transition-colors">
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
