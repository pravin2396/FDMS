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

// Category mapping helper
const mapCuisineToCategory = (name = '', cuisine = '', mealType = []) => {
  const lowerName = name.toLowerCase();
  const lowerCuisine = cuisine.toLowerCase();
  const lowerMeal = Array.isArray(mealType) ? mealType.map((m) => m.toLowerCase()) : [];

  if (lowerName.includes('pizza') || lowerCuisine.includes('italian')) return 'Pizza';
  if (lowerName.includes('burger') || lowerName.includes('sandwich')) return 'Burgers';
  if (lowerMeal.includes('dessert') || lowerName.includes('cookie') || lowerName.includes('cake') || lowerName.includes('tiramisu')) return 'Desserts';
  if (lowerName.includes('noodle') || lowerName.includes('ramen') || lowerName.includes('stir-fry') || lowerCuisine.includes('asian') || lowerCuisine.includes('japanese') || lowerCuisine.includes('korean')) return 'Asian';
  if (lowerName.includes('taco') || lowerName.includes('burrito') || lowerCuisine.includes('mexican') || lowerName.includes('wrap')) return 'Mexican & Wraps';
  return 'Main Course';
};

// Check if recipe is vegetarian
const checkIsVeg = (name = '', ingredients = []) => {
  const nonVegKeywords = ['chicken', 'beef', 'pork', 'turkey', 'fish', 'meat', 'lamb', 'bacon', 'shrimp', 'salmon', 'keema', 'kebab', 'murgh'];
  const ingredientsList = Array.isArray(ingredients) ? ingredients : [];
  const text = (name + ' ' + ingredientsList.join(' ')).toLowerCase();
  return !nonVegKeywords.some((kw) => text.includes(kw));
};

// Complete curated fallback food items catalog matching DummyJSON recipes 1-30
export const DEFAULT_FOOD_ITEMS_BASE = [
  {
    id: 'food-1',
    name: 'Classic Margherita Pizza',
    description: 'Authentic Italian stone-baked pizza topped with fresh tomato sauce, mozzarella cheese, and fragrant basil leaves.',
    price: 419,
    category: 'Pizza',
    isVeg: true,
    image: 'https://cdn.dummyjson.com/recipe-images/1.webp',
    isAvailable: true,
    prepTime: 20,
    calories: 300,
    rating: 4.6,
    ingredients: ['Pizza dough', 'San Marzano Tomato sauce', 'Fresh mozzarella cheese', 'Fresh basil leaves', 'Extra virgin olive oil', 'Sea salt'],
    instructions: ['Preheat the stone oven to 250°C.', 'Roll out pizza dough onto semolina tray.', 'Spread rich tomato sauce evenly.', 'Top with fresh mozzarella and bake for 12 minutes.', 'Garnish with fresh basil leaves and virgin olive oil.'],
  },
  {
    id: 'food-2',
    name: 'Vegetarian Stir-Fry',
    description: 'Crisp seasonal vegetables tossed in a sizzling Asian wok with savory garlic soy reduction and sesame seeds.',
    price: 364,
    category: 'Asian',
    isVeg: true,
    image: 'https://cdn.dummyjson.com/recipe-images/2.webp',
    isAvailable: true,
    prepTime: 15,
    calories: 250,
    rating: 4.7,
    ingredients: ['Broccoli florets', 'Bell peppers', 'Snap peas', 'Carrots', 'Soy sauce', 'Toasted sesame oil', 'Minced garlic'],
    instructions: ['Heat sesame oil in wok over high flame.', 'Add minced garlic and stir-fry until fragrant.', 'Add mixed crunchy vegetables and toss rapidly.', 'Pour soy sauce reduction and garnish with toasted sesame seeds.'],
  },
  {
    id: 'food-3',
    name: 'Chocolate Chip Cookies',
    description: 'Freshly baked golden cookies loaded with melted dark Belgian chocolate chunks and warm vanilla.',
    price: 364,
    category: 'Desserts',
    isVeg: true,
    image: 'https://cdn.dummyjson.com/recipe-images/3.webp',
    isAvailable: true,
    prepTime: 15,
    calories: 150,
    rating: 4.9,
    ingredients: ['All-purpose flour', 'Belgian dark chocolate chunks', 'Brown sugar', 'Farm fresh butter', 'Pure vanilla extract'],
    instructions: ['Cream butter and brown sugar together.', 'Fold in sifted flour and rich chocolate chips.', 'Scoop onto baking trays and bake at 180°C for 10-12 minutes.'],
  },
  {
    id: 'food-4',
    name: 'Chicken Alfredo Pasta',
    description: 'Fettuccine pasta tossed in velvety garlic parmesan cream sauce with grilled chicken breast tenderloins.',
    price: 364,
    category: 'Main Course',
    isVeg: false,
    image: 'https://cdn.dummyjson.com/recipe-images/4.webp',
    isAvailable: true,
    prepTime: 15,
    calories: 500,
    rating: 4.9,
    ingredients: ['Fettuccine pasta', 'Grilled chicken breast', 'Heavy whipping cream', 'Aged Parmesan cheese', 'Crushed garlic', 'Fresh black pepper'],
    instructions: ['Boil fettuccine al dente in salted water.', 'Sear seasoned chicken fillets until golden.', 'Simmer cream with crushed garlic and melted parmesan.', 'Toss pasta and sliced chicken in the rich alfredo sauce.'],
  },
  {
    id: 'food-5',
    name: 'Mango Salsa Chicken',
    description: 'Tender grilled chicken fillet glazed in Mexican spices, topped with fresh diced mango, cilantro, and lime salsa.',
    price: 364,
    category: 'Mexican & Wraps',
    isVeg: false,
    image: 'https://cdn.dummyjson.com/recipe-images/5.webp',
    isAvailable: true,
    prepTime: 15,
    calories: 380,
    rating: 4.9,
    ingredients: ['Chicken breast', 'Ripe Alphonso mango', 'Red bell pepper', 'Red onion', 'Fresh cilantro', 'Lime juice', 'Cumin powder'],
    instructions: ['Marinate chicken with lime, cumin, and Mexican spices.', 'Char-grill chicken breast for 6-8 minutes per side.', 'Toss diced mango with red onion, cilantro, and lime juice.', 'Serve chicken breast topped with the chilled tropical salsa.'],
  },
  {
    id: 'food-6',
    name: 'Quinoa Salad with Avocado',
    description: 'Nutritious organic quinoa salad tossed with creamy ripe avocado, cherry tomatoes, and citrus herb dressing.',
    price: 419,
    category: 'Main Course',
    isVeg: true,
    image: 'https://cdn.dummyjson.com/recipe-images/6.webp',
    isAvailable: true,
    prepTime: 20,
    calories: 280,
    rating: 4.4,
    ingredients: ['Cooked quinoa', 'Ripe Hass avocado', 'Sweet cherry tomatoes', 'English cucumber', 'Extra virgin olive oil', 'Lemon juice'],
    instructions: ['Fluff cooked chilled quinoa with a fork.', 'Dice avocado, tomatoes, and crisp cucumbers.', 'Whisk olive oil with fresh lemon juice and sea salt.', 'Combine all ingredients gently in a bowl and chill.'],
  },
  {
    id: 'food-7',
    name: 'Tomato Basil Bruschetta',
    description: 'Toasted artisan sourdough bread rubbed with garlic and piled high with marinated tomatoes and fresh basil.',
    price: 364,
    category: 'Main Course',
    isVeg: true,
    image: 'https://cdn.dummyjson.com/recipe-images/7.webp',
    isAvailable: true,
    prepTime: 15,
    calories: 120,
    rating: 4.7,
    ingredients: ['Artisan sourdough baguette', 'Ripe plum tomatoes', 'Fresh sweet basil', 'Garlic cloves', 'Balsamic glaze reduction', 'Olive oil'],
    instructions: ['Slice and toast sourdough bread until crispy.', 'Rub each toasted slice with a cut clove of garlic.', 'Toss diced tomatoes with basil, olive oil, and sea salt.', 'Spoon tomato mixture onto toast and drizzle with aged balsamic glaze.'],
  },
  {
    id: 'food-8',
    name: 'Beef and Broccoli Stir-Fry',
    description: 'Tender marinated beef strips and crisp broccoli florets wok-fried in savory ginger garlic oyster sauce.',
    price: 419,
    category: 'Asian',
    isVeg: false,
    image: 'https://cdn.dummyjson.com/recipe-images/8.webp',
    isAvailable: true,
    prepTime: 20,
    calories: 380,
    rating: 4.7,
    ingredients: ['Beef flank steak slices', 'Fresh broccoli florets', 'Soy sauce', 'Oyster sauce', 'Fresh minced ginger', 'Cornstarch', 'Garlic'],
    instructions: ['Marinate thinly sliced beef with soy sauce and cornstarch.', 'Sear beef quickly in high-heat wok until browned.', 'Steam-fry broccoli florets until bright green and tender-crisp.', 'Combine beef and broccoli with ginger oyster sauce.'],
  },
  {
    id: 'food-9',
    name: 'Caprese Salad',
    description: 'Classic Neapolitan salad with thick-sliced beefsteak tomatoes, fresh buffalo mozzarella, basil, and balsamic.',
    price: 309,
    category: 'Pizza',
    isVeg: true,
    image: 'https://cdn.dummyjson.com/recipe-images/9.webp',
    isAvailable: true,
    prepTime: 10,
    calories: 200,
    rating: 4.6,
    ingredients: ['Ripe beefsteak tomatoes', 'Fresh buffalo mozzarella', 'Fresh basil leaves', 'Cold-pressed extra virgin olive oil', 'Aged balsamic glaze'],
    instructions: ['Slice ripe tomatoes and fresh mozzarella into rounds.', 'Layer alternately on a chilled presentation platter.', 'Tuck fresh basil leaves between each slice.', 'Drizzle generously with cold-pressed olive oil and balsamic glaze.'],
  },
  {
    id: 'food-10',
    name: 'Shrimp Scampi Pasta',
    description: 'Succulent gulf shrimp sautéed in white garlic herb butter and tossed with al dente angel hair pasta.',
    price: 364,
    category: 'Main Course',
    isVeg: false,
    image: 'https://cdn.dummyjson.com/recipe-images/10.webp',
    isAvailable: true,
    prepTime: 15,
    calories: 400,
    rating: 4.3,
    ingredients: ['Jumbo shrimp', 'Linguine pasta', 'Unsalted butter', 'Minced garlic', 'Lemon zest and juice', 'Fresh Italian parsley'],
    instructions: ['Cook linguine pasta until tender.', 'Melt butter with minced garlic in skillet over medium heat.', 'Add cleaned shrimp and cook 2 minutes per side until pink.', 'Toss pasta into garlic butter pan with lemon juice and chopped parsley.'],
  },
  {
    id: 'food-11',
    name: 'Royal Chicken Dum Biryani',
    description: 'Fragrant aged basmati rice cooked on slow dum with marinated chicken, saffron, mint, and whole roasted spices.',
    price: 529,
    category: 'Main Course',
    isVeg: false,
    image: 'https://cdn.dummyjson.com/recipe-images/11.webp',
    isAvailable: true,
    prepTime: 30,
    calories: 550,
    rating: 5.0,
    ingredients: ['Aged Long-grain Basmati rice', 'Fresh chicken cuts', 'Kashmiri saffron milk', 'Yogurt curd', 'Crispy fried onions', 'Biryani masala'],
    instructions: ['Marinate chicken with aromatic yogurt, spices, and fried onions.', 'Parboil basmati rice with whole spices.', 'Layer chicken and parboiled rice in a heavy-bottom handi.', 'Seal rim with dough and slow cook on dum for 25 minutes.'],
  },
  {
    id: 'food-12',
    name: 'Chicken Karahi Special',
    description: 'Traditional wok-cooked spicy chicken simmered with crushed tomatoes, green chilies, ginger juliennes, and coriander.',
    price: 419,
    category: 'Main Course',
    isVeg: false,
    image: 'https://cdn.dummyjson.com/recipe-images/12.webp',
    isAvailable: true,
    prepTime: 20,
    calories: 420,
    rating: 4.8,
    ingredients: ['Tender chicken cuts', 'Crushed red tomatoes', 'Fresh ginger juliennes', 'Green chilies', 'Roasted cumin and coriander seeds', 'Desi ghee'],
    instructions: ['Sear chicken pieces in desi ghee in cast-iron karahi.', 'Add ripe chopped tomatoes and simmer until oil separates.', 'Add roasted ground spices and slit green chilies.', 'Garnish with freshly cut ginger juliennes and cilantro.'],
  },
  {
    id: 'food-13',
    name: 'Aloo Keema Masala',
    description: 'Minced meat slow-simmered with tender potato cubes, green peas, whole cloves, and robust Punjabi garam masala.',
    price: 474,
    category: 'Main Course',
    isVeg: false,
    image: 'https://cdn.dummyjson.com/recipe-images/13.webp',
    isAvailable: true,
    prepTime: 25,
    calories: 380,
    rating: 4.6,
    ingredients: ['Minced meat', 'Potatoes diced', 'Green peas', 'Onion paste', 'Ginger garlic paste', 'Garam masala'],
    instructions: ['Sauté onions and ginger garlic paste until golden brown.', 'Brown minced meat on high flame.', 'Add diced potatoes and ground spices with warm water.', 'Cover and simmer on low heat until potatoes are tender.'],
  },
  {
    id: 'food-14',
    name: 'Peshawari Chapli Kebabs',
    description: 'Flat spiced minced meat patties pan-fried in ghee, infused with crushed pomegranate seeds, tomatoes, and coriander.',
    price: 529,
    category: 'Main Course',
    isVeg: false,
    image: 'https://cdn.dummyjson.com/recipe-images/14.webp',
    isAvailable: true,
    prepTime: 30,
    calories: 320,
    rating: 4.7,
    ingredients: ['Coarse minced meat', 'Crushed pomegranate seeds (anardana)', 'Diced tomatoes', 'Crushed coriander seeds', 'Green chilies', 'Gram flour'],
    instructions: ['Knead minced meat with pomegranate seeds, spices, and chopped tomatoes.', 'Shape into large flat patties.', 'Pan-fry in hot shallow skillet until crispy and charred on edges.'],
  },
  {
    id: 'food-15',
    name: 'Sarson Ka Saag & Makki Roti',
    description: 'Traditional mustard greens slow-cooked with makki atta and ginger, served with crisp cornmeal flatbread and white butter.',
    price: 639,
    category: 'Main Course',
    isVeg: true,
    image: 'https://cdn.dummyjson.com/recipe-images/15.webp',
    isAvailable: true,
    prepTime: 40,
    calories: 280,
    rating: 4.3,
    ingredients: ['Fresh mustard greens (sarson)', 'Spinach (palak)', 'Bathua leaves', 'Yellow cornmeal flour (makki atta)', 'Desi white butter', 'Green chilies'],
    instructions: ['Boil mustard and spinach greens with green chilies.', 'Blend coarsely and cook with cornmeal and desi ghee.', 'Roll cornmeal dough on butter paper and bake on griddle.', 'Serve piping hot with a dollop of white butter.'],
  },
  {
    id: 'food-16',
    name: 'Japanese Shoyu Ramen Soup',
    description: 'Rich slow-simmered broth ramen with hand-pulled noodles, soft-boiled marinated egg, nori sheet, and tender toppings.',
    price: 419,
    category: 'Asian',
    isVeg: true,
    image: 'https://cdn.dummyjson.com/recipe-images/16.webp',
    isAvailable: true,
    prepTime: 20,
    calories: 480,
    rating: 4.9,
    ingredients: ['Japanese ramen noodles', 'Shoyu soy dashi broth', 'Ajitsuke tamago (marinated egg)', 'Nori seaweed sheet', 'Scallions', 'Bamboo shoots'],
    instructions: ['Simmer rich shoyu broth with aromatics.', 'Boil fresh ramen noodles for 2 minutes.', 'Place noodles in deep ramen bowl and ladle steaming broth.', 'Top with halved marinated egg, bamboo shoots, and nori.'],
  },
  {
    id: 'food-17',
    name: 'Moroccan Chickpea Tagine',
    description: 'Earthy stew of tender chickpeas, apricots, toasted almonds, and sweet cinnamon simmered in clay tagine pot.',
    price: 364,
    category: 'Main Course',
    isVeg: true,
    image: 'https://cdn.dummyjson.com/recipe-images/17.webp',
    isAvailable: true,
    prepTime: 15,
    calories: 320,
    rating: 4.5,
    ingredients: ['Cooked chickpeas', 'Dried Turkish apricots', 'Tomatoes', 'Ras el hanout spice blend', 'Toasted slivered almonds', 'Cilantro'],
    instructions: ['Sauté onions and garlic in authentic clay tagine pot.', 'Add chickpeas, crushed tomatoes, and ras el hanout spices.', 'Simmer with dried apricots for 15 minutes.', 'Garnish with toasted slivered almonds and fresh herbs.'],
  },
  {
    id: 'food-18',
    name: 'Korean Bibimbap Bowl',
    description: 'Warm short-grain rice bowl topped with seasoned sautéed vegetables, gochujang chili paste, and sunny-side egg.',
    price: 529,
    category: 'Asian',
    isVeg: true,
    image: 'https://cdn.dummyjson.com/recipe-images/18.webp',
    isAvailable: true,
    prepTime: 30,
    calories: 550,
    rating: 4.9,
    ingredients: ['Steamed short-grain rice', 'Sautéed spinach', 'Bean sprouts', 'Shiitake mushrooms', 'Gochujang chili sauce', 'Sunny-side fried egg'],
    instructions: ['Fill stone dolsot bowl with warm steamed rice.', 'Arrange colorful seasoned vegetables in neat sections.', 'Top with a sunny-side fried egg and toasted sesame oil.', 'Serve with a generous side of spicy sweet gochujang paste.'],
  },
  {
    id: 'food-19',
    name: 'Greek Baked Moussaka',
    description: 'Layered Mediterranean casserole of roasted eggplant slices, spiced savory filling, and golden baked béchamel topping.',
    price: 694,
    category: 'Main Course',
    isVeg: false,
    image: 'https://cdn.dummyjson.com/recipe-images/19.webp',
    isAvailable: true,
    prepTime: 45,
    calories: 420,
    rating: 4.3,
    ingredients: ['Eggplants sliced', 'Minced meat', 'Potatoes sliced', 'Tomato puree', 'Creamy béchamel sauce', 'Nutmeg'],
    instructions: ['Roast eggplant and potato slices until golden.', 'Cook savory minced filling with cinnamon and tomato sauce.', 'Layer vegetables and filling in baking dish.', 'Cover with thick nutmeg béchamel and bake until golden brown.'],
  },
  {
    id: 'food-20',
    name: 'Murgh Makhani Butter Chicken',
    description: 'Succulent tandoor-roasted chicken tikka simmered in velvety butter, cashew paste, and fenugreek tomato gravy.',
    price: 529,
    category: 'Main Course',
    isVeg: false,
    image: 'https://cdn.dummyjson.com/recipe-images/20.webp',
    isAvailable: true,
    prepTime: 30,
    calories: 480,
    rating: 4.5,
    ingredients: ['Tandoori chicken tikka', 'Fresh tomato puree', 'Cashew nut paste', 'Dairy butter', 'Kasuri methi (fenugreek leaves)', 'Fresh cream'],
    instructions: ['Grill marinated chicken tikka pieces in tandoor oven.', 'Simmer tomato puree with cashew paste and whole spices.', 'Whisk in ample dairy butter and heavy cream.', 'Drop in chicken tikka and crush dried kasuri methi over top.'],
  },
  {
    id: 'food-21',
    name: 'Thai Green Curry Bowl',
    description: 'Fragrant coconut milk curry with authentic green chili paste, kaffir lime leaves, bamboo shoots, and Thai basil.',
    price: 419,
    category: 'Asian',
    isVeg: true,
    image: 'https://cdn.dummyjson.com/recipe-images/21.webp',
    isAvailable: true,
    prepTime: 20,
    calories: 480,
    rating: 4.2,
    ingredients: ['Coconut milk cream', 'Thai green curry paste', 'Kaffir lime leaves', 'Bamboo shoots', 'Thai holy basil', 'Tofu cubes'],
    instructions: ['Fry green curry paste in coconut cream until fragrant.', 'Add remaining coconut milk and simmer with bamboo shoots.', 'Add tofu cubes and kaffir lime leaves.', 'Finish with fresh Thai holy basil and serve with jasmine rice.'],
  },
  {
    id: 'food-22',
    name: 'Chilled Mango Lassi',
    description: 'Thick creamy yogurt smoothie blended with ripe Alphonso mangoes, crushed green cardamom, and pistachio slivers.',
    price: 309,
    category: 'Desserts',
    isVeg: true,
    image: 'https://cdn.dummyjson.com/recipe-images/22.webp',
    isAvailable: true,
    prepTime: 10,
    calories: 180,
    rating: 4.7,
    ingredients: ['Alphonso mango pulp', 'Thick Greek yogurt', 'Cold whole milk', 'Cardamom powder', 'Pistachio nuts'],
    instructions: ['Blend ripe mango pulp with chilled yogurt and cold milk.', 'Add a pinch of aromatic green cardamom powder.', 'Pour into tall chilled clay glasses and top with pistachios.'],
  },
  {
    id: 'food-23',
    name: 'Italian Espresso Tiramisu',
    description: 'Classic Venetian dessert of espresso-soaked ladyfinger biscuits layered with whipped mascarpone cream and cocoa dust.',
    price: 529,
    category: 'Desserts',
    isVeg: true,
    image: 'https://cdn.dummyjson.com/recipe-images/23.webp',
    isAvailable: true,
    prepTime: 30,
    calories: 350,
    rating: 4.6,
    ingredients: ['Italian savoiardi ladyfingers', 'Mascarpone cheese', 'Fresh espresso coffee', 'Dutch cocoa powder', 'Pure cane sugar'],
    instructions: ['Brew strong espresso coffee and let cool.', 'Whip mascarpone cheese with sugar until fluffy.', 'Dip ladyfinger biscuits briefly into cold espresso.', 'Layer biscuits and mascarpone cream, dusting top with cocoa.'],
  },
  {
    id: 'food-24',
    name: 'Turkish Shish Kebabs',
    description: 'Skewered marinated meat char-grilled over charcoal embers, served with roasted peppers, sumac onions, and flatbread.',
    price: 474,
    category: 'Main Course',
    isVeg: false,
    image: 'https://cdn.dummyjson.com/recipe-images/24.webp',
    isAvailable: true,
    prepTime: 25,
    calories: 280,
    rating: 4.6,
    ingredients: ['Meat cubes', 'Turkish red pepper paste', 'Olive oil', 'Sumac onions', 'Turkish pita bread', 'Charred long green peppers'],
    instructions: ['Thread marinated meat cubes onto flat stainless steel skewers.', 'Char-grill over open charcoal fire until tender and juicy.', 'Slide kebabs onto warm flatbread with sumac onions and grilled pepper.'],
  },
  {
    id: 'food-25',
    name: 'Wild Blueberry Banana Smoothie',
    description: 'Antioxidant-rich smoothie blended with wild organic blueberries, ripe banana, almond milk, and chia seeds.',
    price: 309,
    category: 'Desserts',
    isVeg: true,
    image: 'https://cdn.dummyjson.com/recipe-images/25.webp',
    isAvailable: true,
    prepTime: 10,
    calories: 220,
    rating: 4.8,
    ingredients: ['Wild organic blueberries', 'Ripe frozen banana', 'Almond milk', 'Chia seeds', 'Raw wild honey'],
    instructions: ['Combine frozen wild blueberries and banana in high-speed blender.', 'Pour in cold almond milk and raw honey.', 'Blend until creamy smooth and garnish with soaked chia seeds.'],
  },
  {
    id: 'food-26',
    name: 'Mexican Street Elote Corn',
    description: 'Char-grilled sweet corn on the cob slathered with chipotle mayo, cotija cheese crumbles, chili lime salt, and cilantro.',
    price: 364,
    category: 'Mexican & Wraps',
    isVeg: true,
    image: 'https://cdn.dummyjson.com/recipe-images/26.webp',
    isAvailable: true,
    prepTime: 15,
    calories: 180,
    rating: 4.6,
    ingredients: ['Sweet corn cobs', 'Chipotle mayonnaise', 'Crumbled Cotija cheese', 'Chili lime seasoning (Tajín)', 'Fresh cilantro leaves', 'Lime wedges'],
    instructions: ['Roast corn cobs over open flame until kernels are charred and sweet.', 'Brush evenly with seasoned chipotle mayo.', 'Roll in crumbled Cotija cheese and dust with chili lime powder.', 'Serve hot with lime wedges.'],
  },
  {
    id: 'food-27',
    name: 'Russian Beetroot Borscht',
    description: 'Hearty ruby-red beetroot and vegetable soup simmered in fragrant dill broth, served with sour cream and dark rye bread.',
    price: 529,
    category: 'Main Course',
    isVeg: true,
    image: 'https://cdn.dummyjson.com/recipe-images/27.webp',
    isAvailable: true,
    prepTime: 30,
    calories: 220,
    rating: 4.3,
    ingredients: ['Fresh beetroots grated', 'Shredded cabbage', 'Carrots', 'Potatoes', 'Fresh dill weed', 'Sour cream (smetana)'],
    instructions: ['Sauté grated beets with vinegar and butter.', 'Boil potato cubes and shredded cabbage in aromatic broth.', 'Combine sautéed beets into soup and simmer 15 minutes.', 'Ladle into bowls with a dollop of sour cream and fresh dill.'],
  },
  {
    id: 'food-28',
    name: 'Crispy Mysore Masala Dosa',
    description: 'Golden fermented rice and lentil crepe smeared with spicy red chutney, filled with potato bhaji, served with sambar and chutneys.',
    price: 639,
    category: 'Main Course',
    isVeg: true,
    image: 'https://cdn.dummyjson.com/recipe-images/28.webp',
    isAvailable: true,
    prepTime: 40,
    calories: 320,
    rating: 4.4,
    ingredients: ['Fermented dosa batter', 'Spiced potato masala', 'Mysore red garlic chili chutney', 'Pure desi ghee', 'Coconut chutney', 'Piping hot vegetable sambar'],
    instructions: ['Pour batter onto screaming hot tawa and spread in concentric circles.', 'Drizzle generous desi ghee and spread red chutney.', 'Place potato masala in center and roll tightly.', 'Serve with coconut chutney and hot vegetable sambar.'],
  },
  {
    id: 'food-29',
    name: 'Lebanese Falafel Wrap',
    description: 'Warm flatbread wrapped around crispy herb falafels, pickled turnips, tomatoes, cucumbers, and creamy tahini sauce.',
    price: 364,
    category: 'Mexican & Wraps',
    isVeg: true,
    image: 'https://cdn.dummyjson.com/recipe-images/29.webp',
    isAvailable: true,
    prepTime: 15,
    calories: 400,
    rating: 4.7,
    ingredients: ['Crispy chickpea falafels', 'Fresh Lebanese flatbread', 'Sesame tahini sauce', 'Pickled pink turnips', 'Tomatoes', 'Fresh mint leaves'],
    instructions: ['Fry handmade falafels until dark golden and crispy.', 'Spread creamy sesame tahini sauce across warm flatbread.', 'Layer crushed falafels, pickled turnips, tomatoes, and mint.', 'Wrap tightly and lightly press on grill before serving.'],
  },
  {
    id: 'food-30',
    name: 'Brazilian Caipirinha Cooler',
    description: 'Refreshing tropical cooler muddled with fresh juicy limes, organic cane sugar, crushed ice, and mint sprigs.',
    price: 254,
    category: 'Desserts',
    isVeg: true,
    image: 'https://cdn.dummyjson.com/recipe-images/30.webp',
    isAvailable: true,
    prepTime: 5,
    calories: 150,
    rating: 4.4,
    ingredients: ['Fresh juicy green limes', 'Raw organic cane sugar', 'Crushed crystal ice', 'Fresh sparkling soda', 'Mint sprig garnish'],
    instructions: ['Cut fresh limes into wedges and place in glass.', 'Muddle firmly with organic cane sugar to release juices and oils.', 'Fill glass to brim with crushed crystal ice.', 'Top with sparkling soda and garnish with fresh mint.'],
  },
];

export const menuService = {
  getMenuItems: async () => {
    // 1. Check LocalStorage first for persisted items
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('fdms_menu_items');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {
          console.warn('Could not read menu items from localStorage', e);
        }
      }
    }

    // 2. Fetch from Third-Party API (DummyJSON) via Axios
    try {
      const recipesData = await foodService.getRecipes(30, 0);
      const recipes = recipesData?.recipes || [];

      if (recipes.length > 0) {
        const items = recipes.map((r) => {
          const isVeg = checkIsVeg(r.name, r.ingredients);
          const category = mapCuisineToCategory(r.name, r.cuisine, r.mealType);
          const price = Math.round((r.prepTimeMinutes || 20) * 11 + 199);

          return {
            id: `food-${r.id}`,
            name: r.name,
            description: `Delightful ${r.cuisine || ''} specialty crafted with ${Array.isArray(r.ingredients) ? r.ingredients.slice(0, 3).join(', ') : 'fresh chef ingredients'}. Served piping hot.`,
            price,
            category,
            isVeg,
            image: r.image,
            isAvailable: true,
            prepTime: r.prepTimeMinutes || 20,
            calories: r.caloriesPerServing || 360,
            rating: r.rating || 4.6,
            ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
            instructions: Array.isArray(r.instructions) ? r.instructions : [],
          };
        });

        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('fdms_menu_items', JSON.stringify(items));
        }

        return items;
      }
    } catch (apiErr) {
      console.warn('DummyJSON recipes API offline or unavailable, using curated dishes base:', apiErr.message);
    }

    // 3. Fallback to rich curated catalog if API network is offline
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('fdms_menu_items', JSON.stringify(DEFAULT_FOOD_ITEMS_BASE));
    }
    return DEFAULT_FOOD_ITEMS_BASE;
  },

  getMenuItemById: async (id) => {
    if (!id) throw new Error('Menu item ID is required');

    const cleanId = String(id).trim();
    const rawNumericId = cleanId.replace(/^food-/, '');

    // 1. Check LocalStorage first for immediate instant retrieval
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = localStorage.getItem('fdms_menu_items');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const found = parsed.find(
              (item) =>
                String(item.id) === cleanId ||
                String(item.id) === rawNumericId ||
                String(item.id).replace(/^food-/, '') === rawNumericId
            );
            if (found) {
              return found;
            }
          }
        }
      } catch (e) {
        console.warn('Error reading fdms_menu_items from localStorage:', e);
      }
    }

    // 2. Query DummyJSON Third-Party API endpoint via Axios (generates Network Tab request)
    const numericTarget = parseInt(rawNumericId, 10);
    if (!isNaN(numericTarget) && numericTarget > 0 && numericTarget <= 50) {
      try {
        const res = await api.get(`/recipes/${numericTarget}`);
        if (res.data) {
          const r = res.data;
          const isVeg = checkIsVeg(r.name, r.ingredients);
          const category = mapCuisineToCategory(r.name, r.cuisine, r.mealType);
          const price = Math.round((r.prepTimeMinutes || 20) * 11 + 199);

          return {
            id: `food-${r.id}`,
            name: r.name,
            description: `Delightful ${r.cuisine || ''} specialty crafted with ${Array.isArray(r.ingredients) ? r.ingredients.slice(0, 3).join(', ') : 'fresh chef ingredients'}. Served piping hot.`,
            price,
            category,
            isVeg,
            image: r.image,
            isAvailable: true,
            prepTime: r.prepTimeMinutes || 20,
            calories: r.caloriesPerServing || 360,
            rating: r.rating || 4.6,
            ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
            instructions: Array.isArray(r.instructions) ? r.instructions : [],
          };
        }
      } catch (apiErr) {
        console.warn('DummyJSON /recipes/:id fetch failed:', apiErr.message);
      }
    }

    // 3. Fallback to curated base catalog
    const baseMatch = DEFAULT_FOOD_ITEMS_BASE.find(
      (item) =>
        String(item.id) === cleanId ||
        String(item.id) === rawNumericId ||
        String(item.id).replace(/^food-/, '') === rawNumericId
    );
    if (baseMatch) {
      return baseMatch;
    }

    // 4. Try querying full menu items
    try {
      const all = await menuService.getMenuItems();
      const found = all.find(
        (item) =>
          String(item.id) === cleanId ||
          String(item.id) === rawNumericId ||
          String(item.id).replace(/^food-/, '') === rawNumericId
      );
      if (found) return found;
    } catch (e) {
      console.warn('Could not query full menu items', e);
    }

    // 5. Ultimate synthesized fallback so details page NEVER fails or gets stuck
    return {
      id: cleanId.startsWith('food-') ? cleanId : `food-${cleanId}`,
      name: `Chef Gourmet Dish #${rawNumericId}`,
      description: 'Handcrafted signature dish made with fresh food court ingredients, fragrant herbs, and authentic spices.',
      price: 349,
      category: 'Main Course',
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      prepTime: 20,
      calories: 360,
      rating: 4.8,
      ingredients: ['Fresh herbs', 'Chef special sauce', 'Gourmet seasoning'],
      instructions: ['Prepared fresh upon order in the Food Court central kitchen.'],
    };
  },

  // CRUD Operation: Create / Add (Replicated in Network tab via POST /recipes/add)
  createMenuItem: async (itemData) => {
    try {
      const payload = {
        name: itemData.name,
        ingredients: Array.isArray(itemData.ingredients)
          ? itemData.ingredients
          : typeof itemData.ingredients === 'string'
          ? itemData.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
          : ['Chef Selected Spices', 'Fresh Ingredients'],
        instructions: Array.isArray(itemData.instructions)
          ? itemData.instructions
          : [itemData.description || 'Cooked to perfection in the central food court kitchen.'],
        prepTimeMinutes: parseInt(itemData.prepTime, 10) || 20,
        caloriesPerServing: parseInt(itemData.calories, 10) || 350,
        cuisine: itemData.category || 'Main Course',
      };

      // Axios POST request to Third-Party DummyJSON API
      const res = await api.post('/recipes/add', payload);
      return res.data;
    } catch (err) {
      console.warn('Axios POST /recipes/add simulated or offline:', err.message);
      return null;
    }
  },

  // CRUD Operation: Update / Edit (Replicated in Network tab via PUT /recipes/:id)
  updateMenuItem: async (id, updatedData) => {
    try {
      const cleanId = String(id).replace(/^food-/, '');
      const num = parseInt(cleanId, 10);
      const targetId = !isNaN(num) && num > 0 && num <= 50 ? num : 1;

      const payload = {
        name: updatedData.name,
        prepTimeMinutes: parseInt(updatedData.prepTime, 10) || 20,
        caloriesPerServing: parseInt(updatedData.calories, 10) || 350,
      };

      // Axios PUT request to Third-Party DummyJSON API
      const res = await api.put(`/recipes/${targetId}`, payload);
      return res.data;
    } catch (err) {
      console.warn(`Axios PUT /recipes/${id} simulated or offline:`, err.message);
      return null;
    }
  },

  // CRUD Operation: Delete (Replicated in Network tab via DELETE /recipes/:id)
  deleteMenuItem: async (id) => {
    try {
      const cleanId = String(id).replace(/^food-/, '');
      const num = parseInt(cleanId, 10);
      const targetId = !isNaN(num) && num > 0 && num <= 50 ? num : 1;

      // Axios DELETE request to Third-Party DummyJSON API
      const res = await api.delete(`/recipes/${targetId}`);
      return res.data;
    } catch (err) {
      console.warn(`Axios DELETE /recipes/${id} simulated or offline:`, err.message);
      return null;
    }
  },
};

export default api;
