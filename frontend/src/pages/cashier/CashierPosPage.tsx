// src/pages/cashier/CashierPosPage.tsx
import { useCallback, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  useGetAllCategoriesQuery,
  useGetProductByCategoryIdQuery,
  useGetProductByNameQuery,
} from "@/store/features/productApi";
import { useDebounce } from "@/hooks/useDebounce";
import { CashierCategoryCard } from "@/components/cashier/neworder/CashierCategoryCard";
import { CashierProductCard } from "@/components/cashier/neworder/CashierProductCard";
import {
  CashierCartPanel,
  type CartLine,
} from "@/components/cashier/neworder/CashierCartPanel";
import type { GetAllProductDto } from "@/types/types";

export default function CashierPosPage() {
  const { t } = useTranslation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [searchInput, setSearchInput] = useState("");
  const [cartItems, setCartItems] = useState<CartLine[]>([]);

  const debouncedSearch = useDebounce(searchInput, 350);
  const isSearching = debouncedSearch.trim().length > 0;

  const { data: categories } = useGetAllCategoriesQuery();

  const { data: categoryProducts, isFetching: isLoadingCategoryProducts } =
    useGetProductByCategoryIdQuery(
      {
        categoryId: selectedCategoryId as number,
        filter: { pagination: { pageNumber: 1, pageSize: 50 } },
      },
      { skip: isSearching || selectedCategoryId === null },
    );

  const { data: searchedProducts, isFetching: isLoadingSearch } =
    useGetProductByNameQuery(
      {
        name: debouncedSearch,
        filter: { pagination: { pageNumber: 1, pageSize: 50 } },
      },
      { skip: !isSearching },
    );

  const products = isSearching
    ? searchedProducts?.data
    : categoryProducts?.data;
  const isLoadingProducts = isSearching
    ? isLoadingSearch
    : isLoadingCategoryProducts;

  // useCallback يمنع إعادة إنشاء الدوال دي كل رندر، وده اللي بيخلي React.memo بتاع الكاردز يشتغل فعلياً
  const handleAddToCart = useCallback((product: GetAllProductDto) => {
    setCartItems((prev: CartLine[]) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          nameAr: product.nameAr,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl,
        },
      ];
    });
  }, []);

  const handleIncrement = useCallback((productId: number) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    );
  }, []);

  const handleDecrement = useCallback((productId: number) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const handleRemove = useCallback((productId: number) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const handleOrderComplete = useCallback(() => setCartItems([]), []);

  const productsGrid = useMemo(
    () =>
      products?.map((product) => (
        <CashierProductCard
          key={product.id}
          product={product}
          onAdd={handleAddToCart}
        />
      )),
    [products, handleAddToCart],
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 sm:gap-6 h-full">
      <div className="flex flex-col gap-4 min-h-0">
        <div className="relative shrink-0">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-muted-foreground" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("cashierPos.searchPlaceholder")}
            className="w-full rounded-2xl border border-border bg-card ps-10 pe-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        {!isSearching && (
          <div className="flex gap-3 overflow-x-auto pb-1 shrink-0">
            {categories?.map((cat) => (
              <CashierCategoryCard
                key={cat.id}
                category={cat}
                active={selectedCategoryId === cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
              />
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto min-h-0">
          {!isSearching && selectedCategoryId === null && (
            <p className="text-sm text-muted-foreground text-center py-16">
              {t("cashierPos.selectCategoryPrompt")}
            </p>
          )}
          {isLoadingProducts && (
            <p className="text-sm text-muted-foreground text-center py-16">
              {t("cashierPos.loadingProducts")}
            </p>
          )}
          {!isLoadingProducts && products?.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-16">
              {t("cashierPos.noProducts")}
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {productsGrid}
          </div>
        </div>
      </div>

      <div className="min-h-0">
        <CashierCartPanel
          items={cartItems}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onRemove={handleRemove}
          onOrderComplete={handleOrderComplete}
        />
      </div>
    </div>
  );
}
