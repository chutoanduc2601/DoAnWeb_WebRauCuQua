import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
import ChatSupport from './pages/ChatSupport';
import './AdminLayout.css';
import { Bell, MessageCircle } from 'lucide-react';
import { chatService } from '../services/chatService';

const pageTitles = {
  '/admin': 'Tổng quan',
  '/admin/products': 'Quản lý sản phẩm',
  '/admin/categories': 'Quản lý danh mục',
  '/admin/orders': 'Quản lý đơn hàng',
  '/admin/customers': 'Quản lý khách hàng',
  '/admin/promotions': 'Quản lý khuyến mãi',
  '/admin/reports': 'Báo cáo thống kê',
  '/admin/accounts': 'Quản lý tài khoản',
  '/admin/chat': 'Hỗ trợ khách hàng',
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('admin-dark-mode') === 'true';
  });
  const [toasts, setToasts] = useState([]);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, loading } = useAuth();
  const pageTitle = pageTitles[location.pathname] || 'Admin';

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('admin-dark-mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (isAdmin) {
      const eventSource = new EventSource('http://localhost:8082/api/orders/notifications');
      
      eventSource.onmessage = (event) => {
        try {
          const newOrder = JSON.parse(event.data);
          const id = Date.now();
          setToasts((prev) => [...prev, { id, message: `Có đơn hàng mới: #${newOrder.id} - ${newOrder.fullName} (${newOrder.total}đ)` }]);
          setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
          }, 5000);
        } catch (e) {
          console.error("Lỗi khi parse thông báo:", e);
        }
      };

      return () => {
        eventSource.close();
      };
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      // Listen for chat messages globally for admin
      const sub = chatService.subscribeToConversations(async (payload) => {
        // We trigger toast only on UPDATE when unread_count increases, or INSERT
        if (payload.eventType === 'UPDATE' && payload.new.unread_count > payload.old.unread_count) {
          const id = Date.now();
          setToasts((prev) => [...prev, { 
            id, 
            message: `Tin nhắn mới từ ${payload.new.user_name || 'Khách hàng'}`,
            type: 'chat'
          }]);
          setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
          }, 5000);
        } else if (payload.eventType === 'INSERT') {
           const id = Date.now();
           setToasts((prev) => [...prev, { 
             id, 
             message: `Cuộc hội thoại mới từ ${payload.new.user_name || 'Khách hàng'}`,
             type: 'chat'
           }]);
           setTimeout(() => {
             setToasts((prev) => prev.filter((t) => t.id !== id));
           }, 5000);
        }
      });

      return () => {
        if (sub) sub.unsubscribe();
      };
    }
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64 flex flex-col min-h-screen relative">
        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <div key={toast.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg p-4 flex items-start gap-3 animate-slide-in">
              <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center shrink-0">
                {toast.type === 'chat' ? (
                  <MessageCircle className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                ) : (
                  <Bell className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {toast.type === 'chat' ? 'Tin nhắn' : 'Thông báo'}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{toast.message}</p>
              </div>
              <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="text-slate-400 hover:text-slate-500 ml-2">
                &times;
              </button>
            </div>
          ))}
        </div>

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
            <Route path="chat" element={<ChatSupport />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
