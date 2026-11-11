import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { menuService } from '../services/api';
import { useDashboard } from './DashboardContext';
import { toast } from 'react-toastify';

const MenuContext = createContext(null);

export const MenuProvider = ({ children }) => {
  const { setTotalFoodItems } = useDashboard();

  // 1. Initialize menu items from Local Storage if available (with schema sanitization)
  const [menuItems, setMenuItems] = useState(() => {
    try {
      const saved = localStorage.getItem('fdms_menu_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item) => ({
            ...item,
            ingredients: Array.isArray(item.ingredients)
              ? item.ingredients
              : typeof item.ingredients === 'string' && item.ingredients.trim()
              ? item.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
              : ['Fresh ingredients', 'Chef spices'],
            instructions: Array.isArray(item.instructions)
              ? item.instructions
              : typeof item.instructions === 'string' && item.instructions.trim()
              ? item.instructions.split('\n').map((s) => s.trim()).filter(Boolean)
              : ['Freshly cooked on order in the food court kitchen.'],
          }));
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(() => {
    try {
      const saved = localStorage.getItem('fdms_menu_items');
      return !saved || JSON.parse(saved).length === 0;
    } catch {
      return true;
    }
  });

  const [error, setError] = useState(null);

  // Search & Filter & Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegFilter, setVegFilter] = useState('all'); // 'all' | 'veg' | 'non-veg'
  const [sortOption, setSortOption] = useState('default'); // 'default' | 'price-asc' | 'price-desc' | 'rating-desc'

  // Fetch from Third-Party API via Axios & persist in LocalStorage
  const fetchMenuItems = async () => {
    try {
      if (menuItems.length === 0) {
        setLoading(true);
      }
      setError(null);
      const data = await menuService.getMenuItems();
      setMenuItems(data);
      localStorage.setItem('fdms_menu_items', JSON.stringify(data));
      localStorage.setItem('fdms_total_food_items', data.length.toString());
      if (setTotalFoodItems) {
        setTotalFoodItems(data.length);
      }
    } catch (err) {
      console.error('Failed to load menu items:', err);
      if (menuItems.length === 0) {
        setError('Failed to fetch menu items from third-party API.');
        toast.error('Could not load menu items from API');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Sync to LocalStorage on updates
  useEffect(() => {
    if (menuItems && menuItems.length > 0) {
      try {
        localStorage.setItem('fdms_menu_items', JSON.stringify(menuItems));
      } catch (e) {
        console.warn('Could not save menu items to localStorage', e);
      }
    }
  }, [menuItems]);

  // CRUD Actions
  // 1. Add New Menu Item (Replicates in Network Tab via POST /recipes/add & in Dashboard metrics)
  const addMenuItem = async (itemData) => {
    const newItem = {
      id: `food-${Date.now()}`,
      name: itemData.name.trim(),
      description: itemData.description?.trim() || 'Freshly prepared chef specialty dish.',
      price: parseFloat(itemData.price) || 299,
      category: itemData.category || 'Main Course',
      isVeg: itemData.isVeg === true || itemData.isVeg === 'true',
      image:
        itemData.image?.trim() ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      isAvailable: itemData.isAvailable !== false && itemData.isAvailable !== 'false',
      prepTime: parseInt(itemData.prepTime, 10) || 20,
      calories: parseInt(itemData.calories, 10) || 350,
      rating: 4.8,
      ingredients: itemData.ingredients
        ? (Array.isArray(itemData.ingredients)
            ? itemData.ingredients
            : itemData.ingredients.split(',').map((s) => s.trim()).filter(Boolean))
        : ['Fresh ingredients', 'Chef spices'],
      instructions: ['Freshly cooked on order in the food court kitchen.'],
    };

    // Fire real Axios POST request to Third-Party DummyJSON API
    try {
      await menuService.createMenuItem(newItem);
    } catch (e) {
      console.warn('API POST error handled gracefully:', e);
    }

    setMenuItems((prev) => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem('fdms_menu_items', JSON.stringify(updated));
        localStorage.setItem('fdms_total_food_items', updated.length.toString());
      } catch (e) {
        console.warn('Could not save to localStorage:', e);
      }
      return updated;
    });

    if (setTotalFoodItems) {
      setTotalFoodItems((prev) => prev + 1);
    }

    toast.success(`"${newItem.name}" added to menu successfully!`);
    return newItem;
  };

  // 2. Edit Menu Item (Replicates in Network Tab via PUT /recipes/:id & in Dashboard metrics)
  const updateMenuItem = async (id, updatedData) => {
    // Fire real Axios PUT request to Third-Party DummyJSON API
    try {
      await menuService.updateMenuItem(id, updatedData);
    } catch (e) {
      console.warn('API PUT error handled gracefully:', e);
    }

    setMenuItems((prev) => {
      const updated = prev.map((item) => {
        if (
          String(item.id) === String(id) ||
          String(item.id).replace(/^food-/, '') === String(id).replace(/^food-/, '')
        ) {
          const rawIng = updatedData.ingredients !== undefined ? updatedData.ingredients : item.ingredients;
          const parsedIngredients = Array.isArray(rawIng)
            ? rawIng
            : typeof rawIng === 'string' && rawIng.trim()
            ? rawIng.split(',').map((s) => s.trim()).filter(Boolean)
            : item.ingredients || ['Fresh ingredients'];

          const rawIns = updatedData.instructions !== undefined ? updatedData.instructions : item.instructions;
          const parsedInstructions = Array.isArray(rawIns)
            ? rawIns
            : typeof rawIns === 'string' && rawIns.trim()
            ? rawIns.split('\n').map((s) => s.trim()).filter(Boolean)
            : item.instructions || ['Freshly cooked on order in the food court kitchen.'];

          return {
            ...item,
            ...updatedData,
            name: updatedData.name?.trim() || item.name,
            description: updatedData.description?.trim() || item.description,
            price: parseFloat(updatedData.price) || item.price,
            category: updatedData.category || item.category,
            isVeg: updatedData.isVeg === true || updatedData.isVeg === 'true',
            image: updatedData.image?.trim() || item.image,
            isAvailable: updatedData.isAvailable !== undefined ? Boolean(updatedData.isAvailable) : item.isAvailable,
            prepTime: parseInt(updatedData.prepTime, 10) || item.prepTime,
            calories: parseInt(updatedData.calories, 10) || item.calories,
            ingredients: parsedIngredients,
            instructions: parsedInstructions,
          };
        }
        return item;
      });
      try {
        localStorage.setItem('fdms_menu_items', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save updated menu to localStorage:', e);
      }
      return updated;
    });

    toast.success('Menu item updated successfully!');
  };

  // 3. Delete Menu Item (Replicates in Network Tab via DELETE /recipes/:id & in Dashboard metrics)
  const deleteMenuItem = async (id) => {
    // Fire real Axios DELETE request to Third-Party DummyJSON API
    try {
      await menuService.deleteMenuItem(id);
    } catch (e) {
      console.warn('API DELETE error handled gracefully:', e);
    }

    setMenuItems((prev) => {
      const target = prev.find(
        (item) =>
          String(item.id) === String(id) ||
          String(item.id).replace(/^food-/, '') === String(id).replace(/^food-/, '')
      );
      const updated = prev.filter(
        (item) =>
          String(item.id) !== String(id) &&
          String(item.id).replace(/^food-/, '') !== String(id).replace(/^food-/, '')
      );
      try {
        localStorage.setItem('fdms_menu_items', JSON.stringify(updated));
        localStorage.setItem('fdms_total_food_items', updated.length.toString());
      } catch (e) {
        console.warn('Could not save updated menu count to localStorage:', e);
      }
      if (target) {
        toast.info(`"${target.name}" removed from menu.`);
      }
      return updated;
    });

    if (setTotalFoodItems) {
      setTotalFoodItems((prev) => Math.max(0, prev - 1));
    }
  };

  // 4. Toggle Availability
  const toggleAvailability = (id) => {
    setMenuItems((prev) => {
      const updated = prev.map((item) => {
        if (item.id.toString() === id.toString()) {
          const nextStatus = !item.isAvailable;
          toast.info(`${item.name} is now ${nextStatus ? 'Available' : 'Out of Stock'}`);
          return { ...item, isAvailable: nextStatus };
        }
        return item;
      });
      localStorage.setItem('fdms_menu_items', JSON.stringify(updated));
      return updated;
    });
  };

  // Reset Filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setVegFilter('all');
    setSortOption('default');
    toast.info('Menu filters reset');
  };

  // Filtered & Sorted items computation
  const filteredMenuItems = useMemo(() => {
    return menuItems
      .filter((item) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          const matchIngredients = Array.isArray(item.ingredients)
            ? item.ingredients.some((ing) => typeof ing === 'string' && ing.toLowerCase().includes(q))
            : typeof item.ingredients === 'string'
            ? item.ingredients.toLowerCase().includes(q)
            : false;
          if (!matchName && !matchDesc && !matchCat && !matchIngredients) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'All') {
          if (item.category.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }

        // Veg / Non-Veg filter
        if (vegFilter === 'veg' && !item.isVeg) return false;
        if (vegFilter === 'non-veg' && item.isVeg) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'price-asc') {
          return a.price - b.price;
        }
        if (sortOption === 'price-desc') {
          return b.price - a.price;
        }
        if (sortOption === 'rating-desc') {
          return b.rating - a.rating;
        }
        return 0;
      });
  }, [menuItems, searchQuery, selectedCategory, vegFilter, sortOption]);

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        filteredMenuItems,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        vegFilter,
        setVegFilter,
        sortOption,
        setSortOption,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleAvailability,
        resetFilters,
        fetchMenuItems,
        totalCount: filteredMenuItems.length,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

export default MenuContext;
