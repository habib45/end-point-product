# AdminPanel Pro 🚀

A **full-featured, production-ready Admin Dashboard** built with:

- ⚛️ **React 18** + **TypeScript**
- ⚡ **Vite 5** (fast build & dev server)
- 🎨 **AdminLTE 4** + **Bootstrap 5**
- 📊 **Chart.js** + **react-chartjs-2** (real charts)
- 🔐 **Auth system** (login/register/forgot password)
- 📋 **react-hook-form** (form validation)
- 🔔 **react-hot-toast** (notifications)
- 🌙 **Dark mode** support

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
# Opens at http://localhost:3000

# 3. Build for production
npm run build
```

**Demo Login:** `admin@example.com` / any password

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx        # Root layout wrapper
│   │   ├── AuthLayout.tsx        # Auth pages layout
│   │   ├── Navbar.tsx            # Top nav with notifications, user menu
│   │   ├── Sidebar.tsx           # Collapsible sidebar with nested nav
│   │   └── Footer.tsx            # Footer
│   ├── ui/
│   │   ├── StatCard.tsx          # Metric stat card
│   │   └── ContentHeader.tsx     # Page title + breadcrumbs
│   └── tables/
│       └── DataTable.tsx         # Full-featured sortable, paginated table
├── context/
│   ├── AuthContext.tsx           # Auth state + login/logout/register
│   └── ThemeContext.tsx          # Dark/light mode
├── hooks/
│   └── useTable.ts               # Table logic: search, sort, paginate
├── pages/
│   ├── auth/
│   │   ├── Login.tsx             # Login with validation
│   │   ├── Register.tsx          # Registration form
│   │   └── ForgotPassword.tsx    # Password reset flow
│   ├── ecommerce/
│   │   ├── Products.tsx          # Products list with DataTable
│   │   ├── ProductDetail.tsx     # Product detail view
│   │   └── Orders.tsx            # Orders management
│   ├── blog/
│   │   ├── BlogPosts.tsx         # Blog posts list
│   │   └── BlogCreate.tsx        # Rich post editor
│   ├── calendar/
│   │   └── Calendar.tsx          # Full month calendar
│   ├── Dashboard.tsx             # Main dashboard
│   ├── Analytics.tsx             # Analytics with metrics
│   ├── Users.tsx                 # User management table
│   ├── UserDetail.tsx            # User profile view
│   ├── Profile.tsx               # My profile
│   ├── Settings.tsx              # Full settings page
│   ├── Charts.tsx                # Real Chart.js charts
│   ├── Tables.tsx                # Table variations
│   ├── UIComponents.tsx          # UI component showcase
│   └── NotFound.tsx              # 404 page
├── services/
│   └── mockData.ts               # All mock data + chart datasets
├── types/
│   └── index.ts                  # TypeScript types
├── utils/
│   └── helpers.ts                # Utility functions
├── styles/
│   └── main.scss                 # Full custom SCSS overrides
├── App.tsx                       # All routes defined
└── main.tsx                      # App entry point
```

---

## 🧭 Pages & Routes

| Route | Page |
|-------|------|
| `/login` | Login |
| `/register` | Register |
| `/forgot-password` | Forgot Password |
| `/dashboard` | Main Dashboard |
| `/analytics` | Analytics Overview |
| `/calendar` | Monthly Calendar |
| `/ecommerce/products` | Products Table |
| `/ecommerce/products/:id` | Product Detail |
| `/ecommerce/orders` | Orders Table |
| `/blog/posts` | Blog Posts |
| `/blog/create` | Create Blog Post |
| `/users` | Users Management |
| `/users/:id` | User Detail |
| `/profile` | My Profile |
| `/settings` | Settings |
| `/ui/components` | UI Components |
| `/ui/tables` | Tables |
| `/ui/charts` | Charts (Chart.js) |

---

## ✨ Key Features

- ✅ Protected routes (redirect to login if not authenticated)
- ✅ Dark mode toggle (persisted to localStorage)
- ✅ Collapsible sidebar with nested navigation
- ✅ Sortable, searchable, paginated DataTable
- ✅ Real Chart.js charts (Line, Bar, Doughnut)
- ✅ Toast notifications via react-hot-toast
- ✅ Form validation via react-hook-form
- ✅ Fully typed with TypeScript
- ✅ Path aliases (`@/` → `src/`)
- ✅ Custom SCSS overrides

---

## 🎨 Adding New Pages

1. Create `src/pages/MyPage.tsx`
2. Add route in `src/App.tsx`
3. Add nav link in `src/components/layout/Sidebar.tsx`

## 📦 Bootstrap Icons

Used via CDN in `index.html`. Usage:
```tsx
<i className="bi bi-house-fill"></i>
```
