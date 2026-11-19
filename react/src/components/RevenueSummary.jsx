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
    <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-600/20 text-red-500">
              <CreditCard className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Revenue & Financial Summary
            </h2>
          </div>
          <p className="text-neutral-400 text-xs mt-1">
            Real-time sales, order volume, and payment trends across food court outlets.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-neutral-800/90 p-1 rounded-xl border border-neutral-700/80 self-start sm:self-auto text-xs">
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              viewMode === 'weekly'
                ? 'bg-red-600 text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Weekly Breakdown
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              viewMode === 'monthly'
                ? 'bg-red-600 text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Monthly Overview
          </button>
        </div>
      </div>

      {/* Top Quick Revenue Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Total Gross Revenue
            </span>
            <span className="flex items-center text-xs font-semibold text-emerald-400 gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +14.8%
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl sm:text-2xl font-extrabold text-white">
              ₹{(revenueData?.totalRevenue || 485200).toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Net revenue processed this financial quarter
          </p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Today's Revenue
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold">
              Peak Hours Active
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl sm:text-2xl font-extrabold text-amber-400">
              ₹{(revenueData?.todayRevenue || 28450).toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Across 94 transactions completed today
          </p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Average Order Value (AOV)
            </span>
            <span className="flex items-center text-xs font-semibold text-emerald-400 gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +₹35
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl sm:text-2xl font-extrabold text-white">
              ₹{revenueData?.averageOrderValue || 340}
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Standard customer basket spend
          </p>
        </div>
      </div>

      {/* Visual Chart / Bar Graph */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="text-neutral-300 font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-red-500" />
            {viewMode === 'weekly' ? 'Daily Revenue Velocity (Mon - Sun)' : 'Monthly Sales Trajectory'}
          </span>
          <span className="text-neutral-400 text-[11px]">Hover over bars to inspect details</span>
        </div>

        {/* Bar Graph Container */}
        <div className="h-52 w-full flex items-end gap-2 sm:gap-4 pt-6 pb-2 px-2 rounded-xl bg-neutral-950/80 border border-neutral-800/80">
          {dataList.map((item, index) => {
            const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
            const label = item.day || item.month;

            return (
              <div
                key={index}
                className="flex-1 h-full flex flex-col justify-end items-center gap-2 group relative cursor-pointer"
              >
                {/* Floating Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-neutral-900 border border-neutral-700 text-white text-[11px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-20">
                  <span className="font-semibold text-amber-400">₹{item.revenue.toLocaleString('en-IN')}</span>
                  <span className="text-neutral-400 block text-[9px]">{item.orders} orders</span>
                </div>

                {/* Vertical Bar */}
                <div className="w-full max-w-[40px] bg-neutral-800 rounded-t-md overflow-hidden relative flex flex-col justify-end h-full">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-red-700 via-red-500 to-amber-500 rounded-t-md transition-all duration-500 group-hover:brightness-125"
                  />
                </div>

                {/* Day / Month Label */}
                <span className="text-[11px] text-neutral-400 font-medium group-hover:text-white transition-colors">
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
