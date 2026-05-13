import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Icons from Font Awesome CDN

const CartSidebar = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemove, onCheckout }) => {
    // Tính tổng tiền
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    // Giả định mức freeship là 500k
    const freeShipLimit = 500000;
    const progress = Math.min((totalPrice / freeShipLimit) * 100, 100);
    const remainingForFreeShip = freeShipLimit - totalPrice;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex justify-end">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
                        onClick={onClose}
                    />

                    {/* Sidebar Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="relative w-full sm:max-w-md h-full bg-white shadow-2xl flex flex-col z-10"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white text-slate-800">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <i className="fa-solid fa-shopping-basket text-brand-600 text-2xl"></i>
                                    Giỏ Hàng
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">{cartItems.length} sản phẩm trong giỏ</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-all hover:rotate-90"
                            >
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>

                        {/* Free Shipping Progress */}
                        {cartItems.length > 0 && (
                            <div className="px-6 py-4 bg-brand-50/50 border-b border-brand-100/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`p-1.5 rounded-lg ${progress === 100 ? 'bg-emerald-500' : 'bg-brand-500'} text-white`}>
                                        <i className="fa-solid fa-truck-fast text-xs"></i>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">
                                        {progress === 100 
                                            ? 'Chúc mừng! Bạn được Miễn Phí Vận Chuyển' 
                                            : `Mua thêm ${new Intl.NumberFormat('vi-VN').format(remainingForFreeShip)}đ để được Freeship`}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-brand-100/30">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className={`h-full ${progress === 100 ? 'bg-emerald-500' : 'bg-brand-500'}`}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Body: Items Loop */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-6">
                                    <motion.div 
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center shadow-inner"
                                    >
                                        <i className="fa-solid fa-shopping-cart text-4xl text-slate-200"></i>
                                    </motion.div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-600">Giỏ hàng trống trơn</p>
                                        <p className="text-sm text-slate-400 mt-1">Đừng bỏ lỡ các ưu đãi rau quả sạch hôm nay!</p>
                                    </div>
                                    <button 
                                        onClick={onClose} 
                                        className="px-8 py-3 bg-white text-brand-600 border-2 border-brand-600 rounded-xl font-bold hover:bg-brand-600 hover:text-white transition-all duration-300 shadow-sm"
                                    >
                                        Khám phá cửa hàng
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <AnimatePresence mode="popLayout">
                                        {cartItems.map(item => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group"
                                            >
                                                {/* Thumbnail */}
                                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-50">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-bold text-slate-800 line-clamp-1">{item.name}</h3>
                                                        <button
                                                            onClick={() => onRemove(item.id)}
                                                            className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                                        >
                                                            <i className="fa-solid fa-trash-can text-sm"></i>
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="text-brand-600 font-extrabold text-sm mt-1">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                                    </div>

                                                    <div className="flex items-center justify-between mt-3">
                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100 gap-1">
                                                            <button
                                                                onClick={() => {
                                                                    const step = item.unit === 'kg' ? 0.1 : 1;
                                                                    const newVal = Math.max(step, item.quantity - step);
                                                                    onUpdateQuantity(item.id, Number(newVal.toFixed(3)));
                                                                }}
                                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white hover:bg-slate-100 text-slate-600 shadow-sm transition-colors border border-slate-100"
                                                            >
                                                                <i className="fa-solid fa-minus text-[10px]"></i>
                                                            </button>
                                                            <div className="flex items-center px-1">
                                                                <input
                                                                    type="number"
                                                                    min={item.unit === 'kg' ? 0.1 : 1}
                                                                    step={item.unit === 'kg' ? 0.1 : 1}
                                                                    value={item.quantity || ''}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        if (val === '') {
                                                                            onUpdateQuantity(item.id, 0); 
                                                                        } else {
                                                                            const parsed = parseFloat(val);
                                                                            if (!isNaN(parsed)) {
                                                                                onUpdateQuantity(item.id, parsed);
                                                                            }
                                                                        }
                                                                    }}
                                                                    className="w-12 bg-transparent text-center font-bold text-sm text-slate-700 focus:outline-none"
                                                                />
                                                                <span className="text-[10px] text-slate-400 font-medium uppercase">{item.unit}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    const step = item.unit === 'kg' ? 0.1 : 1;
                                                                    const newVal = item.quantity + step;
                                                                    onUpdateQuantity(item.id, Number(newVal.toFixed(3)));
                                                                }}
                                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white hover:bg-slate-100 text-slate-600 shadow-sm transition-colors border border-slate-100"
                                                            >
                                                                <i className="fa-solid fa-plus text-[10px]"></i>
                                                            </button>
                                                        </div>

                                                        <div className="text-right">
                                                            <p className="text-[10px] text-slate-400 font-medium">Thành tiền</p>
                                                            <p className="font-bold text-slate-800 text-sm">
                                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Footer: Summary & Checkout */}
                        {cartItems.length > 0 && (
                            <div className="border-t border-slate-100 p-6 bg-white shrink-0 shadow-[0_-20px_25px_-5px_rgba(0,0,0,0.05)]">
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-between text-slate-500 text-sm">
                                        <span>Tạm tính:</span>
                                        <span className="font-medium text-slate-700">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-500 text-sm">
                                        <span>Phí vận chuyển:</span>
                                        <span className="font-medium text-emerald-500">{progress === 100 ? 'Miễn phí' : 'Tính khi thanh toán'}</span>
                                    </div>
                                    <div className="h-px bg-slate-100 my-2" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-800 font-bold">Tổng cộng:</span>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-brand-600 block leading-tight">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium">Đã bao gồm thuế VAT</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { onClose(); onCheckout?.(); }}
                                    className="group w-full py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-brand-500/25 hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2">
                                    Tiến Hành Thanh Toán
                                    <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                </button>
                                <p className="text-center text-[11px] text-slate-400 mt-4">
                                    Cam kết rau củ sạch 100% - Đổi trả trong 24h
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;
