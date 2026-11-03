# Food Delivery Management System (FDMS)

A modern, responsive Food Delivery Management System built with React, Vite, Tailwind CSS, Context API, and Third-Party API integrations.

## 🍔 Features Implemented (Module 1: Authentication)

1. **Design & Theming**:
   - Matches the uploaded **Food Court Login Form** design.
   - Distinctive typography (`Courgette` cursive brand title, red highlight on `Login`, `Register`, and `Reset`).
   - Frosted dark glass container with subtle borders and shadows over a rich food dining table backdrop.
   - Decorative red accent lines framing `"fill out the form below to login"`.
   - Matching styled footer with copyright notice.

2. **Authentication Features**:
   - **Login**: Username/Email and password input with Remember Me checkbox and validation.
   - **Register**: Full account creation (Name, Username, Email, Password, Confirm Password, Terms Agreement).
   - **Forgot Password UI**: Password recovery with validation and instant feedback.
   - **Form Validation**: Handled by **React Hook Form** with real-time feedback and clear error states.
   - **Password Show/Hide**: Interactive toggle button with Eye/EyeOff icons on all password fields.
   - **Remember Me**: Persists username to `localStorage` for returning visits.
   - **Protected Routes**: Custom `<ProtectedRoute>` wrapper redirecting unauthenticated users to `/login`.
   - **Session Storage**: Active user session saved in `localStorage` (`fdms_user_session`) with mock JWT token.
   - **Logout**: Clears active session and triggers feedback.
   - **Notifications**: Full integration with **React Toastify** (dark themed).

3. **Live Food API Integration**:
   - Integrated with **DummyJSON Recipes API** using **Axios**.
   - Includes real-time search, cuisine category filters, price estimation, ratings, and preparation time.
   - Proper loading spinners and graceful error handling.

## 🚀 Quick Start

From the `react` directory:

```bash
# Run development server
npm run dev
```

Visit the local server in your browser (usually `http://localhost:5173`).

## 🔑 Pre-Configured Test Credentials

You can use the one-click autofill buttons on the login card, or enter manually:

| Role | Username | Password | Email |
| :--- | :--- | :--- | :--- |
| **Admin** | `pravin` | `Password123!` | `pravin@foodcourt.com` |
| **Customer** | `alex` | `Password123!` | `alex@foodcourt.com` |

You can also use the **Register** form to create any new custom user account with instant login!
