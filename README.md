# 🍔 Aklny (أكلني) — Full Stack Online Food Ordering Platform

> A production-style fast food ordering platform with a customer-facing storefront, an admin dashboard, and a cashier POS interface — built end-to-end with a React/TypeScript frontend and a .NET Web API backend.


---

## 📖 About the Project

Aklny is a full stack food ordering system built solo, from database design to deployment, to practice production-level full stack engineering rather than following a tutorial end-to-end. It covers three distinct user experiences on top of one shared backend:

- **Customer storefront** — browse menu/categories, manage cart, place orders, apply discount coupons, track order status.
- **Admin dashboard** — manage products & categories, discount coupons, users, and view revenue/order analytics.
- **Cashier (POS) interface** — a point-of-sale screen for in-person orders (category tiles, live invoice, registered/new customer selection, discounts) plus an order-tracking view filtered by payment/order status.

The project is designed to be reusable as a template that can be adapted and sold to multiple restaurant clients, not a one-off demo.

---

## 🛠 Tech Stack

### Frontend
- **React + TypeScript + Vite**
- **Tailwind CSS** + **shadcn/ui** components
- **Redux Toolkit Query (RTK Query)** — typed API layer with a consistent `ApiResponse<T>` wrapper and cache tag invalidation
- **React Hook Form + Zod** — schema-validated forms across the admin panel
- **react-i18next** — full Arabic / English localization

### Backend
- **ASP.NET Core Web API**
- **Entity Framework Core**
- **Role-based Authorization** — Admin / Manager / User / Cashier
- **Paymob** — payment gateway integration
- Repository Pattern & layered architecture

---

## ✨ Key Features

- 🔐 **Role-based access control** — distinct permissions for Admin, Manager, Cashier, and regular users
- 🛒 **Full customer flow** — menu, categories, cart, checkout, order history
- 💳 **Paymob payment integration** for online checkout
- 🧾 **Coupon / discount engine** applied at checkout
- 📊 **Admin dashboard** — revenue and order overview, product/category CRUD, user management
- 🧑‍💼 **Cashier POS screen** — fast in-store order creation with a live invoice sidebar
- 📦 **Order lifecycle management** — status transitions auto-adjust product sell counts (e.g. reverting stock on cancellation/failed payment)
- 📄 **Paginated, filterable order tables** on both the admin and cashier sides
- 🌍 **Arabic / English localization** across the admin UI
- 🎨 **Consistent design system** — glassmorphism cards, responsive mobile-card / desktop-table layouts, portal-based confirmation dialogs

---

## 📂 Project Structure

```
RESTURANT_PROJECT/
├── Resturant_Backend/     # ASP.NET Core Web API
└── frontend/              # React + TypeScript + Vite client
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS)
- .NET SDK
- SQL Server (or your configured provider)

### Backend
```bash
cd Resturant_Backend
cp appsettings.Template.json appsettings.json   # fill in your connection string & secrets
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # fill in your API base URL
npm run dev
```

---

## 🗺 Roadmap

- [ ] Add automated tests (unit + integration)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Dockerize backend for easier deployment
- [ ] Multi-tenant support for reselling to multiple restaurants

---

## 👤 Author

**Mahmoud Salah** — Computer Science student, Cairo University, focused on full stack development.



