import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Ticket, BarChart3, UserCog, ArrowLeft, X, Leaf } from 'lucide-react';

const menuItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Tổng quan', end: true },
  { to: '/admin/products', icon: Package, label: 'Sản phẩm' },
  { to: '/admin/categories', icon: FolderTree, label: 'Danh mục' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Đơn hàng' },
  { to: '/admin/customers', icon: Users, label: 'Khách hàng' },
  { to: '/admin/promotions', icon: Ticket, label: 'Khuyến mãi' },
  { to: '/admin/reports', icon: BarChart3, label: 'Báo cáo' },
  { to: '/admin/accounts', icon: UserCog, label: 'Tài khoản' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="admin-sidebar-overlay lg:hidden" onClick={onClose}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
          <Link to="/admin" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white text-sm">FreshGarden</span>
              <span className="text-[10px] ml-1 text-brand-600 dark:text-brand-400 font-semibold">Admin</span>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto admin-scrollbar">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `admin-sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer ${
                      isActive
                        ? 'active bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Về trang chủ</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
