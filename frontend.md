# agents.md – Gadget Store Frontend

> This file contains permanent instructions for any AI coding agent working on this ReactJS frontend.
> Always read and follow these guidelines before writing or modifying any code.

---

## 1. Project Overview

This is the **frontend** of a full-stack e-commerce application for a **Gadget Store**.

**Backend**: Spring Boot + JWT Authentication + Role-Based Access Control (RBAC)  
**Frontend**: ReactJS (Vite)

There are two distinct user roles:

### Admin Module
- Secure login with JWT
- Category management (CRUD)
- Product management (CRUD)
- Order management (view + update status: PENDING → SHIPPED → DELIVERED, etc.)
- Analytics dashboard (orders by status + sales of current vs previous month)
- Coupon management
- FAQ management

### Customer Module
- Secure login / registration with JWT
- Product browsing & filtering
- Product details page (includes reviews + FAQs)
- Cart (add single/multiple products)
- Checkout + apply coupon
- Wishlist
- Place orders
- Write reviews (only for delivered products)
- Order tracking (by tracking ID — works even when not logged in)
- Profile management + change password

---

## 2. Tech Stack (Strictly Follow)

- **React 18+** with functional components only
- **Vite** as build tool
- **React Router DOM v6**
- **Axios** for HTTP requests
- **Context API + useReducer** for global state (Auth + Cart)
- **Tailwind CSS** for styling (preferred)
- **React Hook Form + Zod** (or Yup) for forms
- **React Toastify** or **Sonner** for notifications
- **Lucide React** or **Heroicons** for icons
- **date-fns** for date formatting
- No Redux / Zustand unless explicitly requested later

---

## 3. Official Folder Structure
gadget-store-frontend/
├── public/
│   ├── favicon.ico
│   └── index.html
│
├── src/
│   ├── api/                          # All API calls (Axios instances + endpoints)
│   │   ├── axios.js                  # Base Axios instance + interceptors (JWT)
│   │   ├── authApi.js
│   │   ├── categoryApi.js
│   │   ├── productApi.js
│   │   ├── orderApi.js
│   │   ├── couponApi.js
│   │   ├── faqApi.js
│   │   ├── reviewApi.js
│   │   ├── wishlistApi.js
│   │   ├── analyticsApi.js
│   │   └── userApi.js
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── AdminLayout.jsx       # Sidebar + Header for Admin
│   │   │   ├── CustomerLayout.jsx    # Navbar + Footer for Customer
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── product/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductFilters.jsx
│   │   │   └── ProductImageGallery.jsx
│   │   │
│   │   ├── cart/
│   │   │   ├── CartItem.jsx
│   │   │   ├── CartSummary.jsx
│   │   │   └── CouponInput.jsx
│   │   │
│   │   └── forms/
│   │       ├── LoginForm.jsx
│   │       ├── RegisterForm.jsx
│   │       ├── ProductForm.jsx       # Admin create/edit product
│   │       ├── CategoryForm.jsx
│   │       ├── CouponForm.jsx
│   │       └── ProfileForm.jsx
│   │
│   ├── context/                      # Global state
│   │   ├── AuthContext.jsx           # JWT, user, role, login/logout
│   │   ├── CartContext.jsx           # Customer cart state
│   │   └── ThemeContext.jsx          # (optional)
│   │
│   ├── hooks/                        # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useProducts.js
│   │   ├── useOrders.js
│   │   └── useDebounce.js
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx             # Shared login (redirects by role)
│   │   │   ├── Register.jsx
│   │   │   └── ForgotPassword.jsx
│   │   │
│   │   ├── admin/                    # ========== ADMIN MODULE ==========
│   │   │   ├── Dashboard.jsx         # Analytics overview
│   │   │   ├── Categories/
│   │   │   │   ├── CategoryList.jsx
│   │   │   │   └── CategoryFormPage.jsx
│   │   │   ├── Products/
│   │   │   │   ├── ProductList.jsx
│   │   │   │   ├── ProductFormPage.jsx
│   │   │   │   └── ProductDetailsAdmin.jsx
│   │   │   ├── Orders/
│   │   │   │   ├── OrderList.jsx
│   │   │   │   └── OrderDetails.jsx  # Update status (shipped, delivered...)
│   │   │   ├── Analytics/
│   │   │   │   └── AnalyticsPage.jsx # Orders by status + monthly sales
│   │   │   ├── Coupons/
│   │   │   │   ├── CouponList.jsx
│   │   │   │   └── CouponFormPage.jsx
│   │   │   ├── FAQs/
│   │   │   │   ├── FaqList.jsx
│   │   │   │   └── FaqFormPage.jsx
│   │   │   └── Profile/
│   │   │       └── AdminProfile.jsx
│   │   │
│   │   ├── customer/                 # ========== CUSTOMER MODULE ==========
│   │   │   ├── Home.jsx              # Product discovery dashboard
│   │   │   ├── Products/
│   │   │   │   ├── ProductList.jsx
│   │   │   │   └── ProductDetails.jsx # Details + Reviews + FAQs
│   │   │   ├── Cart/
│   │   │   │   └── CartPage.jsx
│   │   │   ├── Checkout/
│   │   │   │   └── CheckoutPage.jsx  # Place order + apply coupon
│   │   │   ├── Wishlist/
│   │   │   │   └── WishlistPage.jsx
│   │   │   ├── Orders/
│   │   │   │   ├── MyOrders.jsx
│   │   │   │   └── OrderTracking.jsx # Track by tracking ID (public)
│   │   │   ├── Reviews/
│   │   │   │   └── WriteReview.jsx   # Only for delivered products
│   │   │   └── Profile/
│   │   │       ├── ProfilePage.jsx
│   │   │       └── ChangePassword.jsx
│   │   │
│   │   └── NotFound.jsx
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx             # Main router
│   │   ├── AdminRoutes.jsx
│   │   └── CustomerRoutes.jsx
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── formatters.js             # currency, date, etc.
│   │   └── storage.js                # localStorage helpers for JWT/cart
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env                              # VITE_API_BASE_URL=...
├── .gitignore
├── package.json
├── vite.config.js
└── README.md


## 4. Core Architectural Rules

### Authentication & Authorization
- JWT is stored in `localStorage` under the key `token`
- User object (including role) is stored under `user`
- Always use the `AuthContext` → never read localStorage directly in components
- Use `<ProtectedRoute allowedRoles={['ADMIN']}>` or `allowedRoles={['USER']}`
- On 401 response from Axios → automatically logout and redirect to `/login`

### Role-Based Routing
- `/admin/*` → only accessible by `ROLE_ADMIN`
- Customer routes → accessible by `ROLE_USER` (and sometimes ADMIN)
- Shared login page (`/login`) → redirects based on role after successful login

### API Layer Rules
- All API calls must go through files inside `src/api/`
- Use the shared Axios instance (`api/axios.js`) that automatically attaches the JWT
- Never call `axios` directly from components or pages
- Always handle loading and error states

### State Management
- **Auth state** → `AuthContext`
- **Cart state** → `CartContext` (persist cart in localStorage)
- Server state (products, orders, etc.) → prefer React Query (TanStack Query) if already installed, otherwise local state + custom hooks

---

## 5. Coding Conventions

### Naming
- Components: `PascalCase` (`ProductCard.jsx`)
- Hooks: `useSomething.js`
- API files: `somethingApi.js`
- Utility functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

### Component Rules
- Prefer functional components + hooks
- Keep components small and focused
- Extract reusable UI into `components/common/`
- Admin pages go under `pages/admin/`
- Customer pages go under `pages/customer/`
- Never put business logic directly inside JSX

### Forms
- Always use React Hook Form
- Validate with Zod (preferred) or Yup
- Show clear error messages under each field

### Styling
- Use Tailwind CSS utility classes
- Avoid inline styles
- Create reusable component variants when needed

### Error & Loading States
- Every data-fetching component must handle:
  - Loading state
  - Error state
  - Empty state

---

## 6. Important Business Rules (Do Not Violate)

1. Customers can only write a review for **delivered** orders.
2. Order tracking page (`/track-order`), home page, product page, product details, add to cart, should work **without authentication**, meaning that customers can access the application using guest mode, when the order is about to be placed at checkout, the customer should be routed to the login and signup page, and after logging in successfully, the customer's chosen items should still be available.
3. Admins can update order status (PENDING, SHIPPED, DELIVERED, CANCELLED, etc.).
4. Applying a coupon happens at checkout using the coupon code/ID.
5. Stock is managed on the backend — frontend should only display availability and prevent adding out-of-stock items when possible.
6. Analytics page must show:
   - Count of orders by status
   - Sales of current month vs previous month

---

## 7. Preferred Patterns

### Protected Route Example
```jsx
<ProtectedRoute allowedRoles={['ADMIN']}>
  <AdminLayout />
</ProtectedRoute>

API Call Pattern
JavaScript// api/productApi.js
import api from './axios';

export const getAllProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/admin/products', data);
Using Auth
JavaScriptconst { user, token, login, logout, isAdmin, isAuthenticated } = useAuth();

8. What the AI Agent Should Always Do

Follow the folder structure strictly
Reuse existing components instead of creating duplicates
Keep Admin and Customer code clearly separated
Write clean, readable, and well-commented code when logic is complex
Handle loading, error, and empty states
Use TypeScript if the project is already using it (otherwise plain JS is fine)
Prefer composition over large monolithic components


9. What the AI Agent Should Never Do

Never hardcode API URLs (use environment variables)
Never store sensitive data outside AuthContext / CartContext
Never mix Admin and Customer logic in the same component
Never use class components
Never use Redux unless explicitly asked
Never create new top-level folders without discussion


10. Current Priority Areas
When working on this project, prioritize in this order:

Authentication flow (Login + Protected Routes + Axios interceptors)
Admin product & category management
Customer product listing + product details
Cart + Checkout + Coupon
Order management (both sides)
Wishlist + Reviews
Analytics dashboard