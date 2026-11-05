import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({
  title,
  value,
  change,
  isPositive = true,
  subtext,
  icon: Icon,
  accentColor = 'red',
  badgeText,
  linkTo,
}) => {
  const colorMap = {
    red: {
      bg: 'from-red-600/20 to-red-950/30',
      border: 'border-red-500/30 hover:border-red-500/60',
      iconBg: 'bg-red-600/20 text-red-500',
      shadow: 'hover:shadow-red-950/40',
    },
    amber: {
      bg: 'from-amber-600/20 to-amber-950/30',
      border: 'border-amber-500/30 hover:border-amber-500/60',
      iconBg: 'bg-amber-600/20 text-amber-500',
      shadow: 'hover:shadow-amber-950/40',
    },
    emerald: {
      bg: 'from-emerald-600/20 to-emerald-950/30',
      border: 'border-emerald-500/30 hover:border-emerald-500/60',
      iconBg: 'bg-emerald-600/20 text-emerald-500',
      shadow: 'hover:shadow-emerald-950/40',
    },
    blue: {
      bg: 'from-blue-600/20 to-blue-950/30',
      border: 'border-blue-500/30 hover:border-blue-500/60',
      iconBg: 'bg-blue-600/20 text-blue-500',
      shadow: 'hover:shadow-blue-950/40',
    },
    purple: {
      bg: 'from-purple-600/20 to-purple-950/30',
      border: 'border-purple-500/30 hover:border-purple-500/60',
      iconBg: 'bg-purple-600/20 text-purple-500',
      shadow: 'hover:shadow-purple-950/40',
    },
    orange: {
      bg: 'from-orange-600/20 to-orange-950/30',
      border: 'border-orange-500/30 hover:border-orange-500/60',
      iconBg: 'bg-orange-600/20 text-orange-500',
      shadow: 'hover:shadow-orange-950/40',
    },
  };

  const scheme = colorMap[accentColor] || colorMap.red;

  const content = (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${scheme.bg} bg-neutral-900/90 border ${scheme.border} p-5 transition-all duration-300 hover:shadow-xl ${scheme.shadow} group h-full`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider truncate">
            {title}
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {value}
            </h3>
            {badgeText && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                {badgeText}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div
            className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${scheme.iconBg} transition-transform group-hover:scale-110 shadow-sm`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
        {change && (
          <div
            className={`flex items-center gap-1 font-semibold ${
              isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span>{change}</span>
          </div>
        )}
        {subtext && <span className="text-neutral-400 text-[11px] truncate">{subtext}</span>}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="block cursor-pointer focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};

export default StatCard;
