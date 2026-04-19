import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const variantStyles = {
  brand: 'stats-card-brand',
  blue: 'stats-card-blue',
  amber: 'stats-card-amber',
  red: 'stats-card-red',
};

export default function StatsCard({ icon: Icon, value, label, trend, variant = 'brand' }) {
  const isPositive = trend >= 0;

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
          <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        </div>
        {trend !== 0 && (
          <span className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</p>
    </div>
  );
}
