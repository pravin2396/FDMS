# Food Delivery Management System (FDMS)

A modern, responsive Food Delivery Management System built with React, Vite, Tailwind CSS, Context API, and Third-Party API integrations.

## 🛠️ Technology Stack & Project Guidelines
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS (Consistent dark culinary theme with red and amber accents, edge-to-edge stretched layout)
- **Global State**: Context API (Separate context files for modularity: `AuthContext`, `DashboardContext`, `RestaurantContext`)
- **Routing**: React Router (Public auth routes, protected dashboard, restaurant listing, and restaurant details)
- **API Requests**: Axios with interceptors and loading/error handling
- **Third-Party API**: Integrated with DummyJSON API
- **Form Handling**: React Hook Form
- **Notifications**: React Toastify (Dark theme)
- **Session & Storage**: Local Storage (`fdms_*` keys for session, metrics, orders, and favorite restaurants)

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
- **Restaurant Search**: Real-time search by name, cuisine, address, or dishes with interactive clear "X" button.
- **Filter by Cuisine**: All, Italian, Indian, Asian, American, Mexican, Mediterranean, Desserts.
- **Filter by Rating**: All Ratings, 4.5+ ⭐ (Top Rated), 4.0+ ⭐, 3.5+ ⭐.
- **Sort Options**: Popularity (most reviewed), Highest Rated, Fastest Delivery Time, Lowest Delivery Charges.
- **Pagination**: Interactive previous, numbered page buttons, and next controls.
- **Loading & Error Handling**: Animated skeleton loaders during API fetch, and error alert with retry button.

---

## 🚀 How to Run

```bash
cd react
npm run dev
```

Visit `http://localhost:5173` in your browser.
