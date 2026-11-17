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
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${scheme.bg} bg-neutral-900/90 border ${scheme.border} p-3 sm:p-3.5 transition-all duration-300 hover:shadow-lg ${scheme.shadow} group h-full flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider truncate">
            {title}
          </p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
              {value}
            </h3>
            {badgeText && (
              <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                {badgeText}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div
            className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${scheme.iconBg} transition-transform group-hover:scale-110 shadow-sm`}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2 pt-1.5 border-t border-neutral-800/80 flex items-center justify-between text-[10px]">
        {change && (
          <div
            className={`flex items-center gap-1 font-semibold truncate ${
              isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3 shrink-0" />
            ) : (
              <TrendingDown className="w-3 h-3 shrink-0" />
            )}
            <span className="truncate">{change}</span>
          </div>
        )}
        {subtext && <span className="text-neutral-400 text-[10px] truncate ml-1">{subtext}</span>}
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
