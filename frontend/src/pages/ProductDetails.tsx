import { useState } from "react";
import {
  Star,
  Clock,
  ShoppingBag,
  Flame,
  ShieldCheck,
  Plus,
  Minus,
  Heart,
  Share2,
} from "lucide-react";

// Types derived from GetProductDto
interface GetDetailsDto {
  id: number;
  name: string;
  value: string;
}

interface GetReviewDto {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface GetProductDto {
  id: number;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  preparingTime: number;
  imageUrl: string;
  sellCount: number;
  isAvailable: boolean;
  categoryId: number;
  details: GetDetailsDto[];
  reviews: GetReviewDto[];
}

export const ProductDetails = ({ product }: { product: GetProductDto }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");

  // Calculate Average Rating
  const avgRating =
    product.reviews.length > 0
      ? (
          product.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : "New";

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground rtl:space-x-reverse">
          <a href="#" className="hover:text-primary transition-colors">
            الرئيسية
          </a>
          <span>/</span>
          <a href="#" className="hover:text-primary transition-colors">
            القائمة
          </a>
          <span>/</span>
          <span className="text-foreground font-medium">
            {product.nameAr || product.name}
          </span>
        </nav>

        {/* Hero Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Product Gallery Section */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-card border border-border shadow-md group flex items-center justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="
      w-full h-full object-cover
      z-10
      mix-blend-multiply dark:mix-blend-normal
      group-hover:scale-105
      transition-transform duration-500
    "
            />

            {/* Status Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.sellCount > 50 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-md backdrop-blur-md">
                  <Flame className="w-3.5 h-3.5" />
                  الأكثر طلباً ({product.sellCount})
                </span>
              )}

              {!product.isAvailable && (
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-destructive text-destructive-foreground">
                  غير متوفر حالياً
                </span>
              )}
            </div>

            {/* Action Floating Buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <button className="p-2.5 rounded-full bg-background/80 border border-border text-foreground hover:bg-accent hover:text-accent-foreground backdrop-blur-md transition-all shadow-sm">
                <Heart className="w-5 h-5" />
              </button>

              <button className="p-2.5 rounded-full bg-background/80 border border-border text-foreground hover:bg-accent hover:text-accent-foreground backdrop-blur-md transition-all shadow-sm">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Product Info & Purchase Section */}
          <div className="lg:col-span-6 space-y-6">
            {/* Header info */}
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-1 text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                  <Star className="w-4 h-4 fill-primary" />
                  <span>{avgRating}</span>
                  <span className="text-muted-foreground text-xs">
                    ({product.reviews.length})
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{product.preparingTime} دقيقة تجهيز</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {product.nameAr || product.name}
              </h1>
            </div>

            {/* Price Banner */}
            <div className="flex items-baseline gap-3 p-4 rounded-xl bg-card border border-border">
              <span className="text-3xl font-extrabold text-primary">
                {product.price.toLocaleString()}{" "}
                <span className="text-base font-normal text-muted-foreground">
                  ج.م
                </span>
              </span>
            </div>

            {/* Short Description */}
            <p className="text-muted-foreground leading-relaxed text-base">
              {product.descriptionAr || product.description}
            </p>

            {/* Add to Cart Actions */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-4">
                {/* Quantity Control */}
                <div className="flex items-center border border-border rounded-xl bg-card p-1">
                  <button
                    disabled={quantity <= 1 || !product.isAvailable}
                    onClick={() => setQuantity((prev) => prev - 1)}
                    className="p-2 rounded-lg hover:bg-muted text-foreground disabled:opacity-40 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">
                    {quantity}
                  </span>
                  <button
                    disabled={!product.isAvailable}
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="p-2 rounded-lg hover:bg-muted text-foreground disabled:opacity-40 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  disabled={!product.isAvailable}
                  className="flex-1 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 font-semibold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-base active:scale-[0.98]"
                >
                  <ShoppingBag className="w-5 h-5" />
                  إضافة إلى السلة •{" "}
                  {(product.price * quantity).toLocaleString()} ج.م
                </button>
              </div>
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-2 gap-4 pt-4 text-xs text-muted-foreground border-t border-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>مكونات طازجة 100% يومياً</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>تغليف حراري مخصص للأكل الساخن</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section: Details & Reviews */}
        <div className="pt-8 border-t border-border">
          <div className="flex border-b border-border gap-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-4 text-base font-semibold border-b-2 transition-all ${
                activeTab === "details"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              تفاصيل الوجبة والمكونات
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-4 text-base font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "reviews"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              آراء العملاء
              <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                {product.reviews.length}
              </span>
            </button>
          </div>

          <div className="py-6">
            {activeTab === "details" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.details.length > 0 ? (
                  product.details.map((detail) => (
                    <div
                      key={detail.id}
                      className="flex justify-between p-3.5 rounded-xl bg-card border border-border"
                    >
                      <span className="font-medium text-foreground">
                        {detail.name}
                      </span>
                      <span className="text-muted-foreground">
                        {detail.value}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    لا توجد تفاصيل إضافية لهذا المنتج.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl bg-card border border-border space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">
                          {rev.userName}
                        </span>
                        <div className="flex items-center text-primary">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < rev.rating ? "fill-primary" : "text-muted opacity-40"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    لا توجد تقييمات لهذا المنتج بعد.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
