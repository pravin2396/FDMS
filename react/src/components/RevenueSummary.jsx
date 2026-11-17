import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  CreditCard,
  ArrowUpRight,
} from 'lucide-react';

const RevenueSummary = ({ revenueData }) => {
  const [viewMode, setViewMode] = useState('weekly'); // 'weekly' or 'monthly'

  const dataList =
    viewMode === 'weekly'
      ? revenueData?.weeklyBreakdown || []
      : revenueData?.monthlyBreakdown || [];

  const maxRevenue = Math.max(...dataList.map((item) => item.revenue), 1);

  return (
    <div className="h-full flex flex-col justify-between rounded-xl bg-neutral-900/90 border border-neutral-800 p-3 sm:p-3.5 shadow-lg overflow-hidden">
      {/* Header and Controls */}
      <div className="flex items-center justify-between gap-2 shrink-0 pb-1.5 border-b border-neutral-800/80">
        <div className="flex items-center gap-1.5">
          <span className="p-1 rounded-md bg-red-600/20 text-red-500">
            <CreditCard className="w-3.5 h-3.5" />
          </span>
          <div>
            <h2 className="text-xs font-bold text-white tracking-tight">
              Revenue & Financial Summary
            </h2>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-neutral-800/90 p-0.5 rounded-lg border border-neutral-700/80 text-[10px]">
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${
              viewMode === 'weekly'
                ? 'bg-red-600 text-white font-semibold shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${
              viewMode === 'monthly'
                ? 'bg-red-600 text-white font-semibold shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Top Quick Revenue Metrics Row */}
      <div className="grid grid-cols-3 gap-2 shrink-0 py-1.5">
        <div className="p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wider truncate">
              Gross Revenue
            </span>
            <span className="flex items-center text-[9px] font-semibold text-emerald-400">
              <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> +14.8%
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-sm sm:text-base font-extrabold text-white">
              ₹{(revenueData?.totalRevenue || 485200).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wider truncate">
              Today's Sales
            </span>
            <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold">
              PEAK
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-sm sm:text-base font-extrabold text-amber-400">
              ₹{(revenueData?.todayRevenue || 28450).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wider truncate">
              Avg Order (AOV)
            </span>
            <span className="flex items-center text-[9px] font-semibold text-emerald-400">
              <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> +₹35
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-sm sm:text-base font-extrabold text-white">
              ₹{revenueData?.averageOrderValue || 340}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Chart / Bar Graph */}
      <div className="flex-1 min-h-0 flex flex-col justify-end pt-1">
        <div className="flex items-center justify-between mb-1.5 text-[10px] shrink-0">
          <span className="text-neutral-300 font-medium flex items-center gap-1 truncate">
            <Calendar className="w-3 h-3 text-red-500 shrink-0" />
            {viewMode === 'weekly' ? 'Daily Revenue Velocity' : 'Monthly Sales Trajectory'}
          </span>
          <span className="text-neutral-400 text-[9px] hidden sm:inline">Hover bars for details</span>
        </div>

        {/* Bar Graph Container */}
        <div className="h-28 sm:h-32 w-full flex items-end gap-1.5 sm:gap-2.5 pt-4 pb-1.5 px-2 rounded-lg bg-neutral-950/80 border border-neutral-800/80">
          {dataList.map((item, index) => {
            const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
            const label = item.day || item.month;

            return (
              <div
                key={index}
                className="flex-1 h-full flex flex-col justify-end items-center gap-1 group relative cursor-pointer"
              >
                {/* Floating Tooltip */}
                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-neutral-900 border border-neutral-700 text-white text-[10px] px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap z-20">
                  <span className="font-semibold text-amber-400">₹{item.revenue.toLocaleString('en-IN')}</span>
                  <span className="text-neutral-400 block text-[8px]">{item.orders} orders</span>
                </div>

                {/* Vertical Bar */}
                <div className="w-full max-w-[28px] bg-neutral-800/90 rounded-t-sm overflow-hidden relative flex flex-col justify-end h-full">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-red-700 via-red-500 to-amber-500 rounded-t-sm transition-all duration-300 group-hover:brightness-125"
                  />
                </div>

                {/* Day / Month Label */}
                <span className="text-[10px] text-neutral-400 font-medium group-hover:text-white transition-colors truncate">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RevenueSummary;
