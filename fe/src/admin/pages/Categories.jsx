import React, { useState } from 'react';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import AdminModal from '../components/AdminModal';
import { categories } from '../data/adminMockData';

export default function Categories() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{categories.length} danh mục</p>
        <button onClick={() => { setEditCat(null); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium cursor-pointer">
          <Plus className="w-4 h-4" /> Thêm danh mục
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-2xl">
                <FolderTree className="w-6 h-6 text-brand-500" />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                <button onClick={() => { setEditCat(cat); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 cursor-pointer">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteConfirm(cat)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{cat.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{cat.description}</p>
            <p className="text-xs text-brand-600 dark:text-brand-400 font-medium mt-3">{cat.productCount} sản phẩm</p>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editCat ? 'Sửa danh mục' : 'Thêm danh mục'} size="sm"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">Hủy</button>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium cursor-pointer">{editCat ? 'Cập nhật' : 'Thêm mới'}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên danh mục</label>
            <input defaultValue={editCat?.name || ''} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mô tả</label>
            <textarea defaultValue={editCat?.description || ''} rows={3} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
          </div>
        </div>
      </AdminModal>

      {/* Delete Confirmation */}
      <AdminModal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Xác nhận xóa" size="sm"
        footer={
          <>
            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">Hủy</button>
            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium cursor-pointer">Xóa</button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Bạn có chắc muốn xóa danh mục <strong>{deleteConfirm?.name}</strong>? Hành động này không thể hoàn tác.
        </p>
      </AdminModal>
    </div>
  );
}
