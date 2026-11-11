# Food Delivery Management System (FDMS)

A modern, responsive Food Delivery Management System built with React, Vite, Tailwind CSS, Context API, and Third-Party API integrations.

## 🛠️ Technology Stack & Project Guidelines
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS (Consistent dark culinary theme with red and amber accents, edge-to-edge stretched layout)
- **Global State**: Context API (Separate context files for modularity: `AuthContext`, `DashboardContext`, `RestaurantContext`, `MenuContext`)
- **Routing**: React Router (Public auth routes, protected dashboard, restaurant listing, restaurant details, menu listing, and food details)
- **API Requests**: Axios with interceptors and loading/error handling
- **Third-Party API**: Integrated with DummyJSON API
- **Form Handling**: React Hook Form
- **Notifications**: React Toastify (Dark theme)
- **Session & Storage**: Local Storage (`fdms_*` keys for user session, test credentials, dashboard metrics, orders, favorite restaurants, and persistent menu items)

---

## 📦 Implemented Modules

### Module 1: Authentication
- Login, Register, Forgot Password UI with form validation.
- Password show/hide toggle.
- Protected Routes (`<ProtectedRoute />`).
- Session persistence in Local Storage with test credentials pre-configured (`Admin: pravin`, `Password123!`).

### Module 2: Dashboard
- Edge-to-edge stretched responsive layout with collapsible sidebar.
- 6 Key Performance Metric cards: Total Restaurants, Total Food Items, Total Orders, Active Orders, Delivered Orders, Total Customers.
- Revenue Summary with interactive Weekly & Monthly breakdown bar graphs, gross revenue, today's revenue, and AOV.
- Recent Orders Feed with search, interactive clear "X" icon, status filter tabs, and inline status updater.
- Quick action cards with modals for adding restaurants and food items.

### Module 3: Restaurant Listing & Details
- **Display Restaurant List** (`/restaurants`):
  - Responsive cards with Restaurant Image, Name, Cuisine Type, Rating & Reviews, Delivery Time, Delivery Charges (Free Delivery highlighted), Address, and Open/Closed Status badge.
  - Interactive favorite bookmarking saved to Local Storage.
- **Restaurant Details** (`/restaurants/:id`):
  - Full cover hero banner with address, opening hours, phone, and rating.
  - Live chef menu items fetched via Axios from the Third-Party API with dish images, calories, prep time, price, and "Add to Order" action.
- **Restaurant Search**: Real-time search with interactive clear "X" button.
- **Filter by Cuisine**: All, Italian, Indian, Asian, American, Mexican, Mediterranean, Desserts.
- **Filter by Rating**: All Ratings, 4.5+ ⭐ (Top Rated), 4.0+ ⭐, 3.5+ ⭐.
- **Sort Options**: Popularity, Highest Rated, Fastest Delivery Time, Lowest Delivery Charges.
- **Pagination**: Interactive page navigation controls.

### Module 4: Menu Management
- **Display Menu Items** (`/menu`):
  - Responsive cards with Food Image, Food Name, Description, Price, Category, Availability Status, and Veg/Non-Veg indicators.
  - Quick action buttons: View Details, Edit Item, Delete Item, and Add to Order.
- **Food Details Page** (`/menu/:id`):
  - Full-width hero banner, pricing, nutritional highlights (prep time, calories, rating).
  - Dietary classification (Pure Veg 🌱 vs Non-Veg 🍗) and real-time Availability status.
  - Key ingredients chip list and chef preparation notes.
  - "Add to Order" action that replicates immediately in the Dashboard orders & revenue.
  - Quick Edit and Delete actions.
- **Search Food Items**: Real-time search by name, ingredients, or category with interactive clear "X" icon.
- **Filter by Category**: All, Pizza, Burgers, Main Course, Asian, Desserts, Mexican & Wraps.
- **Filter by Veg / Non-Veg**: All Types, Veg Only (🌱), Non-Veg (🍗).
- **Sort by Price**: Recommended, Price: Low to High, Price: High to Low, Highest Rated.
- **Add New Menu Item (UI)**: Interactive modal powered by React Hook Form with validation, image presets, veg toggle, and availability state. Persists in Local Storage and increments Dashboard total items.
- **Edit Menu Item (UI)**: Prepopulated modal for updating name, description, price, category, veg status, and availability.
- **Delete Menu Item (UI)**: Confirmation dialog with safety warning, updating Local Storage and adjusting Dashboard counters.

---

## 🚀 How to Run

```bash
cd react
npm run dev
```

Visit `http://localhost:5173` in your browser.
