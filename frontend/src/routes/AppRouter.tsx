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

// صفحة الـ Products الخاصة بالأدمن اللي عملناها
import AdminProducts from "@/pages/admin/ProductsPage";
// لو عندك صفحة للـ Dashboard الرئيسية للأدمن استوردها هنا، أو استبدلها مؤقتاً لو مش جاهزة
import AdminDashboard from "@/pages/admin/DashboardPage"; // عدل المسار حسب مكانها عندك أو اربطها بصفحة بديلة
import ProductDetailsPage from "@/pages/Main/ProductDetailsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },

      // 1. مسار تفاصيل الطلب
      {
        path: "orders",
        children: [
          { index: true, element: <MyOrders /> },
          { path: ":id", element: <OrderDetails /> },
        ],
      },

      // 2. السلة والدفع
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "products/:id", element: <ProductDetailsPage /> },

      { path: "about", element: <AboutUs /> },
      { path: "contact", element: <ContactUs /> },

      // 3. المنتجات
      { path: "products", element: <Products /> },

      // 4. البروفايل
      { path: "profile", element: <Account /> },

      // 5. مصادقة المستخدم
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

  // 🛡️ 6. لوحة تحكم الأدمن (مسارات مستقلة بـ AdminLayout الخاص بيها)
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "products", element: <AdminProducts /> },
      {path: "*" , element: <NotFound />},
      // { path: "categories", element: <AdminCategories /> },
      // { path: "orders", element: <AdminOrders /> },
      // { path: "coupons", element: <AdminCoupons /> },
      // { path: "users", element: <AdminUsers /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}