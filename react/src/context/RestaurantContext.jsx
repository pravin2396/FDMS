import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { restaurantService } from '../services/api';
import { toast } from 'react-toastify';

const RestaurantContext = createContext(null);

export const RestaurantProvider = ({ children }) => {
  // 1. Initialize restaurants from Local Storage if available
  const [restaurants, setRestaurants] = useState(() => {
    try {
      const saved = localStorage.getItem('fdms_restaurants');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(() => {
    try {
      const saved = localStorage.getItem('fdms_restaurants');
      return !saved || JSON.parse(saved).length === 0;
    } catch {
      return true;
    }
  });

  const [error, setError] = useState(null);

  // Search & Filter & Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [sortBy, setSortBy] = useState('popularity'); // 'popularity' | 'rating' | 'deliveryTime' | 'deliveryCharge'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Favorites in LocalStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('fdms_favorite_restaurants');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fetch from Third-Party API via Axios & persist in LocalStorage
  const fetchRestaurants = async () => {
    try {
      if (restaurants.length === 0) {
        setLoading(true);
      }
      setError(null);
      const data = await restaurantService.getRestaurants();
      setRestaurants(data);
      // Persist in LocalStorage
      localStorage.setItem('fdms_restaurants', JSON.stringify(data));
    } catch (err) {
      console.error('Failed to load restaurants from API:', err);
      if (restaurants.length === 0) {
        setError('Failed to fetch restaurant list from third-party API. Please check your connection.');
        toast.error('Could not load restaurants from API');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Save changes to localStorage whenever restaurants update
  useEffect(() => {
    if (restaurants && restaurants.length > 0) {
      try {
        localStorage.setItem('fdms_restaurants', JSON.stringify(restaurants));
      } catch (e) {
        console.warn('Could not save restaurants to localStorage', e);
      }
    }
  }, [restaurants]);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fdms_favorite_restaurants', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Could not save favorites to localStorage', e);
    }
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const isFav = prev.includes(id);
      const updated = isFav ? prev.filter((item) => item !== id) : [...prev, id];
      toast.info(isFav ? 'Removed from favorite restaurants' : 'Added to favorite restaurants!');
      return updated;
    });
  };

  // Add restaurant & persist to LocalStorage
  const addRestaurant = (newRestaurant) => {
    const formatted = {
      id: `rst-${Date.now()}`,
      name: newRestaurant.name,
      image:
        newRestaurant.image ||
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      cuisine: newRestaurant.cuisine || 'Multi-Cuisine',
      rating: 4.8,
      reviewCount: 1,
      deliveryTime: '20-30 mins',
      deliveryTimeMinutes: 25,
      deliveryCharges: 0,
      address: newRestaurant.location || 'Food Court Floor 2, Central Plaza',
      isOpen: true,
      openingHours: '10:00 AM - 11:00 PM',
      phone: newRestaurant.contact || '+91 98765 00000',
      description: `Freshly onboarded partner offering high-quality ${newRestaurant.cuisine || 'culinary'} specialties.`,
      tags: [newRestaurant.cuisine || 'Specialty', 'Food Court Partner'],
      dishes: [],
    };

    setRestaurants((prev) => {
      const updated = [formatted, ...prev];
      try {
        localStorage.setItem('fdms_restaurants', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save new restaurant to localStorage', e);
      }
      return updated;
    });
  };

  // Handlers that reset page to 1 on filter/search change
  const handleSetSearchQuery = (q) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const handleSetSelectedCuisine = (c) => {
    setSelectedCuisine(c);
    setCurrentPage(1);
  };

  const handleSetSelectedRating = (r) => {
    setSelectedRating(r);
    setCurrentPage(1);
  };

  const handleSetSortBy = (s) => {
    setSortBy(s);
    setCurrentPage(1);
  };

  // Reset all search and filter controls
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCuisine('All');
    setSelectedRating('All');
    setSortBy('popularity');
    setCurrentPage(1);
    toast.info('All filters reset');
  };

  // Compute filtered & sorted list
  const filteredRestaurants = useMemo(() => {
    return restaurants
      .filter((restaurant) => {
        // Search query filter (matches name, cuisine, address, or tags)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = restaurant.name.toLowerCase().includes(q);
          const matchCuisine = restaurant.cuisine.toLowerCase().includes(q);
          const matchAddress = restaurant.address.toLowerCase().includes(q);
          const matchTags = restaurant.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchCuisine && !matchAddress && !matchTags) {
            return false;
          }
        }

        // Cuisine filter
        if (selectedCuisine !== 'All') {
          if (restaurant.cuisine.toLowerCase() !== selectedCuisine.toLowerCase()) {
            return false;
          }
        }

        // Rating filter
        if (selectedRating !== 'All') {
          const minRating = parseFloat(selectedRating);
          if (restaurant.rating < minRating) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popularity') {
          return b.reviewCount - a.reviewCount;
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'deliveryTime') {
          return a.deliveryTimeMinutes - b.deliveryTimeMinutes;
        }
        if (sortBy === 'deliveryCharge') {
          return a.deliveryCharges - b.deliveryCharges;
        }
        return 0;
      });
  }, [restaurants, searchQuery, selectedCuisine, selectedRating, sortBy]);

  // Paginated records
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage) || 1;
  const paginatedRestaurants = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRestaurants.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRestaurants, currentPage, itemsPerPage]);

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        filteredRestaurants,
        paginatedRestaurants,
        loading,
        error,
        searchQuery,
        setSearchQuery: handleSetSearchQuery,
        selectedCuisine,
        setSelectedCuisine: handleSetSelectedCuisine,
        selectedRating,
        setSelectedRating: handleSetSelectedRating,
        sortBy,
        setSortBy: handleSetSortBy,
        currentPage,
        setCurrentPage,
        totalPages,
        totalCount: filteredRestaurants.length,
        favorites,
        toggleFavorite,
        resetFilters,
        fetchRestaurants,
        addRestaurant,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurants = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurants must be used within a RestaurantProvider');
  }
  return context;
};

export default RestaurantContext;
