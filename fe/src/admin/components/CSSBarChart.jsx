import React from 'react';

export default function CSSBarChart({ data, height = 200, formatValue }) {
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="css-bar-chart" style={{ height }}>
      {data.map((item, idx) => {
        const pct = (item.value / maxVal) * 100;
        return (
          <div className="bar-wrapper cursor-pointer" key={idx}>
            <div className="bar" style={{ height: `${Math.max(pct, 2)}%` }}>
              <span className="bar-value">
                {formatValue ? formatValue(item.value) : item.value.toLocaleString('vi-VN')}
              </span>
            </div>
            <span className="bar-label">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
