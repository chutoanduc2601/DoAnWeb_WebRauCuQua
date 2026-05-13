import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Calendar, MapPin, ChevronRight, 
  ChevronDown, Package, Clock, CheckCircle2, 
  ArrowLeft, Search, Filter, Leaf, AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ReturnRequestModal from './ReturnRequestModal';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const STATUS_MAP = {
  'PENDING': { label: 'Chờ xác nhận', color: 'text-amber-600', bg: 'bg-amber-50', icon: <Clock size={14} /> },
  'CONFIRMED': { label: 'Đã xác nhận', color: 'text-blue-600', bg: 'bg-blue-50', icon: <CheckCircle2 size={14} /> },
  'PROCESSING': { label: 'Đang chuẩn bị', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: <Package size={14} /> },
  'SHIPPING': { label: 'Đang giao hàng', color: 'text-purple-600', bg: 'bg-purple-50', icon: <Clock size={14} /> },
  'DELIVERED': { label: 'Đã giao hàng', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <CheckCircle2 size={14} /> },
  'CANCELLED': { label: 'Đã hủy', color: 'text-rose-600', bg: 'bg-rose-50', icon: <Package size={14} /> },
};

const STEPS = [
  { status: 'PENDING', label: 'Đặt hàng' },
  { status: 'CONFIRMED', label: 'Xác nhận' },
  { status: 'PROCESSING', label: 'Chuẩn bị' },
  { status: 'SHIPPING', label: 'Giao hàng' },
  { status: 'DELIVERED', label: 'Hoàn tất' }
];

const OrderHistory = ({ onBack }) => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tracking, setTracking] = useState({});
  const [loadingTracking, setLoadingTracking] = useState(false);
  const [returnRequests, setReturnRequests] = useState({});
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrders();
      fetchReturnRequests();
    }
  }, [isAuthenticated, user]);

  const fetchReturnRequests = async () => {
    try {
      const response = await fetch(`http://localhost:8082/api/returns/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        const returnsMap = {};
        data.forEach(req => {
          returnsMap[req.order.id] = req;
        });
        setReturnRequests(returnsMap);
      }
    } catch (error) {
      console.error('Error fetching return requests:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8082/api/orders/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTracking = async (orderId) => {
    try {
      setLoadingTracking(true);
      const response = await fetch(`http://localhost:8082/api/orders/${orderId}/tracking`);
      if (response.ok) {
        const data = await response.json();
        console.log(`Tracking data for order ${orderId}:`, data);
        setTracking(prev => ({ ...prev, [orderId]: data }));
      } else {
        console.error(`Failed to fetch tracking for order ${orderId}:`, response.status);
      }
    } catch (error) {
      console.error('Error fetching tracking:', error);
    } finally {
      setLoadingTracking(false);
    }
  };

  const handleExpand = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
      fetchTracking(orderId);
    }
  };

  const handleOpenReturnModal = (e, order) => {
    e.stopPropagation();
    setSelectedOrderForReturn(order);
    setIsReturnModalOpen(true);
  };

  const isReturnable = (order) => {
    if (order.status !== 'DELIVERED') return false;
    
    // Use the latest tracking entry's date as the delivered date
    const orderTracking = tracking[order.id];
    if (orderTracking && orderTracking.length > 0) {
      const deliveredDate = new Date(orderTracking[0].createdAt).getTime();
      const now = new Date().getTime();
      const daysDiff = (now - deliveredDate) / (1000 * 3600 * 24);
      return daysDiff <= 3;
    }

    // Fallback if tracking not loaded yet, just show the button
    return true;
  };

  const filteredOrders = orders.filter(order => 
    order.orderCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full"
          />
          <p className="text-slate-500 font-medium animate-pulse">Đang tải lịch sử đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ECFDF5] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors font-semibold"
          >
            <ArrowLeft size={20} /> Quay lại
          </button>
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xl">
            <Leaf size={24} className="text-emerald-500" />
            <span className="hidden sm:inline">Farmily</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#064E3B]">Lịch Sử Đơn Hàng</h1>
            <p className="text-emerald-600 font-medium mt-1">Bạn có {orders.length} đơn hàng đã đặt</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Tìm theo mã đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-emerald-100 rounded-xl w-full md:w-64 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-emerald-100 flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-400">
              <ShoppingBag size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-slate-500 mb-8 max-w-xs">Có vẻ như bạn chưa đặt món quà xanh nào từ Farmily.</p>
            <button 
              onClick={onBack}
              className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
            >
              Mua sắm ngay
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <motion.div 
                layout
                key={order.id}
                className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden"
              >
                <div 
                  className="p-4 sm:p-6 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => handleExpand(order.id)}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <ShoppingBag size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-lg">{order.orderCode}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${STATUS_MAP[order.status]?.bg} ${STATUS_MAP[order.status]?.color}`}>
                            {STATUS_MAP[order.status]?.icon}
                            {STATUS_MAP[order.status]?.label}
                          </span>
                          {returnRequests[order.id] && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                              Đã khiếu nại
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-slate-400 text-xs">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                          <span className="flex items-center gap-1 font-bold text-emerald-600">{order.items?.length || 0} sản phẩm</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Tổng cộng</p>
                        <p className="text-xl font-black text-emerald-600">{formatVND(order.total)}</p>
                      </div>
                      <motion.div 
                        animate={{ rotate: expandedOrder === order.id ? 180 : 0 }}
                        className="text-slate-300"
                      >
                        <ChevronDown size={20} />
                      </motion.div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedOrder === order.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-50 overflow-hidden"
                    >
                      <div className="p-4 sm:p-6 bg-slate-50/30">
                        {/* Delivery Stepper */}
                        <div className="mb-10 px-2">
                          <div className="flex justify-between items-start relative">
                            {/* Connection Line */}
                            <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-200 -z-10" />
                            <div 
                              className="absolute top-4 left-0 h-0.5 bg-emerald-500 transition-all duration-500 -z-10" 
                              style={{ 
                                width: `${(STEPS.findIndex(s => s.status === order.status) / (STEPS.length - 1)) * 100}%` 
                              }}
                            />
                            
                            {STEPS.map((step, idx) => {
                              const currentIdx = STEPS.findIndex(s => s.status === order.status);
                              const isCompleted = idx <= currentIdx && order.status !== 'CANCELLED';
                              const isCurrent = idx === currentIdx;
                              
                              return (
                                <div key={step.status} className="flex flex-col items-center gap-2">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                    isCompleted 
                                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200' 
                                      : 'bg-white border-slate-200 text-slate-300'
                                  } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}>
                                    {isCompleted ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                                  </div>
                                  <span className={`text-[10px] font-bold uppercase tracking-tight ${isCompleted ? 'text-emerald-700' : 'text-slate-400'}`}>
                                    {step.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                          <div className="space-y-6">
                            {/* Tracking History */}
                            <div className="space-y-4">
                              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                <Clock size={16} className="text-emerald-500"/> Lịch trình đơn hàng
                              </h4>
                              <div className="relative pl-6 space-y-6 border-l border-emerald-100 ml-2">
                                {loadingTracking && !tracking[order.id] ? (
                                  <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <div className="w-3 h-3 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
                                    <span>Đang tải lịch trình...</span>
                                  </div>
                                ) : tracking[order.id]?.length > 0 ? (
                                  tracking[order.id].map((t, idx) => (
                                    <div key={t.id} className="relative">
                                      <div className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-white ${idx === 0 ? 'bg-emerald-500' : 'bg-emerald-200'}`} />
                                      <div className="flex flex-col">
                                        <span className={`text-xs font-bold ${idx === 0 ? 'text-emerald-700' : 'text-slate-500'}`}>
                                          {t.description}
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                          {new Date(t.createdAt).toLocaleString('vi-VN')}
                                        </span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-slate-400 italic">Chưa có lịch trình.</p>
                                )}
                              </div>
                            </div>

                            <div className="space-y-3">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2"><MapPin size={16} className="text-emerald-500"/> Địa chỉ nhận hàng</h4>
                            <div className="text-sm text-slate-600 space-y-1">
                              <p className="font-bold">{order.fullName}</p>
                              <p>{order.phone}</p>
                              <p>{order.address}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2"><Package size={16} className="text-emerald-500"/> Chi tiết thanh toán</h4>
                            <div className="text-sm text-slate-600 space-y-1">
                              <p className="flex justify-between">Tạm tính: <span>{formatVND(order.subtotal)}</span></p>
                              <p className="flex justify-between">Phí vận chuyển: <span>{formatVND(order.shippingFee)}</span></p>
                              {order.discountAmount > 0 && (
                                <p className="flex justify-between text-rose-500 font-medium">Giảm giá: <span>-{formatVND(order.discountAmount)}</span></p>
                              )}
                              <p className="flex justify-between font-bold text-emerald-600 pt-1 border-t border-slate-200">Tổng cộng: <span>{formatVND(order.total)}</span></p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                          <h4 className="font-bold text-slate-800 mb-2">Sản phẩm đã mua</h4>
                          {order.items?.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-emerald-50">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-14 h-14 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-slate-800 text-sm line-clamp-1">{item.name}</h5>
                                <p className="text-xs text-slate-400">{item.unit}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="font-bold text-slate-700 text-sm">{formatVND(item.price)}</p>
                                <p className="text-xs text-slate-400">Số lượng: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Return Request Section */}
                        {returnRequests[order.id] ? (
                          <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-xl">
                            <h4 className="font-bold text-rose-700 mb-2 flex items-center gap-2">
                              <AlertCircle size={16} /> Thông tin khiếu nại
                            </h4>
                            <div className="text-sm text-slate-700 space-y-1">
                              <p><span className="font-medium">Lý do:</span> {returnRequests[order.id].reason}</p>
                              <p><span className="font-medium">Trạng thái:</span> <span className="font-bold text-rose-600">{returnRequests[order.id].status}</span></p>
                              {returnRequests[order.id].adminNote && (
                                <p><span className="font-medium">Phản hồi:</span> {returnRequests[order.id].adminNote}</p>
                              )}
                            </div>
                          </div>
                        ) : isReturnable(order) ? (
                          <div className="mt-6 flex justify-end">
                            <button
                              onClick={(e) => handleOpenReturnModal(e, order)}
                              className="px-6 py-2.5 bg-white border-2 border-rose-500 text-rose-600 font-bold rounded-xl hover:bg-rose-50 hover:shadow-lg hover:shadow-rose-100 transition-all flex items-center gap-2"
                            >
                              <AlertCircle size={18} />
                              Hoàn hàng / Khiếu nại
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <ReturnRequestModal 
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        order={selectedOrderForReturn}
        onSuccess={() => {
          setIsReturnModalOpen(false);
          fetchReturnRequests();
        }}
      />
    </div>
  );
};

export default OrderHistory;
