import React from 'react';
import { Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 text-slate-400">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-white mb-6">
              <Leaf size={28} className="text-brand-500" />
              <span className="font-bold text-2xl tracking-tight">FreshGarden</span>
            </div>
            <p className="max-w-sm mb-6 leading-relaxed">
              Ăn xanh, sống khỏe với nguồn nông sản đạt chuẩn quốc tế. Giao hàng tươi mới mỗi ngày đến tận cửa nhà bạn.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Về Chúng Tôi</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">

                <span>Địa chỉ: 144 phường Linh Trung Thủ Đức</span>
              </li>
              <li className="flex items-center gap-2">

                <span>Hotline: <a href="tel:0933454194" className="hover:text-brand-400 transition-colors">0933454194</a></span>
              </li>
              <li className="flex items-center gap-2">

                <span>Email: <a href="mailto:farmily@gmail.com" className="hover:text-brand-400 transition-colors">farmily@gmail.com</a></span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Chính Sách</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Giao hàng</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Đổi trả</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Bảo mật</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">© {new Date().getFullYear()} FreshGarden. All rights reserved.</p>
          <div className="text-sm px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700 font-medium font-mono text-brand-300">
            Built by Duc Bao - Nong Lam University
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
