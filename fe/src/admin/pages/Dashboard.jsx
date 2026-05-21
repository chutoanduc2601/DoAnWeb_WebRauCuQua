import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Users, Package, ArrowUpRight, ArrowDownRight, Clock, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, pendingOrders: 0, totalProducts: 0, totalCustomers: 0 });
  const [chartData, setChartData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartRes, ordersRes, productsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/admin/dashboard/stats`),
          fetch(`${API_BASE_URL}/api/admin/dashboard/revenue-chart`),
          fetch(`${API_BASE_URL}/api/admin/dashboard/recent-orders`),
          fetch(`${API_BASE_URL}/api/admin/dashboard/top-products`)
        ]);
        
        setStats(await statsRes.json());
        setChartData(await chartRes.json());
        setRecentOrders(await ordersRes.json());
        setTopProducts(await productsRes.json());
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formatVND = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  
  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tổng Doanh Thu" value={formatVND(stats.totalRevenue)} icon={<DollarSign size={24} />} color="text-emerald-500" bg="bg-emerald-100 dark:bg-emerald-500/20" />
        <StatCard title="Đơn Hàng" value={stats.totalOrders} subtitle={`${stats.pendingOrders} đang chờ xử lý`} icon={<ShoppingBag size={24} />} color="text-blue-500" bg="bg-blue-100 dark:bg-blue-500/20" />
        <StatCard title="Khách Hàng" value={stats.totalCustomers} icon={<Users size={24} />} color="text-purple-500" bg="bg-purple-100 dark:bg-purple-500/20" />
        <StatCard title="Sản Phẩm" value={stats.totalProducts} icon={<Package size={24} />} color="text-amber-500" bg="bg-amber-100 dark:bg-amber-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Doanh Thu 7 Ngày Gần Nhất</h3>
          <div className="h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `${value / 1000}k`} dx={-10} />
                  <Tooltip 
                    formatter={(value) => [formatVND(value), 'Doanh thu']}
                    labelFormatter={(label) => `Ngày: ${label}`}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <DollarSign size={48} className="text-slate-200 dark:text-slate-700 mb-2" />
                <p>Không có dữ liệu doanh thu 7 ngày qua</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Sản Phẩm Bán Chạy</h3>
          <div className="space-y-4">
            {topProducts.length > 0 ? topProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{product.name}</p>
                  <p className="text-xs text-slate-500 font-medium">{formatVND(product.price)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">{product.sold}</div>
                  <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">đã bán</div>
                </div>
              </div>
            )) : (
              <p className="text-slate-500 text-sm text-center py-4">Chưa có sản phẩm nào bán ra</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Đơn Hàng Mới Nhất</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="pb-3 px-4 font-semibold text-xs uppercase tracking-wider text-slate-500">Mã Đơn</th>
                <th className="pb-3 px-4 font-semibold text-xs uppercase tracking-wider text-slate-500">Khách Hàng</th>
                <th className="pb-3 px-4 font-semibold text-xs uppercase tracking-wider text-slate-500">Ngày Đặt</th>
                <th className="pb-3 px-4 font-semibold text-xs uppercase tracking-wider text-slate-500 text-right">Tổng Tiền</th>
                <th className="pb-3 px-4 font-semibold text-xs uppercase tracking-wider text-slate-500 text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-slate-800 dark:text-slate-200">#{order.orderCode || order.id}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300 font-medium">{order.fullName}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 text-sm font-bold text-emerald-600 text-right">{formatVND(order.total)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                      order.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 border border-red-200' :
                      'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}>
                      {order.status === 'DELIVERED' ? 'Đã giao' : order.status === 'PENDING' ? 'Chờ xử lý' : order.status === 'CANCELLED' ? 'Đã hủy' : 'Đang giao'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">Chưa có đơn hàng nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color, bg }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${bg} ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</p>
        <h4 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-0.5">{value}</h4>
        {subtitle && <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
