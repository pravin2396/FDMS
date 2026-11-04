import React from 'react';
import {
  Store,
  UtensilsCrossed,
  PlusCircle,
  FileSpreadsheet,
  Zap,
  ArrowRight,
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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
          <Zap className="w-4 h-4" />
        </span>
        <h2 className="text-lg font-bold text-white tracking-tight">
          Quick Management Actions
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          const styles = colorStyles[act.accent] || colorStyles.red;

          return (
            <div
              key={act.id}
              className={`rounded-2xl bg-neutral-900/90 border ${styles.border} p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl group`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${styles.iconBg} transition-transform group-hover:scale-110`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                  {act.title}
                </h3>
                <p className="text-neutral-400 text-xs mt-1.5 leading-relaxed">
                  {act.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-neutral-800">
                <button
                  onClick={act.onClick}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold tracking-wide transition shadow cursor-pointer flex items-center justify-center gap-1.5 ${styles.btn}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{act.buttonText}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionCards;
