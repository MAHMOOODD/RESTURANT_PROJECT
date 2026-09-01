import {Footer} from '@/components/my/Footer/Footer';
import Navbar from '@/components/my/Nav/Navbar';
import { useEffect } from 'react';
import {  Outlet, useLocation } from 'react-router-dom';

export default function MainLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "instant" });
}, [pathname]);
  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col">
        <Navbar/>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer ثابت */}
     <Footer/>
    </div>
  );
}