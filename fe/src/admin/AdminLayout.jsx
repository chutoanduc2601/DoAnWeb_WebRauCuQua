import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AdminHeader from './components/AdminHeader';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Promotions from './pages/Promotions';
import Reports from './pages/Reports';
import Accounts from './pages/Accounts';
import './AdminLayout.css';

const pageTitles = {
  '/admin': 'Tổng quan',
  '/admin/products': 'Quản lý sản phẩm',
  '/admin/categories': 'Quản lý danh mục',
  '/admin/orders': 'Quản lý đơn hàng',
  '/admin/customers': 'Quản lý khách hàng',
  '/admin/promotions': 'Quản lý khuyến mãi',
  '/admin/reports': 'Báo cáo thống kê',
  '/admin/accounts': 'Quản lý tài khoản',
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('admin-dark-mode') === 'true';
  });
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || 'Admin';

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('admin-dark-mode', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <AdminHeader
          title={pageTitle}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="promotions" element={<Promotions />} />
            <Route path="reports" element={<Reports />} />
            <Route path="accounts" element={<Accounts />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
