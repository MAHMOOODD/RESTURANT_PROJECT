import { useTranslation } from "react-i18next";
import ProductCard from "./ProductCard";
import type { GetProductDto } from "@/types/types";
interface ProductGridProps {
  products: GetProductDto[];
  onAddToCart?: () => void;
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { t } = useTranslation();

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 bg-card/50 rounded-[2.5rem] border border-dashed border-border p-8">
        <p className="text-base font-bold text-muted-foreground">
          {t("products.noProductsFound")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
