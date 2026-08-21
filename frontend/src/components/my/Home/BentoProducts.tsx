import {useState } from "react";
import { Loader2 } from "lucide-react";

import { useGetAllProductsQuery } from "@/store/features/productApi";
import ProductDetailsModal from "@/components/my/Products/ProductDetailsModal";
import BentoHeader from "./BentoHeader";
import BentoItem from "./BentoItem";
import burgerFallback from "@/assets/bb.jpg";

const BENTO_SPANS = [
  "col-span-1 md:col-span-2 lg:col-span-2",
  "col-span-1 md:col-span-1 lg:col-span-1",
  "col-span-1 md:col-span-1 lg:col-span-1",
  "col-span-1 md:col-span-1 lg:col-span-1",
  "col-span-1 md:col-span-1 lg:col-span-1",
];

export default function BentoProducts() {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );

  const {
    data: productsRes,
    isLoading,
    isError,
  } = useGetAllProductsQuery({
    pagination: { pageNumber: 1, pageSize: 5 },
    sortBySelling: true,
  });

  // حساب القائمة مباشرة - React Compiler سيهتم بالـ Memoization تلقائيًا
  const topProducts = productsRes?.data
    ? [...productsRes.data].sort(
        (a, b) => (b.sellCount || 0) - (a.sellCount || 0),
      )
    : [];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || topProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-10 space-y-6">
      <BentoHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {topProducts.map((prod, index) => (
          <BentoItem
            key={prod.id}
            product={prod}
            spanClass={BENTO_SPANS[index % BENTO_SPANS.length]}
            onOpenModal={(id) => setSelectedProductId(id)}
          />
        ))}
      </div>

      {selectedProductId !== null && (
        <ProductDetailsModal
          productId={selectedProductId}
          isOpen={selectedProductId !== null}
          onClose={() => setSelectedProductId(null)}
          onAddToCart={() => {}}
          addedToCart={false}
          fallbackImage={burgerFallback}
        />
      )}
    </section>
  );
}
