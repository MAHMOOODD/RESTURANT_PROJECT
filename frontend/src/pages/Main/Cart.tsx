import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  UtensilsCrossed,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

import {
  useGetCartQuery,
  useEditCartItemMutation,
  useDeleteCartItemMutation,
  useClearCartMutation,
} from "@/store/features/cartApi";
import { useGetUserInfoQuery } from "@/store/features/User/Auth";
import { toast } from "sonner";

import { CartItemCard } from "@/components/my/cart/CartItemCard";
import { CartHeader } from "@/components/my/cart/CartHeader";
import { CartSummary } from "@/components/my/cart/CartSummary";
import { ClearCartModal } from "@/components/my/cart/ClearCartModal";

export default function Cart() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const { data: cartItems = [], isLoading } = useGetCartQuery();
  const { data: userInfo } = useGetUserInfoQuery(undefined);

  const [editCartItem, { isLoading: isEditing }] = useEditCartItemMutation();
  const [deleteCartItem, { isLoading: isDeleting }] =
    useDeleteCartItemMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();

  const totalItemsCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  const handleQuantityChange = async (
    cartItemId: number,
    currentQuantity: number,
    delta: number,
  ) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) return;
    try {
      await editCartItem({
        cartItemId,
        dto: { quantity: newQuantity },
      }).unwrap();
    } catch {
      toast.error(t("cart.update_error"));
    }
  };

  const handleDeleteItem = async (cartItemId: number) => {
    try {
      await deleteCartItem(cartItemId).unwrap();
      toast.success(t("cart.item_deleted"));
    } catch {
      toast.error(t("cart.delete_error"));
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart().unwrap();
      toast.success(t("cart.cleared"));
      setIsClearModalOpen(false);
      window.location.reload();
    } catch {
      toast.error(t("cart.clear_error"));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-6">
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <ShoppingBag className="w-10 h-10 text-primary absolute" />
        </div>
        <p className="text-xl font-bold text-muted-foreground animate-pulse">
          {t("cart.loading")}
        </p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-36 h-36 rounded-full bg-linear-to-tr from-primary/20 to-orange-500/10 border-2 border-primary/30 flex items-center justify-center mb-8 shadow-2xl relative group">
          <UtensilsCrossed className="w-16 h-16 text-primary group-hover:rotate-12 transition-transform duration-500" />
          <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-6 w-6 bg-primary" />
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
          {t("cart.empty_title")}
        </h2>
        <p className="text-muted-foreground text-lg max-w-lg mb-10 leading-relaxed">
          {t("cart.empty_desc")}
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-base shadow-2xl shadow-primary/30 active:scale-95 transition-all"
        >
          <ShoppingBag className="w-6 h-6" />
          <span>{t("cart.browse_menu")}</span>
          {isAr ? (
            <ArrowLeft className="w-6 h-6" />
          ) : (
            <ArrowRight className="w-6 h-6" />
          )}
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 animate-in fade-in duration-500 space-y-10 relative">
      <CartHeader
        userInfo={userInfo}
        onClearCart={() => setIsClearModalOpen(true)}
        isClearing={isClearing}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-7 h-7 text-primary" />
              <h2 className="text-2xl font-black text-foreground">
                {t("cart.items_header")}
              </h2>
            </div>
            <span className="text-sm font-bold text-muted-foreground bg-muted/60 px-4 py-2 rounded-full border border-border/50">
              {cartItems.length} {t("cart.different_items")}
            </span>
          </div>

          {cartItems.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onDelete={handleDeleteItem}
              isEditing={isEditing}
              isDeleting={isDeleting}
            />
          ))}
        </div>

        <CartSummary
          itemsCount={cartItems.length}
          totalQuantity={totalItemsCount}
        />
      </div>

      {/* Clear Cart Confirmation Modal */}
      <ClearCartModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearCart}
        isClearing={isClearing}
      />
    </main>
  );
}
