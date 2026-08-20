import { useTranslation } from "react-i18next";
import ProductCard from "./ProductCard";
import type { GetProductDto } from "@/types/types";

interface ProductGridProps {
  products: GetProductDto[];
  onAddToCart?: (product: GetProductDto) => void;
}

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  const { t } = useTranslation();

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 bg-card/50 rounded-3xl border border-dashed border-border p-6">
        <p className="text-sm font-bold text-muted-foreground">
          {t("products.noProductsFound")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}