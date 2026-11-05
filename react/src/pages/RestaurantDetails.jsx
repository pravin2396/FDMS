import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { restaurantService } from '../services/api';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Star,
  Clock,
  Bike,
  MapPin,
  Phone,
  Calendar,
  UtensilsCrossed,
  ShoppingBag,
  Flame,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'react-toastify';

const RestaurantDetails = () => {
  const { id } = useParams();
  const { addNewOrder } = useDashboard();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await restaurantService.getRestaurantById(id);
        setRestaurant(data);
      } catch (err) {
        console.error('Failed to load restaurant details:', err);
        setError(err.message || 'Restaurant not found');
        toast.error('Could not load restaurant details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleAddToCart = (dish) => {
    const dishPrice = parseInt(((dish.prepTimeMinutes || 20) * 12 + 199).toFixed(0), 10);
    addNewOrder({
      customerName: user?.name || 'Pravin',
      avatar:
        user?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      restaurant: restaurant?.name || 'Food Court Restaurant',
      items: dish.name,
      amount: dishPrice,
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans w-full">
      {/* Top Navbar */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Layout */}
      <div className="flex-1 flex w-full relative overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          activeTab="restaurants"
          onSelectTab={() => setIsSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 bg-neutral-950">
          {/* Back Navigation Button */}
          <div>
            <Link
              to="/restaurants"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Restaurant List</span>
            </Link>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-24 text-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-red-500 mx-auto" />
              <p className="text-neutral-400 text-sm">
                Fetching restaurant profile 
              </p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="p-8 rounded-2xl bg-red-950/40 border border-red-800 text-center space-y-3 max-w-lg mx-auto my-12">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Error Loading Restaurant</h3>
              <p className="text-xs text-red-300">{error}</p>
              <Link
                to="/restaurants"
                className="inline-block px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow transition"
              >
                Return to Restaurants
              </Link>
            </div>
          )}

          {/* Restaurant Details View */}
          {!loading && !error && restaurant && (
            <div className="space-y-8">
              {/* Hero Banner Card */}
              <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
                {/* Background Image */}
                <div className="h-64 sm:h-80 w-full relative">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent"></div>
                </div>

                {/* Info Overlay */}
                <div className="p-6 sm:p-8 -mt-24 relative z-10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-600/90 text-white">
                          {restaurant.cuisine} Specialty
                        </span>
                        {restaurant.isOpen ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/90 text-white">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            Open Now
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600/90 text-white">
                            Currently Closed
                          </span>
                        )}
                      </div>
                      <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                        {restaurant.name}
                      </h1>
                      <p className="text-neutral-300 text-sm max-w-2xl mt-1 leading-relaxed">
                        {restaurant.description}
                      </p>
                    </div>

                    {/* Rating Badge */}
                    <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-700/80 backdrop-blur-md flex sm:flex-col items-center justify-center text-center self-start sm:self-auto gap-2 sm:gap-0">
                      <div className="flex items-center gap-1 text-amber-400 font-extrabold text-xl">
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                        <span>{restaurant.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-[11px] text-neutral-400 font-medium">
                        {restaurant.reviewCount} customer reviews
                      </span>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-neutral-800">
                    <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-red-500 shrink-0" />
                      <div className="text-xs">
                        <span className="text-neutral-400 block text-[10px]">Delivery Time</span>
                        <span className="font-bold text-white">{restaurant.deliveryTime}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 flex items-center gap-2.5">
                      <Bike className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div className="text-xs">
                        <span className="text-neutral-400 block text-[10px]">Delivery Fee</span>
                        <span className="font-bold text-emerald-400">
                          {restaurant.deliveryCharges === 0 ? 'Free Delivery' : `₹${restaurant.deliveryCharges}`}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                      <div className="text-xs">
                        <span className="text-neutral-400 block text-[10px]">Opening Hours</span>
                        <span className="font-semibold text-neutral-200 truncate">{restaurant.openingHours}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                      <div className="text-xs">
                        <span className="text-neutral-400 block text-[10px]">Contact</span>
                        <span className="font-semibold text-neutral-200 truncate">{restaurant.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-center gap-2 text-xs text-neutral-400 pt-1">
                    <MapPin className="w-4 h-4 text-neutral-500 shrink-0" />
                    <span>{restaurant.address}</span>
                  </div>
                </div>
              </div>

              {/* Menu Items Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-red-600/20 text-red-500">
                      <UtensilsCrossed className="w-4 h-4" />
                    </span>
                    <h2 className="text-xl font-bold text-white">
                      Live Menu & Chef Specials
                    </h2>
                  </div>
                  <span className="text-xs text-neutral-400">
                    
                  </span>
                </div>

                {/* Dishes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurant.menu?.map((dish) => (
                    <div
                      key={dish.id}
                      className="group rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-red-500/50 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-red-950/20"
                    >
                      <div>
                        {/* Dish Image */}
                        <div className="relative h-44 overflow-hidden bg-neutral-800">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md flex items-center gap-1 text-xs font-bold text-amber-400 border border-white/10">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{dish.rating}</span>
                          </div>
                          <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-600/90 text-white">
                            {dish.cuisine || restaurant.cuisine}
                          </span>
                        </div>

                        {/* Dish Details */}
                        <div className="p-4 space-y-2">
                          <h3 className="font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                            {dish.name}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-neutral-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-neutral-500" />
                              {dish.prepTimeMinutes || 20} mins
                            </span>
                            <span className="flex items-center gap-1">
                              <Flame className="w-3.5 h-3.5 text-amber-500" />
                              {dish.caloriesPerServing || 350} kcal
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Add to Order */}
                      <div className="p-4 pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                        <span className="text-lg font-bold text-white">
                          ₹{((dish.prepTimeMinutes || 20) * 12 + 199).toFixed(0)}
                        </span>
                        <button
                          onClick={() => handleAddToCart(dish)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow transition cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Order</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RestaurantDetails;
