import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FileText, Download, TrendingUp } from 'lucide-react';

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/reports/summary`)
      .then(res => res.json())
      .then(data => {
        setSummary(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const formatVND = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  if (loading || !summary) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div></div>;

  const orderData = [
    { name: 'Thành công', value: summary.completedOrders, color: '#10b981' },
    { name: 'Đang xử lý', value: summary.totalOrders - summary.completedOrders - summary.cancelledOrders, color: '#f59e0b' },
    { name: 'Đã hủy', value: summary.cancelledOrders, color: '#ef4444' }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Báo cáo & Thống kê</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Phân tích hiệu quả kinh doanh toàn hệ thống</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm">
          <Download size={16} /> Xuất báo cáo (CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Doanh Thu Tổng Hợp</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Tổng doanh thu dự kiến (tất cả đơn)</p>
              <div className="text-3xl font-extrabold text-slate-800 dark:text-white">{formatVND(summary.totalRevenue)}</div>
            </div>
            
            <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Doanh thu thực tế (đã giao thành công)</p>
              <div className="text-2xl font-bold text-emerald-600">{formatVND(summary.deliveredRevenue)}</div>
            </div>
            
            <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4 mt-2 border border-emerald-100 dark:border-emerald-500/20 text-sm text-emerald-800 dark:text-emerald-200">
              Tỷ lệ doanh thu thực tế so với dự kiến đạt <span className="font-bold text-emerald-700 dark:text-emerald-300 text-base ml-1">{summary.totalRevenue > 0 ? Math.round((summary.deliveredRevenue / summary.totalRevenue) * 100) : 0}%</span>.
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Tỷ Lệ Chuyển Đổi Đơn Hàng</h3>
          </div>
          
          <div className="h-[280px]">
            {orderData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {orderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} đơn hàng`, 'Số lượng']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-slate-700 dark:text-slate-300 font-medium ml-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <FileText size={48} className="text-slate-200 dark:text-slate-700 mb-3" />
                <p className="font-medium">Không có dữ liệu đơn hàng</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
