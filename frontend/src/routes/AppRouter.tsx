import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Products from '../pages/Products';
import { Auth}  from '@/pages/Auth';
import ResetPassword from '@/components/my/Auth/ResetPassword';
import ConfirmEmail from '@/components/my/Auth/ConfirmEmail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'Products', children: [
        { index: true, element: <Products /> },
      ] },
      { path: 'auth', children: [
        { index: true, element: <Auth /> },
        { path: 'confirm-email', element: <ConfirmEmail /> },
        { path: 'reset-password', element: <ResetPassword /> },
      ]},
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}