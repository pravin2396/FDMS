import axios from 'axios';

// Base API configuration using DummyJSON for food / recipes
const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach simulated auth token if present
api.interceptors.request.use(
  (config) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const session = localStorage.getItem('fdms_user_session');
        if (session) {
          const { token } = JSON.parse(session);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      }
    } catch (e) {
      console.warn('Could not parse auth session token', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Third-Party API service for recipes / food items
export const foodService = {
  getRecipes: async (limit = 30, skip = 0) => {
    const res = await api.get(`/recipes?limit=${limit}&skip=${skip}`);
    return res.data;
  },
  getRecipeById: async (id) => {
    const res = await api.get(`/recipes/${id}`);
    return res.data;
  },
  searchRecipes: async (query) => {
    const res = await api.get(`/recipes/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};

// Curated Restaurant Base Partners with realistic Food Court metadata
const RESTAURANT_PARTNERS_BASE = [
  {
    id: 'rst-1',
    name: 'Bella Italia Trattoria',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Italian',
    rating: 4.8,
    reviewCount: 312,
    deliveryTime: '25-35 mins',
    deliveryTimeMinutes: 30,
    deliveryCharges: 0,
    address: 'Stall #12, 2nd Floor Gourmet Plaza, Food Court',
    isOpen: true,
    openingHours: '10:30 AM - 11:00 PM',
    phone: '+91 98765 11001',
    description: 'Authentic stone-oven artisanal pizzas, creamy pastas, and fresh Italian herbs.',
    tags: ['Woodfired Pizza', 'Pasta', 'Garlic Bread', 'Gelato'],
    featuredDishIds: [1, 9, 21],
  },
  {
    id: 'rst-2',
    name: 'Spice Route Royal Dhaba',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Indian',
    rating: 4.9,
    reviewCount: 488,
    deliveryTime: '20-30 mins',
    deliveryTimeMinutes: 25,
    deliveryCharges: 25,
    address: 'Stall #05, Heritage Pavilion, Food Court Level 1',
    isOpen: true,
    openingHours: '11:00 AM - 11:30 PM',
    phone: '+91 98765 11002',
    description: 'Rich North Indian curries, buttery tandoori naans, and aromatic dum biryanis.',
    tags: ['Dum Biryani', 'Butter Chicken', 'Paneer Tikka', 'Dal Makhani'],
    featuredDishIds: [11, 14, 25],
  },
  {
    id: 'rst-3',
    name: 'Dragon Wok Asian Lounge',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Asian',
    rating: 4.7,
    reviewCount: 265,
    deliveryTime: '30-40 mins',
    deliveryTimeMinutes: 35,
    deliveryCharges: 30,
    address: 'Stall #18, East Wing Food Court, Metro Walk',
    isOpen: true,
    openingHours: '11:30 AM - 10:45 PM',
    phone: '+91 98765 11003',
    description: 'Sizzling wok bowls, dimsums, spicy schezwan ramen, and spring rolls.',
    tags: ['Hakka Noodles', 'Dimsums', 'Ramen', 'Spring Rolls'],
    featuredDishIds: [2, 17, 28],
  },
  {
    id: 'rst-4',
    name: 'Burger Barn & Shakes',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    cuisine: 'American',
    rating: 4.6,
    reviewCount: 390,
    deliveryTime: '15-25 mins',
    deliveryTimeMinutes: 20,
    deliveryCharges: 0,
    address: 'Stall #02, Central Food Court Hub',
    isOpen: true,
    openingHours: '10:00 AM - Midnight',
    phone: '+91 98765 11004',
    description: 'Double smash cheeseburgers, peri-peri loaded fries, and thick malt shakes.',
    tags: ['Smash Burgers', 'Peri Peri Fries', 'Milkshakes', 'Wings'],
    featuredDishIds: [3, 8, 19],
  },
  {
    id: 'rst-5',
    name: 'El Mexicano Cantina',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Mexican',
    rating: 4.5,
    reviewCount: 184,
    deliveryTime: '25-35 mins',
    deliveryTimeMinutes: 30,
    deliveryCharges: 40,
    address: 'Stall #21, Sunset Terrace, Food Court 3rd Floor',
    isOpen: true,
    openingHours: '12:00 PM - 11:00 PM',
    phone: '+91 98765 11005',
    description: 'Crispy tacos, cheesy burritos, fresh guacamole, and loaded spicy nachos.',
    tags: ['Tacos', 'Burritos', 'Loaded Nachos', 'Quesadillas'],
    featuredDishIds: [12, 22, 29],
  },
  {
    id: 'rst-6',
    name: 'Mediterranean Olive & Grill',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Mediterranean',
    rating: 4.8,
    reviewCount: 228,
    deliveryTime: '30-45 mins',
    deliveryTimeMinutes: 38,
    deliveryCharges: 0,
    address: 'Stall #09, Global Cuisines Promenade, Food Court',
    isOpen: true,
    openingHours: '11:00 AM - 10:30 PM',
    phone: '+91 98765 11006',
    description: 'Warm pita breads, creamy hummus, grilled falafel wraps, and Greek salads.',
    tags: ['Falafel Wrap', 'Hummus Pita', 'Greek Salad', 'Shakshuka'],
    featuredDishIds: [5, 13, 27],
  },
  {
    id: 'rst-7',
    name: 'Sweet Tooth Dessert House',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Desserts',
    rating: 4.7,
    reviewCount: 410,
    deliveryTime: '15-20 mins',
    deliveryTimeMinutes: 18,
    deliveryCharges: 20,
    address: 'Kiosk K-3, Food Court Main Entrance',
    isOpen: true,
    openingHours: '09:30 AM - Midnight',
    phone: '+91 98765 11007',
    description: 'Warm Belgian waffles, chocolate lava cakes, churros, and specialty sundaes.',
    tags: ['Choco Lava', 'Belgian Waffles', 'Sundae', 'Brownies'],
    featuredDishIds: [3, 7, 18],
  },
  {
    id: 'rst-8',
    name: 'Tokyo Ramen Bar',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Asian',
    rating: 4.6,
    reviewCount: 195,
    deliveryTime: '25-35 mins',
    deliveryTimeMinutes: 30,
    deliveryCharges: 35,
    address: 'Stall #16, 2nd Floor Asian Hub, Food Court',
    isOpen: false,
    openingHours: 'Opens at 05:00 PM',
    phone: '+91 98765 11008',
    description: 'Slow-simmered rich broth ramen, crispy gyoza, and teriyaki bowls.',
    tags: ['Shoyu Ramen', 'Gyoza', 'Teriyaki', 'Miso Soup'],
    featuredDishIds: [6, 16, 24],
  },
  {
    id: 'rst-9',
    name: 'Tandoori Nights Grill',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Indian',
    rating: 4.4,
    reviewCount: 162,
    deliveryTime: '35-45 mins',
    deliveryTimeMinutes: 40,
    deliveryCharges: 30,
    address: 'Stall #07, Heritage Pavilion, Food Court Level 1',
    isOpen: true,
    openingHours: '12:00 PM - 11:30 PM',
    phone: '+91 98765 11009',
    description: 'Charcoal grilled kebabs, spicy biryanis, and traditional Punjabi gravies.',
    tags: ['Seekh Kebab', 'Tandoori Chicken', 'Rumali Roti'],
    featuredDishIds: [14, 25, 30],
  },
];

// Third-Party Restaurant API integration service
export const restaurantService = {
  // Fetch list of restaurants, enriched with live third-party recipe data from DummyJSON
  getRestaurants: async () => {
    // 1. Fetch live recipe data from DummyJSON via Axios
    const recipesData = await foodService.getRecipes(30, 0);
    const recipesList = recipesData.recipes || [];

    // 2. Map and enrich restaurant partners with their live dishes
    const enriched = RESTAURANT_PARTNERS_BASE.map((rest, index) => {
      // Find matching or associated live recipes from DummyJSON
      const associatedDishes = recipesList
        .filter(
          (recipe) =>
            recipe.cuisine?.toLowerCase() === rest.cuisine.toLowerCase() ||
            rest.featuredDishIds.includes(recipe.id)
        )
        .slice(0, 4);

      // Fallback dishes from recipes list if cuisine match is small
      const finalDishes =
        associatedDishes.length > 0
          ? associatedDishes
          : recipesList.slice(index * 2, index * 2 + 3);

      return {
        ...rest,
        dishes: finalDishes,
      };
    });

    return enriched;
  },

  // Fetch individual restaurant details by ID along with its full live menu
  getRestaurantById: async (id) => {
    const all = await restaurantService.getRestaurants();
    const found = all.find((r) => r.id === id);
    if (!found) {
      throw new Error(`Restaurant with ID ${id} not found`);
    }

    // Also fetch full recipes list to allow ordering items from this restaurant
    const recipesData = await foodService.getRecipes(30, 0);
    const allRecipes = recipesData.recipes || [];

    const menu = allRecipes.filter(
      (r) =>
        r.cuisine?.toLowerCase() === found.cuisine.toLowerCase() ||
        found.featuredDishIds.includes(r.id)
    );

    return {
      ...found,
      menu: menu.length > 0 ? menu : allRecipes.slice(0, 6),
    };
  },
};

export default api;
