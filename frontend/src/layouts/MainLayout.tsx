import {Footer} from '@/components/my/Footer/Footer';
import Navbar from '@/components/my/Nav/Navbar';
import {  Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar/>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer ثابت */}
     <Footer/>
    </div>
  );
}