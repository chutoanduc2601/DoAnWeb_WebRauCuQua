import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Calendar, MapPin, ChevronDown, Package, Clock,
  CheckCircle2, ArrowLeft, Search, Leaf, AlertCircle, ArrowRight,
  Truck, CreditCard, User, XCircle, Award, Sparkles, HelpCircle, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ReturnRequestModal from './ReturnRequestModal';
import { API_BASE_URL } from '../config';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const STATUS_MAP = {
  'PENDING': { label: 'Chờ xác nhận', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200/50', icon: <Clock size={14} /> },
  'CONFIRMED': { label: 'Đã xác nhận', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200/50', icon: <CheckCircle2 size={14} /> },
  'PROCESSING': { label: 'Đang chuẩn bị', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200/50', icon: <Package size={14} /> },
  'SHIPPING': { label: 'Đang giao hàng', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200/50', icon: <Truck size={14} /> },
  'DELIVERED': { label: 'Đã giao hàng', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/50', icon: <CheckCircle2 size={14} /> },
  'CANCELLED': { label: 'Đã hủy', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/20 border-rose-200/50', icon: <XCircle size={14} /> },
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
  const [activeTab, setActiveTab] = useState('ALL');
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
      const response = await fetch(`${API_BASE_URL}/api/returns/user/${user.id}`);
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
      const response = await fetch(`${API_BASE_URL}/api/orders/user/${user.id}`);
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
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/tracking`);
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

  // Filter orders based on both Search Term and Active Tab
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.fullName?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'ALL') return true;
    if (activeTab === 'PENDING') return ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status);
    if (activeTab === 'SHIPPING') return order.status === 'SHIPPING';
    if (activeTab === 'DELIVERED') return order.status === 'DELIVERED';
    if (activeTab === 'CANCELLED') return order.status === 'CANCELLED';
    return true;
  });

  const getStatusBadge = (status) => {
    const cfg = STATUS_MAP[status] || { label: status, color: 'text-slate-600', bg: 'bg-slate-50', icon: <Package size={14} /> };
    const isActive = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING'].includes(status);

    return (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border ${cfg.bg} ${cfg.color} shadow-sm`}>
        {isActive ? (
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'PENDING' ? 'bg-amber-400' :
              status === 'CONFIRMED' ? 'bg-blue-400' :
                status === 'PROCESSING' ? 'bg-indigo-400' : 'bg-purple-400'
              }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'PENDING' ? 'bg-amber-500' :
              status === 'CONFIRMED' ? 'bg-blue-500' :
                status === 'PROCESSING' ? 'bg-indigo-500' : 'bg-purple-500'
              }`}></span>
          </span>
        ) : cfg.icon}
        {cfg.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-[#ECFDF5] via-[#F9FAFB] to-[#EEF2F6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-900/5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full"
          />
          <p className="text-emerald-800 font-bold animate-pulse text-sm">Đang tải dữ liệu của bạn...</p>
        </div>
      </div>
    );
  }

  const totalOrders = orders.length;
  const totalSpent = orders
    .filter(o => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + o.total, 0);
  const activeOrders = orders.filter(o =>
    ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING'].includes(o.status)
  ).length;
  const completedOrders = orders.filter(o => o.status === 'DELIVERED').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-20 px-4 relative overflow-hidden font-sans text-slate-700 antialiased">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-100/30 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <main className="max-w-6xl mx-auto relative z-10">

        {/* Banner Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 rounded-[2.5rem] p-8 sm:p-10 text-white relative overflow-hidden shadow-2xl shadow-emerald-950/20 mb-8 border border-white/20"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3 inline-block">
                Lịch sử mua hàng
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Đơn Hàng Của Bạn</h1>
              <p className="text-emerald-50/90 text-sm font-semibold flex items-center gap-1.5">
                <Leaf size={16} className="text-emerald-300 animate-pulse fill-emerald-300/30" />
                Cảm ơn bạn đã lựa chọn thực phẩm xanh và sạch tại Farmily
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-left md:text-right">
                <span className="text-[10px] text-emerald-100 font-extrabold uppercase tracking-wider">Tài khoản</span>
                <p className="text-lg font-black">{user?.email?.split('@')[0] || 'Khách hàng'}</p>
                <span className="text-[10px] text-emerald-200/80 font-bold uppercase bg-white/10 px-2 py-0.5 rounded-full inline-block mt-1">
                  Khách hàng thân thiết
                </span>
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-2xl shrink-0 font-black text-xl">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2-Column Responsive Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left Column: Orders list, search, tabs (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Search & Actions Control Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-5 rounded-[2rem] border border-slate-200/40 shadow-sm">
              <div className="flex flex-col">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Chi Tiết Đơn Hàng</h2>
                <p className="text-emerald-600 font-semibold text-xs mt-0.5">Duyệt qua danh sách các giao dịch của bạn</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Tìm theo mã đơn, tên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all rounded-2xl w-full shadow-inner placeholder:text-slate-400 font-medium text-xs sm:text-sm text-slate-800"
                />
              </div>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-1.5 p-1 bg-emerald-950/[0.03] border border-slate-200/40 rounded-2xl overflow-x-auto no-scrollbar shadow-inner">
              {[
                { id: 'ALL', label: 'Tất cả' },
                { id: 'PENDING', label: 'Chờ xử lý' },
                { id: 'SHIPPING', label: 'Đang giao' },
                { id: 'DELIVERED', label: 'Đã giao' },
                { id: 'CANCELLED', label: 'Đã hủy' }
              ].map(tab => {
                const count = orders.filter(o => {
                  if (tab.id === 'ALL') return true;
                  if (tab.id === 'PENDING') return ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(o.status);
                  if (tab.id === 'SHIPPING') return o.status === 'SHIPPING';
                  if (tab.id === 'DELIVERED') return o.status === 'DELIVERED';
                  if (tab.id === 'CANCELLED') return o.status === 'CANCELLED';
                  return true;
                }).length;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-4 py-2.5 rounded-xl font-extrabold text-[10px] sm:text-xs uppercase tracking-wider whitespace-nowrap transition-all flex-1 flex items-center justify-center gap-1.5 ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-600/20'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-500/[0.04]'
                      }`}
                  >
                    {tab.label}
                    <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200/50 text-slate-500 group-hover:bg-emerald-50'
                      }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Orders List / Empty State */}
            <AnimatePresence mode="wait">
              {filteredOrders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-12 sm:p-16 text-center border border-emerald-100/60 shadow-xl shadow-emerald-950/[0.02] flex flex-col items-center"
                >
                  <div className="relative mb-8">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/50 rounded-3xl flex items-center justify-center text-emerald-500 shadow-inner">
                      <ShoppingBag size={42} className="sm:w-12 sm:h-12" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg"
                    >
                      0
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Không tìm thấy đơn hàng nào</h3>
                  <p className="text-slate-500 mb-8 max-w-sm leading-relaxed font-medium text-sm">
                    Có vẻ như bạn chưa có đơn hàng nào ở trạng thái này. Hãy tiếp tục lựa chọn những món thực phẩm xanh sạch từ chúng tôi nhé!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onBack}
                    className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold rounded-2xl hover:shadow-lg hover:shadow-emerald-600/20 transition-all flex items-center gap-2 text-sm shadow-md"
                  >
                    Khám phá thực phẩm sạch <ArrowRight size={16} />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="space-y-5"
                >
                  {filteredOrders.map((order) => {
                    const isExpanded = expandedOrder === order.id;
                    return (
                      <motion.div
                        layout
                        key={order.id}
                        className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${isExpanded
                          ? 'border-emerald-200 shadow-xl shadow-emerald-950/[0.04]'
                          : 'border-slate-100 hover:border-emerald-100 shadow-sm hover:shadow-md'
                          }`}
                      >
                        {/* Collapsed Header Info */}
                        <div
                          className="p-5 sm:p-6 cursor-pointer hover:bg-slate-50/[0.3] transition-colors"
                          onClick={() => handleExpand(order.id)}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 shrink-0">
                                <ShoppingBag size={22} className="fill-emerald-55" />
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-extrabold text-slate-800 text-base">{order.orderCode}</span>
                                  {getStatusBadge(order.status)}
                                  {returnRequests[order.id] && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-200/50 flex items-center gap-1 shadow-sm">
                                      <AlertCircle size={10} /> Đã khiếu nại
                                    </span>
                                  )}
                                </div>

                                {/* Items preview inside collapsed card */}
                                <div className="flex items-center gap-4 mt-2">
                                  <div className="flex items-center -space-x-2.5 overflow-hidden">
                                    {order.items?.slice(0, 3).map((item) => (
                                      <img
                                        key={item.id}
                                        src={item.image}
                                        alt={item.name}
                                        className="w-8 h-8 rounded-lg object-cover border-2 border-white bg-slate-50 shadow-sm"
                                      />
                                    ))}
                                    {order.items?.length > 3 && (
                                      <div className="w-8 h-8 rounded-lg bg-emerald-50 border-2 border-white text-emerald-700 text-[10px] font-extrabold flex items-center justify-center shadow-sm z-10 shrink-0">
                                        +{order.items.length - 3}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 text-slate-400 text-[11px] font-semibold border-l border-slate-200/80 pl-3">
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                                    <span className="text-emerald-700">{order.items?.length || 0} sản phẩm</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-5">
                              <div className="text-right">
                                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Tổng tiền</p>
                                <p className="text-lg font-black text-emerald-700">{formatVND(order.total)}</p>
                              </div>
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                className={`p-1.5 rounded-xl border border-slate-100 ${isExpanded ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-400'}`}
                              >
                                <ChevronDown size={18} />
                              </motion.div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Section Details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="border-t border-slate-100 overflow-hidden"
                            >
                              <div className="p-5 sm:p-6 bg-[#FCFDFD]">
                                {/* Delivery Stepper Progress */}
                                {order.status === 'CANCELLED' ? (
                                  <div className="mb-8 p-4 bg-rose-50/50 border border-rose-100/50 rounded-2xl flex items-center gap-3 shadow-inner shadow-rose-950/[0.01]">
                                    <div className="w-10 h-10 rounded-xl bg-rose-100/70 border border-rose-200/20 flex items-center justify-center text-rose-600 shrink-0 shadow-sm animate-pulse">
                                      <XCircle size={20} />
                                    </div>
                                    <div>
                                      <h5 className="font-bold text-rose-800 text-sm">Đơn hàng đã bị hủy</h5>
                                      <p className="text-xs text-rose-500 mt-0.5 font-medium">Bạn đã yêu cầu hủy đơn hàng hoặc đơn hàng tự động hủy do thanh toán chậm.</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="mb-10 px-2">
                                    <div className="flex justify-between items-start relative">
                                      {/* Connection Line */}
                                      <div className="absolute top-4 left-[20px] w-[calc(100%-40px)] h-1 bg-slate-100 -z-10 rounded-full" />
                                      <div
                                        className="absolute top-4 left-[20px] h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500 -z-10 rounded-full shadow-sm shadow-emerald-500/10"
                                        style={{
                                          width: `calc(${(STEPS.findIndex(s => s.status === order.status) / (STEPS.length - 1)) * 100}% - ${(STEPS.findIndex(s => s.status === order.status) / (STEPS.length - 1)) * 40
                                            }px)`
                                        }}
                                      />

                                      {STEPS.map((step, idx) => {
                                        const currentIdx = STEPS.findIndex(s => s.status === order.status);
                                        const isCompleted = idx <= currentIdx;
                                        const isCurrent = idx === currentIdx;

                                        // Custom icons for beautiful flow representation
                                        const STEP_ICONS = {
                                          'PENDING': <ShoppingBag size={14} />,
                                          'CONFIRMED': <CheckCircle2 size={14} />,
                                          'PROCESSING': <Package size={14} />,
                                          'SHIPPING': <Truck size={14} />,
                                          'DELIVERED': <CheckCircle2 size={14} />
                                        };

                                        return (
                                          <div key={step.status} className="flex flex-col items-center gap-2">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted
                                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                              : 'bg-white border-slate-200 text-slate-300'
                                              } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}>
                                              {isCompleted ? STEP_ICONS[step.status] : <div className="w-2 h-2 rounded-full bg-current" />}
                                            </div>
                                            <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isCompleted ? 'text-emerald-800' : 'text-slate-400'}`}>
                                              {step.label}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* Grid: 2 columns */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                  {/* Col 1: Tracking History */}
                                  <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
                                    <h4 className="font-extrabold text-slate-800 flex items-center gap-2 text-sm mb-4">
                                      <Clock size={16} className="text-emerald-600" /> Lịch trình chi tiết
                                    </h4>
                                    <div className="relative pl-6 space-y-6 border-l-2 border-emerald-50 ml-2 py-1">
                                      {loadingTracking && !tracking[order.id] ? (
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                          <div className="w-4 h-4 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                                          <span>Đang tải lịch trình...</span>
                                        </div>
                                      ) : tracking[order.id]?.length > 0 ? (
                                        tracking[order.id].map((t, idx) => (
                                          <div key={t.id} className="relative">
                                            {/* Glowing node for latest tracking */}
                                            <div className={`absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center ${idx === 0 ? 'bg-emerald-600 ring-4 ring-emerald-100 shadow-md' : 'bg-emerald-200'
                                              }`} />
                                            <div className="flex flex-col">
                                              <span className={`text-xs font-bold ${idx === 0 ? 'text-emerald-700 font-extrabold' : 'text-slate-500'}`}>
                                                {t.description}
                                              </span>
                                              <span className="text-[10px] text-slate-400 mt-1">
                                                {new Date(t.createdAt).toLocaleString('vi-VN')}
                                              </span>
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-xs text-slate-400 italic">Chưa có thông tin cập nhật lịch trình.</p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Col 2: Info & Payment */}
                                  <div className="space-y-5">
                                    {/* Shipping Recipient Info */}
                                    <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-3.5">
                                      <h4 className="font-extrabold text-slate-800 flex items-center gap-2 text-sm">
                                        <MapPin size={16} className="text-emerald-600" /> Thông tin người nhận
                                      </h4>
                                      <div className="text-xs text-slate-600 space-y-2">
                                        <p className="font-extrabold text-slate-800 flex items-center gap-2">
                                          <User size={14} className="text-slate-400" />
                                          {order.fullName}
                                        </p>
                                        <p className="flex items-center gap-2 font-bold">
                                          <Clock size={14} className="text-slate-400" /> {order.phone}
                                        </p>
                                        <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100 leading-relaxed font-medium text-slate-500">
                                          {order.address}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Billing Info */}
                                    <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-3.5">
                                      <h4 className="font-extrabold text-slate-800 flex items-center gap-2 text-sm">
                                        <CreditCard size={16} className="text-emerald-600" /> Chi tiết thanh toán
                                      </h4>
                                      <div className="text-xs text-slate-600 space-y-2.5">
                                        <div className="flex justify-between font-semibold">
                                          <span>Tạm tính</span>
                                          <span className="text-slate-800">{formatVND(order.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold">
                                          <span>Phí vận chuyển</span>
                                          <span className="text-slate-800">{formatVND(order.shippingFee)}</span>
                                        </div>
                                        {order.discountAmount > 0 && (
                                          <div className="flex justify-between text-rose-500 font-extrabold bg-rose-50/50 px-2.5 py-1.5 rounded-xl border border-rose-100/35">
                                            <span>Khuyến mãi</span>
                                            <span>-{formatVND(order.discountAmount)}</span>
                                          </div>
                                        )}
                                        <div className="flex justify-between font-black text-emerald-800 pt-3 border-t border-slate-100 text-sm">
                                          <span>Tổng cộng</span>
                                          <span className="text-base text-emerald-700">{formatVND(order.total)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Products Section */}
                                <div className="space-y-4 border-t border-emerald-100/50 pt-6">
                                  <h4 className="font-extrabold text-slate-800 mb-2 flex items-center gap-1.5 text-sm">
                                    <Package size={16} className="text-emerald-600" />
                                    Danh sách thực phẩm đã đặt ({order.items?.length || 0})
                                  </h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {order.items?.map((item) => (
                                      <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100/80 shadow-sm hover:shadow-md transition-all duration-200">
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-16 h-16 rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <h5 className="font-extrabold text-slate-800 text-xs sm:text-sm line-clamp-1">{item.name}</h5>
                                          <p className="text-[10px] text-slate-400 font-semibold mt-1 bg-slate-50 px-2 py-0.5 rounded-md inline-block">{item.unit}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                          <p className="font-black text-emerald-600 text-xs sm:text-sm">{formatVND(item.price)}</p>
                                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Số lượng: x{item.quantity}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Return request section */}
                                {returnRequests[order.id] ? (
                                  <div className="mt-8 p-4 bg-rose-50/60 border border-rose-100/60 rounded-2xl shadow-sm">
                                    <h4 className="font-extrabold text-rose-700 mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                                      <AlertCircle size={15} /> Thông tin khiếu nại / hoàn trả
                                    </h4>
                                    <div className="text-xs text-slate-700 space-y-2 bg-white/50 p-4 rounded-xl border border-rose-100/20 mt-1 leading-relaxed font-semibold">
                                      <p><span className="font-medium text-rose-500">Lý do:</span> {returnRequests[order.id].reason}</p>
                                      <p className="flex items-center gap-2">
                                        <span className="font-medium text-rose-500">Trạng thái xử lý:</span>
                                        <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-extrabold text-[9px] uppercase tracking-wider">
                                          {returnRequests[order.id].status}
                                        </span>
                                      </p>
                                      {returnRequests[order.id].adminNote && (
                                        <p className="border-t border-rose-100/50 pt-2 mt-2 text-slate-600">
                                          <span className="font-semibold text-rose-500">Phản hồi từ Admin:</span> {returnRequests[order.id].adminNote}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ) : isReturnable(order) ? (
                                  <div className="mt-8 flex justify-end">
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={(e) => handleOpenReturnModal(e, order)}
                                      className="px-5 py-3 bg-white border border-rose-200 text-rose-600 font-black rounded-xl hover:bg-rose-50 hover:shadow-lg hover:shadow-rose-100/50 transition-all flex items-center gap-2 text-xs shadow-sm"
                                    >
                                      <AlertCircle size={15} />
                                      Yêu cầu Hoàn trả / Khiếu nại
                                    </motion.button>
                                  </div>
                                ) : null}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: E-commerce Loyalty Sidebar */}
          <div className="space-y-6">

            {/* VIP Loyalty Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-[2rem] p-6 relative overflow-hidden shadow-xl border border-emerald-800/40 shadow-emerald-950/20"
            >
              {/* Card glossy effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.15),transparent)] pointer-events-none" />
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-overlay" />

              <div className="relative z-10 flex flex-col justify-between h-48">
                {/* Logo & Card Type */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5">
                    <Leaf className="text-emerald-400 fill-emerald-400/20" size={20} />
                    <span className="font-black text-sm tracking-widest text-emerald-300 uppercase">Farmily</span>
                  </div>
                  <span className="bg-white/10 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-emerald-200 border border-white/5">
                    LOYALTY VIP
                  </span>
                </div>

                {/* Card Chip & Details */}
                <div className="flex justify-between items-end">
                  <div className="bg-gradient-to-br from-amber-300 to-amber-500 rounded-lg w-10 h-7 border border-amber-200/50 shadow-inner flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-0.5 w-6 h-4 opacity-30">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="border border-white/20 rounded-sm" />
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-emerald-300/60 font-bold uppercase tracking-wider block">Tích lũy Sen Vàng</span>
                    <span className="text-base font-black text-amber-400 flex items-center gap-1 justify-end">
                      <Award size={16} className="text-amber-400 fill-amber-400/10 animate-bounce" />
                      {Math.floor(totalSpent / 10000).toLocaleString('vi-VN')} điểm
                    </span>
                  </div>
                </div>

                {/* Card Number */}
                <div className="text-slate-200 font-mono tracking-widest text-sm text-center py-2 border-y border-white/5 bg-black/10 rounded-xl my-2">
                  5128 • 8900 • 1256 • {user?.id ? user.id.slice(-4) : '0478'}
                </div>

                {/* Card Holder & Member Since */}
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[8px] text-emerald-300/60 font-bold uppercase tracking-wider block">Chủ sở hữu</span>
                    <span className="font-extrabold text-white truncate max-w-[140px] block">
                      {user?.email?.split('@')[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-emerald-300/60 font-bold uppercase tracking-wider block">Gia nhập</span>
                    <span className="font-extrabold text-white">05/2026</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Level Tier Status Progress */}
            <div className="bg-white/70 backdrop-blur-md border border-slate-200/50 p-5 rounded-[2rem] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                    <Sparkles size={16} className="fill-amber-500/10" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Hạng thành viên</span>
                    <span className="text-xs font-black text-slate-800">
                      {totalSpent >= 1000000 ? 'Thành Viên Vàng (Gold)' : totalSpent >= 500000 ? 'Thành Viên Bạc (Silver)' : 'Thành Viên Đồng (Bronze)'}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">
                  {totalSpent >= 1000000 ? 'MAX TIER' : 'Đang Tích Lũy'}
                </span>
              </div>

              {totalSpent < 1000000 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>
                      Tiến trình lên hạng tiếp theo: {Math.floor((totalSpent % 500000) / 500000 * 100)}%
                    </span>
                    <span>
                      Thiếu {formatVND(totalSpent >= 500000 ? 1000000 - totalSpent : 500000 - totalSpent)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-200/20">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${(totalSpent % 500000) / 500000 * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-semibold italic text-center">
                    *Mỗi 10k chi tiêu tương ứng 1 điểm Sen Vàng
                  </p>
                </div>
              )}
            </div>

            {/* Purchase Analytics */}
            <div className="bg-white/70 backdrop-blur-md border border-slate-200/50 p-6 rounded-[2rem] shadow-sm space-y-5">
              <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShoppingBag size={16} className="text-emerald-600" /> Phân tích mua sắm
              </h4>

              <div className="space-y-4">
                {/* Total orders */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 text-xs">
                      <ShoppingBag size={14} />
                    </div>
                    <span className="text-xs text-slate-500 font-bold">Tổng số đơn hàng</span>
                  </div>
                  <span className="text-sm font-black text-slate-800">{totalOrders} đơn</span>
                </div>

                {/* Spent */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 text-xs">
                      <CreditCard size={14} />
                    </div>
                    <span className="text-xs text-slate-500 font-bold">Tổng chi tiêu (Đã giao)</span>
                  </div>
                  <span className="text-sm font-black text-teal-700">{formatVND(totalSpent)}</span>
                </div>

              </div>
            </div>

            {/* Quick Support Guidelines */}
            <div className="bg-white/70 backdrop-blur-md border border-slate-200/50 p-5 rounded-[2rem] shadow-sm space-y-4">
              <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                <HelpCircle size={16} className="text-slate-500" /> Hướng dẫn & Hỗ trợ
              </h4>

              <div className="space-y-3.5 text-xs font-semibold leading-relaxed">
                <div className="space-y-1">
                  <h5 className="text-slate-800 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Chính sách đổi trả trong 3 ngày?
                  </h5>
                  <p className="text-slate-400 pl-3">
                    Nếu sản phẩm hỏng hóc, dập nát do vận chuyển, bạn được hoàn trả trực tuyến hoặc đổi mới hoàn toàn miễn phí.
                  </p>
                </div>

                <div className="space-y-1">
                  <h5 className="text-slate-800 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Hotline khẩn cấp 24/7
                  </h5>
                  <p className="text-slate-400 pl-3">
                    Liên hệ ngay với bộ phận CSKH Farmily qua số hotline: <strong className="text-emerald-700">0933 454 194</strong>.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

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
