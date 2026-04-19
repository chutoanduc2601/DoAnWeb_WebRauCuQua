import React from 'react';
import CSSBarChart from '../components/CSSBarChart';
import { revenueChartMonthly, topSellingProducts, orders, customers, formatCurrency } from '../data/adminMockData';

export default function Reports() {
  // Monthly summary data
  const monthlySummary = [
    { month: 'Tháng 1', revenue: 85000000, orders: 38, newCustomers: 5 },
    { month: 'Tháng 2', revenue: 72000000, orders: 31, newCustomers: 3 },
    { month: 'Tháng 3', revenue: 95000000, orders: 42, newCustomers: 4 },
    { month: 'Tháng 4', revenue: 110000000, orders: 48, newCustomers: 6 },
  ];

  return (
    <div className="space-y-6">
      {/* Time filter (UI only) */}
      <div className="flex items-center gap-3">
        <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none cursor-pointer">
          <option>Năm 2026</option>
          <option>Năm 2025</option>
        </select>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Doanh thu theo tháng (2026)</h3>
          <CSSBarChart data={revenueChartMonthly} height={220} formatValue={(v) => v > 0 ? `${(v / 1000000).toFixed(0)}tr` : '0'} />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Top sản phẩm bán chạy</h3>
          <CSSBarChart data={topSellingProducts} height={220} />
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tổng hợp theo tháng</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Tháng</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Doanh thu</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Đơn hàng</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Khách mới</th>
              </tr>
            </thead>
            <tbody>
              {monthlySummary.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-5 py-3 text-sm font-medium text-slate-900 dark:text-white">{row.month}</td>
                  <td className="px-5 py-3 text-sm font-medium text-brand-600 dark:text-brand-400">{formatCurrency(row.revenue)}</td>
                  <td className="px-5 py-3 text-sm text-slate-700 dark:text-slate-300">{row.orders}</td>
                  <td className="px-5 py-3 text-sm text-slate-700 dark:text-slate-300">{row.newCustomers}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 dark:bg-slate-900">
                <td className="px-5 py-3 text-sm font-bold text-slate-900 dark:text-white">Tổng</td>
                <td className="px-5 py-3 text-sm font-bold text-brand-600 dark:text-brand-400">{formatCurrency(monthlySummary.reduce((s, r) => s + r.revenue, 0))}</td>
                <td className="px-5 py-3 text-sm font-bold text-slate-900 dark:text-white">{monthlySummary.reduce((s, r) => s + r.orders, 0)}</td>
                <td className="px-5 py-3 text-sm font-bold text-slate-900 dark:text-white">{monthlySummary.reduce((s, r) => s + r.newCustomers, 0)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
