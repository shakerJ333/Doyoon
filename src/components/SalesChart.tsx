import React, { useState } from 'react';
import { BarChart2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SalesChart: React.FC = () => {
  const { chartData, currency } = useApp();
  const [activePointIndex, setActivePointIndex] = useState<number | null>(6); // Default highlight Friday

  const maxY = 1500;
  const height = 140;
  const width = 360;
  const paddingX = 24;
  const paddingBottom = 26;
  const paddingTop = 12;

  // Calculate coordinates for 7 days
  const stepX = (width - paddingX * 2) / (chartData.length - 1);

  const getCoordinates = (values: number[]) => {
    return values.map((val, i) => {
      const x = paddingX + i * stepX;
      const y = height - paddingBottom - (val / maxY) * (height - paddingBottom - paddingTop);
      return { x, y, val };
    });
  };

  const salesPoints = getCoordinates(chartData.map((d) => d.sales));
  const collectionsPoints = getCoordinates(chartData.map((d) => d.collections));

  // Build SVG path curve (smooth bezier)
  const makeSmoothPath = (pts: Array<{ x: number; y: number }>) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cx = (p0.x + p1.x) / 2;
      d += ` C ${cx},${p0.y} ${cx},${p1.y} ${p1.x},${p1.y}`;
    }
    return d;
  };

  const salesPath = makeSmoothPath(salesPoints);
  const collectionsPath = makeSmoothPath(collectionsPoints);

  // Gradient area paths
  const salesArea = `${salesPath} L ${salesPoints[salesPoints.length - 1].x},${height - paddingBottom} L ${salesPoints[0].x},${height - paddingBottom} Z`;
  const collectionsArea = `${collectionsPath} L ${collectionsPoints[collectionsPoints.length - 1].x},${height - paddingBottom} L ${collectionsPoints[0].x},${height - paddingBottom} Z`;

  const activeData = activePointIndex !== null ? chartData[activePointIndex] : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-2.5 sm:p-3.5 shadow-xs mx-2.5 sm:mx-4 mt-2">
      {/* Chart Header: Title & Legends */}
      <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-slate-100">
        {/* Legends on Left */}
        <div className="flex items-center gap-2.5 text-[11px] sm:text-xs font-bold">
          <div className="flex items-center gap-1 cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span className="text-slate-600 font-['Cairo']">التحصيلات</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
            <span className="text-slate-600 font-['Cairo']">المبيعات</span>
          </div>
        </div>

        {/* Title on Right */}
        <div className="flex items-center gap-1 text-slate-800 font-['Cairo']">
          <span className="text-[11px] sm:text-xs font-extrabold text-slate-900">
            المبيعات والتحصيلات (آخر 7 أيام)
          </span>
          <BarChart2 className="w-3.5 h-3.5 text-blue-600" />
        </div>
      </div>

      {/* Active Day Info Tooltip banner */}
      {activeData && (
        <div className="flex items-center justify-between bg-slate-50 px-2.5 py-1 rounded-lg mb-1 border border-slate-100 text-[10px] sm:text-[11px]">
          <span className="font-extrabold text-slate-800">
            يوم {activeData.day}:
          </span>
          <div className="flex items-center gap-2.5">
            <span className="text-blue-700 font-bold">
              مبيعات: {activeData.sales} {currency}
            </span>
            <span className="text-emerald-700 font-bold">
              تحصيلات: {activeData.collections} {currency}
            </span>
          </div>
        </div>
      )}

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-hidden select-none">
        {/* Y Axis Guide numbers */}
        <div className="absolute left-0 top-0 bottom-5 flex flex-col justify-between text-[9px] text-slate-400 font-mono pointer-events-none pl-0.5">
          <span>1,500</span>
          <span>1,000</span>
          <span>500</span>
          <span>0</span>
        </div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-32 sm:h-40 overflow-visible"
        >
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="colGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 1, 2, 3].map((idx) => {
            const y = paddingTop + (idx * (height - paddingBottom - paddingTop)) / 3;
            return (
              <line
                key={idx}
                x1={paddingX}
                y1={y}
                x2={width - 8}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="0.8"
                strokeDasharray="3 3"
              />
            );
          })}

          {/* Area Fills */}
          <path d={salesArea} fill="url(#salesGrad)" />
          <path d={collectionsArea} fill="url(#colGrad)" />

          {/* Sales Line */}
          <path
            d={salesPath}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Collections Line */}
          <path
            d={collectionsPath}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data point markers */}
          {salesPoints.map((pt, i) => (
            <g
              key={'sales-pt-' + i}
              onClick={() => setActivePointIndex(i)}
              className="cursor-pointer group"
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={activePointIndex === i ? 5.5 : 4}
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth="2"
                className="transition-all duration-200"
              />
            </g>
          ))}

          {collectionsPoints.map((pt, i) => (
            <g
              key={'col-pt-' + i}
              onClick={() => setActivePointIndex(i)}
              className="cursor-pointer group"
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={activePointIndex === i ? 5.5 : 4}
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="2"
                className="transition-all duration-200"
              />
            </g>
          ))}

          {/* X Axis Labels */}
          {chartData.map((d, i) => {
            const x = paddingX + i * stepX;
            const isSelected = activePointIndex === i;
            return (
              <text
                key={d.day}
                x={x}
                y={height - 6}
                textAnchor="middle"
                fontSize="10"
                fontWeight={isSelected ? 'bold' : 'normal'}
                fill={isSelected ? '#1e293b' : '#64748b'}
                className="cursor-pointer select-none font-['Cairo']"
                onClick={() => setActivePointIndex(i)}
              >
                {d.day}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
