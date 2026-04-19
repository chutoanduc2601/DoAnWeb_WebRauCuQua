import React, { useState } from 'react';
import { Plus, Edit, Trash2, User, Shield, UserCog } from 'lucide-react';
import DataTable from '../components/DataTable';
import AdminModal from '../components/AdminModal';
import StatusBadge from '../components/StatusBadge';
import { accounts as allAccounts } from '../data/adminMockData';

export default function Accounts() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editAccount, setEditAccount] = useState(null);

  const columns = [
    {
      key: 'name', label: 'Tài khoản',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white text-sm">{val}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role', label: 'Vai trò',
      render: (val) => (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${val === 'admin' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-600 dark:text-slate-400'}`}>
          {val === 'admin' ? <Shield className="w-3.5 h-3.5" /> : <UserCog className="w-3.5 h-3.5" />}
          {val === 'admin' ? 'Admin' : 'Nhân viên'}
        </span>
      ),
    },
    { key: 'status', label: 'Trạng thái', render: (val) => <StatusBadge status={val} /> },
    { key: 'createdAt', label: 'Ngày tạo' },
    { key: 'lastLogin', label: 'Đăng nhập cuối' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{allAccounts.length} tài khoản</p>
        <button onClick={() => { setEditAccount(null); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium cursor-pointer">
          <Plus className="w-4 h-4" /> Thêm tài khoản
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <DataTable columns={columns} data={allAccounts}
          renderActions={(row) => (
            <div className="flex items-center justify-end gap-1">
              <button onClick={() => { setEditAccount(row); setModalOpen(true); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 cursor-pointer">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        />
      </div>

      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editAccount ? 'Sửa tài khoản' : 'Thêm tài khoản'} size="md"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">Hủy</button>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium cursor-pointer">{editAccount ? 'Cập nhật' : 'Thêm mới'}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Họ tên</label>
            <input defaultValue={editAccount?.name || ''} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input type="email" defaultValue={editAccount?.email || ''} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          {!editAccount && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mật khẩu</label>
              <input type="password" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vai trò</label>
            <select defaultValue={editAccount?.role || 'staff'} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer">
              <option value="admin">Admin</option>
              <option value="staff">Nhân viên</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Trạng thái</label>
            <select defaultValue={editAccount?.status || 'active'} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer">
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngưng hoạt động</option>
            </select>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
