import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useGetAllProductsQuery } from "@/store/features/productApi";
import {
  useAddToCartMutation,
  useGetCartQuery,
  useDeleteCartItemMutation,
} from "@/store/features/cartApi";
import type { AddToCartDto } from "@/types/types";
import type { ApiError } from "@/services/baseQuery";

import BentoHeader from "./BentoHeader";
import BentoItem from "./BentoItem";
import { useTranslation } from "react-i18next";
const EQUAL_SPAN = "col-span-1";

export default function BentoProducts() {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const { t } = useTranslation();

  const [addToCart] = useAddToCartMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();
  const { data: cartData } = useGetCartQuery();

  const {
    data: productsRes,
    isLoading,
    isError,
  } = useGetAllProductsQuery({
    pagination: { pageNumber: 1, pageSize: 6 },
    sortBySelling: true,
  });

  // حساب القائمة مباشرة - React Compiler سيهتم بالـ Memoization تلقائيًا
  const topProducts = productsRes?.data
    ? [...productsRes.data].sort(
        (a, b) => (b.sellCount || 0) - (a.sellCount || 0),
      )
    : [];

  // دالة التعامل مع الإضافة والحذف من السلة
  const handleAddToCart = (productId: number) => async () => {
    const cartItem = cartData?.find(
      (item) => Number(item.productId) === Number(productId),
    );
    const isAdded = cartItem !== undefined;

    setActionLoadingId(productId);

    try {
      if (isAdded && cartItem) {
        await deleteCartItem(cartItem.id).unwrap();
        toast.success(
          t("products.removedFromCart")
        );
      } else {
        await addToCart({
          productId: productId,
          dto: { quantity: 1 },
        }).unwrap();
        toast.success(t("products.addedToCart"));
      }
    } catch (error) {
      const apiErr = error as ApiError<AddToCartDto>;
      console.error("Error managing cart:", apiErr);
      toast.error(
        isAdded
          ? t("products.removeFromCartError")
          : t("products.addToCartError"),
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || topProducts.length === 0) {
    return null;
  }

  // التحقق مما إذا كان المنتج المحدد في المودال مضافاً للسلة أم لا
  const selectedCartItem = cartData?.find(
    (item) => Number(item.productId) === Number(selectedProductId),
  );
  const isSelectedAdded = selectedCartItem !== undefined;
  console.log("Selected Product ID:", isSelectedAdded);

  return (
    <section className="py-16  space-y-10">
      <BentoHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {topProducts.map((prod) => {
          const cartItem = cartData?.find(
            (item) => Number(item.productId) === Number(prod.id),
          );
          const isAdded = cartItem !== undefined;

          return (
            <BentoItem
              key={prod.id}
              product={prod}
              spanClass={EQUAL_SPAN}
              onOpenModal={(id) => setSelectedProductId(id)}
              isAdded={isAdded}
              isLoading={actionLoadingId === prod.id}
              onAddToCart={handleAddToCart(prod.id)}
            />
          );
        })}
      </div>

      
    
    </section>
  );
}