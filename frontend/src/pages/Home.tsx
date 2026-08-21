import HeroSection from "@/components/my/Home/HeroSection";
import CategoriesSection from "@/components/my/Home/CategoriesSection";
import BentoProducts from "@/components/my/Home/BentoProducts";
import CouponsSection from "@/components/my/Home/CouponsSection";
import ReviewsSection from "@/components/my/Home/ReviewsSection";

export default function Home() {
  return (
    <div className="min-h-screen space-y-10 px-4 sm:px-8 max-w-7xl mx-auto pb-20">
      <HeroSection />
      <CouponsSection />
      <CategoriesSection />
      <BentoProducts />
      <ReviewsSection />
    </div>
  );
}