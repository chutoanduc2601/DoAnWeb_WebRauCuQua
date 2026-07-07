import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FileText, Download, TrendingUp } from 'lucide-react';

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('day');
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);

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

  useEffect(() => {
    const fetchChartData = async () => {
      setChartLoading(true);
      try {
        let endpoint = 'revenue-chart';
        if (timeframe === 'week') endpoint = 'revenue-weekly';
        else if (timeframe === 'month') endpoint = 'revenue-monthly';
        else if (timeframe === 'year') endpoint = 'revenue-yearly';

        const res = await fetch(`${API_BASE_URL}/api/admin/dashboard/${endpoint}`);
        const data = await res.json();
        setChartData(data);
      } catch (error) {
        console.error(`Error fetching chart data for ${timeframe}:`, error);
      } finally {
        setChartLoading(false);
      }
    };
    fetchChartData();
  }, [timeframe]);

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

      {/* Revenue Analysis Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Phân Tích Xu Hướng Doanh Thu</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
              {timeframe === 'day' ? 'Biểu đồ doanh thu 7 ngày gần nhất' : timeframe === 'week' ? 'Biểu đồ doanh thu 10 tuần gần nhất' : timeframe === 'month' ? 'Biểu đồ doanh thu các tháng trong năm' : 'Biểu đồ doanh thu các năm'}
            </p>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-700 p-0.5 rounded-lg text-xs font-semibold">
            <button 
              onClick={() => setTimeframe('day')}
              className={`px-3 py-1.5 rounded-md transition-all ${timeframe === 'day' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
            >
              Theo ngày
            </button>
            <button 
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1.5 rounded-md transition-all ${timeframe === 'week' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
            >
              Theo tuần
            </button>
            <button 
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1.5 rounded-md transition-all ${timeframe === 'month' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
            >
              Theo tháng
            </button>
            <button 
              onClick={() => setTimeframe('year')}
              className={`px-3 py-1.5 rounded-md transition-all ${timeframe === 'year' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
            >
              Theo năm
            </button>
          </div>
        </div>

        <div className="h-[320px]">
          {chartLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {timeframe === 'day' ? (
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenueReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    dy={10} 
                    tickFormatter={(val) => {
                      try {
                        const d = new Date(val);
                        return `${d.getDate()}/${d.getMonth() + 1}`;
                      } catch (e) {
                        return val;
                      }
                    }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(value) => `${value / 1000}k`} dx={-10} />
                  <Tooltip 
                    formatter={(value) => [formatVND(value), 'Doanh thu']}
                    labelFormatter={(label) => {
                      try {
                        const d = new Date(label);
                        return `Ngày: ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
                      } catch (e) {
                        return label;
                      }
                    }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenueReports)" />
                </AreaChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis 
                    dataKey={timeframe === 'week' ? 'week' : timeframe === 'month' ? 'month' : 'year'} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    dy={10} 
                    tickFormatter={(val) => {
                      if (timeframe === 'week') {
                        try {
                          const d = new Date(val);
                          return `T. ${d.getDate()}/${d.getMonth() + 1}`;
                        } catch (e) {
                          return val;
                        }
                      }
                      return val;
                    }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(value) => `${value / 1000}k`} dx={-10} />
                  <Tooltip 
                    formatter={(value) => [formatVND(value), 'Doanh thu']}
                    labelFormatter={(label) => {
                      if (timeframe === 'week') {
                        try {
                          const d = new Date(label);
                          return `Tuần từ ngày: ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
                        } catch (e) {
                          return label;
                        }
                      }
                      if (timeframe === 'month') {
                        return typeof label === 'string' && label.startsWith('T') ? `Tháng ${label.substring(1)}` : `Tháng: ${label}`;
                      }
                      return `${label}`;
                    }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={timeframe === 'week' ? 30 : timeframe === 'month' ? 20 : 40} />
                </BarChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <TrendingUp size={48} className="text-slate-200 dark:text-slate-700 mb-2" />
              <p>Không có dữ liệu doanh thu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
