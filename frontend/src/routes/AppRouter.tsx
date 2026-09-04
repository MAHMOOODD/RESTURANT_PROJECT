import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import Home from "../pages/Main/Home";
import Products from "../pages/Main/Products";
import { Auth } from "@/pages/Main/Auth";
import ResetPassword from "@/components/my/Auth/ResetPassword";
import ConfirmEmail from "@/components/my/Auth/ConfirmEmail";
import Account from "@/pages/Main/Account";
import Cart from "@/pages/Main/Cart";
import Checkout from "@/pages/Main/Checkout";
import OrderDetails from "@/pages/Main/OrderDetails";
import MyOrders from "@/pages/Main/MyOrders";
import AboutUs from "@/pages/Main/AboutUs";
import ContactUs from "@/pages/Main/ContactUs";
import NotFound from "@/pages/Main/NotFound";

import AdminRoute from "@/components/my/Auth/AdminRoute"; 
import CashierRoute from "@/components/my/Auth/CashierRoute";
import CashierLayout from "../layouts/CashierLayout";
import CashierPosPage from "@/pages/cashier/CashierPosPage"; 
import CashierOrdersPage from "@/pages/cashier/CashierOrdersPage"; 

import AdminProducts from "@/pages/admin/ProductsPage";
import ProductDetailsPage from "@/pages/Main/ProductDetailsPage";
import { CategoriesPage } from "@/pages/admin/CategoriesPage";
import  AdminOrdersPage  from "@/pages/admin/AdminOrdersPage";
import AdminCouponsPage from "@/pages/admin/AdminCouponsPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import PaymentResultPage from "@/pages/Main/PaymentResultPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "payment-result", element: <PaymentResultPage /> },

      {
        path: "orders",
        children: [
          { index: true, element: <MyOrders /> },
          { path: ":id", element: <OrderDetails /> },
        ],
      },

      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "products/:id", element: <ProductDetailsPage /> },

      { path: "about", element: <AboutUs /> },
      { path: "contact", element: <ContactUs /> },

      { path: "products", element: <Products /> },

      { path: "profile", element: <Account /> },

      {
        path: "auth",
        children: [
          { index: true, element: <Auth /> },
          { path: "confirm-email", element: <ConfirmEmail /> },
          { path: "reset-password", element: <ResetPassword /> },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },

  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "products", element: <AdminProducts /> },
      { path: "*", element: <NotFound /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "orders", element: <AdminOrdersPage/> },
      { path: "coupons", element: <AdminCouponsPage /> },
      { path: "users", element: <AdminUsersPage /> },
    ],
  },
  {
    path: "/cashier",
    element: (
      <CashierRoute>
        <CashierLayout />
      </CashierRoute>
    ),
    children: [
      { index: true, element: <CashierPosPage /> },
      { path: "orders", element: <CashierOrdersPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}