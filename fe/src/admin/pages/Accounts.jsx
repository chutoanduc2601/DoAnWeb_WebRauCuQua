import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User, Shield, UserCog, Search, Loader2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import AdminModal from '../components/AdminModal';
import StatusBadge from '../components/StatusBadge';

const API_URL = 'http://localhost:8082/api/profiles';

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  
  // Search for new account
  const [searchEmail, setSearchEmail] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'staff',
    status: 'active'
  });

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?type=internal`);
      const data = await res.json();
      setAccounts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi khi tải tài khoản:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (editAccount) {
      setFormData({
        name: editAccount.name || '',
        email: editAccount.email || '',
        role: editAccount.role || 'staff',
        status: 'active'
      });
      setFoundUser(null);
    } else {
      setFormData({ name: '', email: '', role: 'staff', status: 'active' });
      setSearchEmail('');
      setFoundUser(null);
    }
  }, [editAccount, modalOpen]);

  const handleSearchUser = async () => {
    if (!searchEmail.trim()) return;
    setIsSearching(true);
    setFoundUser(null);
    try {
      const res = await fetch(`${API_URL}?email=${encodeURIComponent(searchEmail.trim())}`);
      if (!res.ok) throw new Error('Server returned ' + res.status);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const user = data[0];
        setFoundUser(user);
        setFormData(prev => ({
          ...prev,
          role: (user.role || 'staff').toLowerCase()
        }));
      } else {
        alert('Không tìm thấy người dùng nào với email: ' + searchEmail);
      }
    } catch (error) {
      console.error('Lỗi tìm kiếm chi tiết:', error);
      alert('Lỗi kết nối server. Hãy kiểm tra Console (F12) để xem chi tiết.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSave = async () => {
    const target = editAccount || foundUser;
    if (!target) {
      alert('Bạn chưa thực hiện tìm kiếm hoặc chưa chọn người dùng!');
      return;
    }

    try {
      // Đảm bảo lưu role dạng chữ thường để khớp logic backend
      const updatedRole = formData.role.toLowerCase();
      
      const res = await fetch(`${API_URL}/${target.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...target,
          role: updatedRole
        })
      });

      if (res.ok) {
        setModalOpen(false);
        setEditAccount(null);
        setFoundUser(null);
        setSearchEmail('');
        fetchAccounts();
        alert('Đã cập nhật quyền thành công cho ' + target.email);
      } else {
        alert('Lỗi khi cập nhật. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi lưu:', error);
    }
  };

  const columns = [
    {
      key: 'name', label: 'Tài khoản',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white text-sm">{val || 'Chưa đặt tên'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role', label: 'Vai trò',
      render: (val) => {
        const displayRole = (val || '').toLowerCase();
        return (
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium uppercase ${displayRole === 'admin' ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'}`}>
            {displayRole === 'admin' ? <Shield className="w-3.5 h-3.5" /> : <UserCog className="w-3.5 h-3.5" />}
            {displayRole === 'admin' ? 'Admin' : 'Nhân viên'}
          </span>
        );
      },
    },
    { key: 'createdAt', label: 'Ngày tạo', render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '—' },
    { key: 'phone', label: 'Số điện thoại', render: (val) => val || '—' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{accounts.length} nhân sự quản trị</p>
        <button onClick={() => { setEditAccount(null); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium cursor-pointer">
          <Plus className="w-4 h-4" /> Cấp quyền nhân viên
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-center px-4">
            <UserCog className="w-12 h-12 mb-3 opacity-20" />
            <p className="font-medium">Chưa có nhân sự quản trị nào xuất hiện.</p>
            <p className="text-xs max-w-xs mx-auto mt-1">Lưu ý: Bạn cần dùng nút "Cấp quyền" để tìm email khách hàng và gán quyền Admin/Staff thì họ mới xuất hiện ở đây.</p>
          </div>
        ) : (
          <DataTable columns={columns} data={accounts}
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
        )}
      </div>

      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editAccount ? 'Sửa quyền tài khoản' : 'Cấp quyền nhân viên'} size="sm"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">Hủy</button>
            <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium cursor-pointer">{editAccount ? 'Cập nhật' : 'Cấp quyền'}</button>
          </>
        }
      >
        <div className="space-y-4">
          {!editAccount && (
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tìm theo Email khách hàng</label>
                <input 
                  value={searchEmail}
                  onChange={e => setSearchEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" 
                />
              </div>
              <button 
                onClick={handleSearchUser}
                disabled={isSearching}
                className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg cursor-pointer disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </button>
            </div>
          )}

          {(editAccount || foundUser) && (
            <div className="p-3 bg-brand-50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-900/20 rounded-lg">
              <p className="text-sm font-semibold text-brand-900 dark:text-brand-100">{editAccount?.name || foundUser?.name}</p>
              <p className="text-xs text-brand-600 dark:text-brand-400">{editAccount?.email || foundUser?.email}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vai trò quyền hạn</label>
            <select 
              value={formData.role} 
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="staff">Nhân viên (Staff)</option>
              <option value="admin">Quản trị viên (Admin)</option>
              <option value="user">Người dùng (User)</option>
            </select>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
