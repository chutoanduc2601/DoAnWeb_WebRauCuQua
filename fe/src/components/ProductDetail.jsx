import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Check } from 'lucide-react';
import ProductReviews from './ProductReviews';
import { API_BASE_URL } from '../config';

const ProductDetail = ({ product, isOpen, onClose, onAddToCart, onProductClick }) => {
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (product) {
      setQuantity(product.unit === 'kg' ? 0.5 : 1);
    }
  }, [product, isOpen]);

  // Fetch related products
  useEffect(() => {
    if (product && isOpen) {
      setLoadingRelated(true);
      let url = `${API_BASE_URL}/api/products`;
      if (product.categoryId) {
        url += `?categoryId=${product.categoryId}`;
      }
      
      fetch(url)
        .then(res => res.json())
        .then(data => {
          const formatted = data
            .map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              unit: item.unit,
              image: item.imageUrl,
              categories: [item.category?.name].filter(Boolean),
              categoryId: item.category?.id,
              badge: item.badge,
              tags: item.tags || []
            }))
            .filter(p => {
              if (p.id === product.id) return false;
              // Fallback match category name
              if (product.categories && product.categories.length > 0) {
                return p.categories.some(cat => product.categories.includes(cat));
              }
              return true;
            });
          setRelatedProducts(formatted);
          setLoadingRelated(false);
        })
        .catch(err => {
          console.error("Error fetching related products:", err);
          setLoadingRelated(false);
        });
    }
  }, [product, isOpen]);

  // Smooth scroll back to top of the modal when viewed product changes
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product?.id]);

  if (!product) return null;

  return (
      <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
              {/* Backdrop */}
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                  onClick={onClose}
              />

              {/* Modal Content */}
              <motion.div
                  ref={modalRef}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.95 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="relative w-full sm:max-w-4xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-y-auto max-h-[92vh] sm:max-h-[90vh] flex flex-col scrollbar-thin scrollbar-thumb-slate-200"
              >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shadow-sm"
                >
                  <X size={18} className="sm:w-5 sm:h-5" />
                </button>

                {/* Top Section: Product Showcase Split Layout */}
                <div className="flex flex-col md:flex-row border-b border-slate-100">
                  {/* Image Showcase */}
                  <div className="w-full md:w-1/2 h-64 sm:h-80 md:h-auto min-h-[300px] md:min-h-[480px] relative bg-slate-50 flex items-center justify-center p-6 flex-shrink-0">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-[260px] md:max-h-[380px] max-w-full object-contain rounded-2xl transform hover:scale-102 transition-transform duration-500"
                    />
                    {product.badge && (
                        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-brand-500 text-white px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-bold rounded-lg shadow-sm">
                          {product.badge}
                        </div>
                    )}
                  </div>

                  {/* Info Column */}
                  <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex gap-2 mb-3 sm:mb-4 flex-wrap">
                        {product.categories.map((cat, idx) => (
                            <span key={idx} className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md">
                              {cat}
                            </span>
                        ))}
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 leading-tight">{product.name}</h2>
                      <div className="text-2xl sm:text-3xl font-extrabold text-brand-600 mb-4 sm:mb-6">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        <span className="text-sm sm:text-base font-medium text-slate-500 ml-1">/ {product.unit}</span>
                      </div>

                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 sm:mb-8 font-medium">
                        {product.description}
                      </p>

                      {/* Nutrition Facts */}
                      <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                          <Check size={16} className="text-brand-500 sm:w-[18px] sm:h-[18px]"/> Dinh dưỡng cơ bản (100g)
                        </h3>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <div className="flex justify-between border-b border-slate-200 pb-2 text-xs sm:text-sm">
                            <span className="text-slate-500">Calories</span>
                            <span className="font-semibold text-slate-800">{product.nutrition?.calories || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200 pb-2 text-xs sm:text-sm">
                            <span className="text-slate-500">Protein</span>
                            <span className="font-semibold text-slate-800">{product.nutrition?.protein || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200 pb-2 text-xs sm:text-sm">
                            <span className="text-slate-500">Carbs</span>
                            <span className="font-semibold text-slate-800">{product.nutrition?.carbs || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200 pb-2 text-xs sm:text-sm">
                            <span className="text-slate-500">Fat</span>
                            <span className="font-semibold text-slate-800">{product.nutrition?.fat || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity / Weight selector */}
                      <div className="mb-6">
                        <h3 className="font-bold text-slate-800 mb-3 text-sm sm:text-base">
                          Số lượng / Khối lượng
                        </h3>

                        {product.unit === 'kg' ? (
                            <div className="grid grid-cols-4 gap-2 items-center">
                              {[0.2, 0.5, 1].map(w => (
                                  <button
                                      key={w}
                                      onClick={() => setQuantity(w)}
                                      className={`py-2 rounded-xl border-2 font-bold transition-all text-xs sm:text-sm ${
                                          quantity === w
                                              ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                                              : 'border-slate-100 hover:border-slate-200 text-slate-500 hover:bg-slate-50'
                                      }`}
                                  >
                                    {w < 1 ? `${w * 1000}g` : `${w}kg`}
                                  </button>
                              ))}
                              <div className="relative flex items-center col-span-1 h-full">
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Khác"
                                    value={quantity ? Math.round(quantity * 1000) : ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '') {
                                            setQuantity('');
                                        } else {
                                            setQuantity(Math.max(0, parseInt(val)) / 1000);
                                        }
                                    }}
                                    className={`w-full h-full py-2 pr-5 pl-1 sm:pr-6 sm:pl-2 border-2 rounded-xl text-center font-bold text-xs sm:text-sm focus:outline-none transition-all ${
                                        ![0.2, 0.5, 1].includes(quantity) && quantity !== '' && quantity !== 0
                                            ? 'border-brand-500 bg-brand-50 text-brand-700'
                                            : 'border-slate-100 hover:border-slate-200 text-slate-700 focus:border-brand-500'
                                    }`}
                                />
                                <span className="absolute right-1 sm:right-2 text-slate-400 font-medium text-[10px] sm:text-xs pointer-events-none">g</span>
                              </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2.5 sm:gap-3">
                              <button
                                  onClick={() => setQuantity(Math.max(1, (quantity || 1) - 1))}
                                  className="w-10 h-10 rounded-xl border-2 border-slate-100 flex items-center justify-center font-bold text-lg hover:bg-slate-50 transition-colors"
                              >
                                -
                              </button>
                              <input
                                  type="number"
                                  min="1"
                                  value={quantity || ''}
                                  onChange={(e) => {
                                      const val = e.target.value;
                                      if (val === '') {
                                          setQuantity('');
                                      } else {
                                          setQuantity(Math.max(1, parseInt(val)));
                                      }
                                  }}
                                  className="w-16 h-10 border-2 border-slate-100 rounded-xl text-center font-bold text-base focus:border-brand-500 focus:outline-none transition-colors"
                              />
                              <button
                                  onClick={() => setQuantity((quantity || 0) + 1)}
                                  className="w-10 h-10 rounded-xl border-2 border-slate-100 flex items-center justify-center font-bold text-lg hover:bg-slate-50 transition-colors"
                              >
                                +
                              </button>
                              <span className="text-slate-500 font-semibold text-xs sm:text-sm ml-1">{product.unit}</span>
                            </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-4 p-4 bg-brand-50 rounded-2xl border border-brand-100 shadow-sm">
                        <span className="font-bold text-brand-800 text-sm sm:text-base">Tổng cộng:</span>
                        <span className="text-2xl font-black text-brand-600">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price * (quantity || 0))}
                        </span>
                      </div>

                      {/* CTA */}
                      <button
                          onClick={() => {
                            onAddToCart({ ...product, quantity });
                            onClose();
                          }}
                          className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/25 hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <ShoppingBag size={18} />
                        Thêm Vào Giỏ Hàng
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Reviews and Related Products (Full Width) */}
                <div className="w-full p-6 sm:p-8 md:p-10 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-12">
                  
                  {/* Đánh giá & Bình luận */}
                  <ProductReviews productId={product.id} />

                  {/* Sản phẩm liên quan */}
                  <div className="border-t border-slate-200/80 pt-10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2.5">
                          <span className="w-3 h-6 bg-brand-500 rounded-full inline-block"></span>
                          Sản phẩm liên quan
                        </h3>
                        {product.categories && product.categories[0] && (
                          <p className="text-xs text-slate-400 font-semibold mt-1">
                            Cùng danh mục: <span className="text-brand-600 font-bold">"{product.categories[0]}"</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {loadingRelated ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="bg-white rounded-3xl p-4 border border-slate-100/80 animate-pulse shadow-sm">
                            <div className="aspect-square bg-slate-100 rounded-2xl mb-4"></div>
                            <div className="h-4 w-3/4 bg-slate-100 rounded mb-2.5"></div>
                            <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : relatedProducts.length === 0 ? (
                      <div className="text-center py-8 bg-white rounded-3xl border border-dashed border-slate-200">
                        <p className="text-sm text-slate-400 font-semibold">Chưa có sản phẩm cùng danh mục nào khác.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {relatedProducts.slice(0, 4).map((rp) => (
                          <motion.div
                            key={rp.id}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            onClick={() => {
                              if (onProductClick) {
                                onProductClick(rp);
                              }
                            }}
                            className="bg-white rounded-3xl p-4 border border-slate-100 hover:border-brand-100/70 hover:shadow-lg hover:shadow-slate-100 transition-all cursor-pointer group flex flex-col h-full relative"
                          >
                            {/* Badge */}
                            {rp.badge && (
                              <span className="absolute top-4 left-4 z-10 bg-brand-500 text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-lg shadow-sm">
                                {rp.badge}
                              </span>
                            )}

                            {/* Image */}
                            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center p-2 mb-3.5">
                              <img
                                src={rp.image}
                                alt={rp.name}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>

                            {/* Details */}
                            <h4 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-2 mb-2 group-hover:text-brand-600 transition-colors flex-1">
                              {rp.name}
                            </h4>

                            <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
                              <div className="text-brand-600 font-black text-xs sm:text-sm">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rp.price)}
                                <span className="text-[10px] font-bold text-slate-400 ml-0.5">/{rp.unit}</span>
                              </div>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAddToCart({ ...rp, quantity: rp.unit === 'kg' ? 0.5 : 1 });
                                }}
                                className="w-8 h-8 rounded-xl bg-brand-50 hover:bg-brand-500 hover:text-white flex items-center justify-center text-brand-600 transition-colors"
                              >
                                <ShoppingBag size={14} />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </motion.div>
            </div>
        )}
      </AnimatePresence>
  );
};

export default ProductDetail;
