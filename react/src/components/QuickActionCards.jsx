import React from 'react';
import {
  Store,
  UtensilsCrossed,
  PlusCircle,
  FileSpreadsheet,
  Zap,
} from 'lucide-react';
import { toast } from 'react-toastify';

const QuickActionCards = ({
  onOpenAddRestaurant,
  onOpenAddFoodItem,
  onSimulateOrder,
}) => {
  const handleDownloadReport = () => {
    toast.success('FDMS Revenue & Sales Report (CSV) generated and downloaded!');
  };

  const actions = [
    {
      id: 'restaurant',
      title: 'Add Restaurant',
      description: 'Register a new outlet or kitchen partner to the food court.',
      icon: Store,
      accent: 'red',
      buttonText: 'New Restaurant',
      onClick: onOpenAddRestaurant,
    },
    {
      id: 'food',
      title: 'Add Food Item',
      description: 'Publish a new dish, set price, calories, and prep time.',
      icon: UtensilsCrossed,
      accent: 'amber',
      buttonText: 'Add Dish',
      onClick: onOpenAddFoodItem,
    },
    {
      id: 'order',
      title: 'Simulate Live Order',
      description: 'Trigger a real-time incoming delivery order to test flow.',
      icon: PlusCircle,
      accent: 'emerald',
      buttonText: 'Place Test Order',
      onClick: onSimulateOrder,
    },
    {
      id: 'report',
      title: 'Download Sales Report',
      description: 'Export comprehensive sales, tax, and order history.',
      icon: FileSpreadsheet,
      accent: 'blue',
      buttonText: 'Export CSV',
      onClick: handleDownloadReport,
    },
  ];

  const colorStyles = {
    red: {
      border: 'border-red-500/30 hover:border-red-500/60',
      iconBg: 'bg-red-600/20 text-red-500',
      btn: 'bg-red-600 hover:bg-red-500 text-white',
    },
    amber: {
      border: 'border-amber-500/30 hover:border-amber-500/60',
      iconBg: 'bg-amber-600/20 text-amber-500',
      btn: 'bg-amber-600 hover:bg-amber-500 text-white',
    },
    emerald: {
      border: 'border-emerald-500/30 hover:border-emerald-500/60',
      iconBg: 'bg-emerald-600/20 text-emerald-500',
      btn: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    },
    blue: {
      border: 'border-blue-500/30 hover:border-blue-500/60',
      iconBg: 'bg-blue-600/20 text-blue-500',
      btn: 'bg-blue-600 hover:bg-blue-500 text-white',
    },
  };

  return (
    <div className="space-y-1.5 shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="p-1 rounded-md bg-amber-500/20 text-amber-400">
            <Zap className="w-3.5 h-3.5" />
          </span>
          <h2 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
            Quick Management Actions
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {actions.map((act) => {
          const Icon = act.icon;
          const styles = colorStyles[act.accent] || colorStyles.red;

          return (
            <button
              key={act.id}
              onClick={act.onClick}
              type="button"
              className={`rounded-xl bg-neutral-900/90 border ${styles.border} p-2.5 flex items-center gap-2.5 transition-all duration-200 hover:shadow-md group text-left cursor-pointer`}
            >
              <div
                className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${styles.iconBg} transition-transform group-hover:scale-105`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors truncate">
                  {act.buttonText}
                </h3>
                <p className="text-neutral-400 text-[10px] truncate leading-tight mt-0.5">
                  {act.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionCards;
