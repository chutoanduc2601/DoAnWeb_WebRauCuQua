import React from 'react';
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import CSSBarChart from '../components/CSSBarChart';
import StatusBadge from '../components/StatusBadge';
import { dashboardStats, revenueChart7Days, topSellingProducts, orders, formatCurrency } from '../data/adminMockData';

export default function Dashboard() {
  const recentOrders = orders.slice(0, 5);
  const topProducts = topSellingProducts;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={DollarSign} value={formatCurrency(dashboardStats.revenue.value)} label={dashboardStats.revenue.label} trend={dashboardStats.revenue.trend} variant="brand" />
        <StatsCard icon={ShoppingCart} value={dashboardStats.orders.value} label={dashboardStats.orders.label} trend={dashboardStats.orders.trend} variant="blue" />
        <StatsCard icon={Package} value={dashboardStats.products.value} label={dashboardStats.products.label} trend={dashboardStats.products.trend} variant="amber" />
        <StatsCard icon={Users} value={dashboardStats.customers.value} label={dashboardStats.customers.label} trend={dashboardStats.customers.trend} variant="red" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Doanh thu 7 ngày gần nhất</h3>
          <CSSBarChart data={revenueChart7Days} formatValue={(v) => `${(v / 1000000).toFixed(1)}tr`} />
        </div>

        {/* Top Selling */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Top sản phẩm bán chạy</h3>
          <CSSBarChart data={topProducts} />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Đơn hàng mới nhất</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Mã đơn</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Khách hàng</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Tổng tiền</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Trạng thái</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Ngày</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-5 py-3 text-sm font-medium text-brand-600 dark:text-brand-400">{order.code}</td>
                  <td className="px-5 py-3 text-sm text-slate-700 dark:text-slate-300">{order.customerName}</td>
                  <td className="px-5 py-3 text-sm font-medium text-slate-900 dark:text-white">{formatCurrency(order.total)}</td>
                  <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-3 text-sm text-slate-500 dark:text-slate-400">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
