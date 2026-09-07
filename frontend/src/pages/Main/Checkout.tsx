import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import {
  Sparkles,
  Loader2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

import { useGetCartQuery } from "@/store/features/cartApi";
import { useGetUserInfoQuery } from "@/store/features/User/Auth";
import { useAddOrderMutation } from "@/store/features/orderApi";
import { useInitiatePaymentMutation } from "@/store/features/paymentApi";
import { useGetAllCouponsQuery } from "@/store/features/couponApi";

import { ShippingSection } from "@/components/my/checkout/ShippingSection";
import { CouponSection } from "@/components/my/checkout/CouponSection";
import { PaymentMethodSection } from "@/components/my/checkout/PaymentMethodSection";
import { OrderSummaryCard } from "@/components/my/checkout/OrderSummaryCard";

import { toast } from "sonner";
import { PaymentMethod } from "@/types/types";
import type {
  AddOrderDto,
  GetCouponDto,
  PaymentMethod as PaymentMethodType,
} from "@/types/types";
import type { ApiError } from "@/services/baseQuery";

export default function Checkout() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const navigate = useNavigate();

  const { data: cartItems = [], isLoading: isCartLoading } = useGetCartQuery();
  const {
    data: userInfo,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useGetUserInfoQuery();
  const { data: couponsData, isLoading: isCouponsLoading } =
    useGetAllCouponsQuery();

  const [addOrder, { isLoading: isSubmitting }] = useAddOrderMutation();
  const [initiatePayment, { isLoading: isInitiatingPayment }] =
    useInitiatePaymentMutation();

  const [couponInput, setCouponInput] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<GetCouponDto | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(
    PaymentMethod.cod,
  );
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const couponsList: GetCouponDto[] = Array.isArray(couponsData)
    ? couponsData
    : [];

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.productPrice ?? 0) * item.quantity,
    0,
  );

  const discountPercent = appliedCoupon ? appliedCoupon.discount : 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      toast.error(t("checkout.toast.enter_coupon"));
      return;
    }
    const foundCoupon = couponsList.find((c) => c.code.toUpperCase() === code);
    if (!foundCoupon) {
      toast.error(t("checkout.toast.invalid_coupon"));
      return;
    }
    if (
      foundCoupon.expiryDate &&
      new Date(foundCoupon.expiryDate) < new Date()
    ) {
      toast.error(t("checkout.toast.expired_coupon"));
      return;
    }
    if (subtotal < foundCoupon.minimumAmount) {
      toast.error(
        t("checkout.toast.min_amount", { amount: foundCoupon.minimumAmount }),
      );
      return;
    }
    setAppliedCoupon(foundCoupon);
    toast.success(
      t("checkout.toast.coupon_success", { discount: foundCoupon.discount }),
    );
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    toast.info(t("checkout.toast.coupon_removed"));
  };

  const handlePlaceOrder = async () => {
    if (!userInfo?.address) {
      toast.error(t("checkout.toast.address_required"));
      return;
    }
    if (!userInfo?.phoneNumber) {
      toast.error(t("checkout.toast.phone_required"));
      return;
    }
    const orderDto: AddOrderDto = {
      userAddress: userInfo.address,
      coupon: appliedCoupon ? appliedCoupon.code : undefined,
    };
    try {
      const response = await addOrder(orderDto).unwrap();

      if (paymentMethod === PaymentMethod.online) {
        const paymentResult = await initiatePayment(response.id).unwrap();
        setIframeUrl(paymentResult.iframeUrl);
      } else {
        toast.success(t("checkout.toast.order_success"));
        navigate(`/orders/${response.id}`);
      }
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(error?.message || t("checkout.toast.order_error"));
    }
  };

  if (isUserLoading || isCartLoading || isCouponsLoading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
        <p className="text-xl font-bold text-muted-foreground animate-pulse">
          {t("checkout.loading")}
        </p>
      </div>
    );
  }

  if (isUserError || !userInfo) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-24 h-24 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-foreground mb-4">
          {t("checkout.errors.auth_title")}
        </h2>
        <p className="text-base text-muted-foreground mb-8 max-w-md">
          {t("checkout.errors.auth_desc")}
        </p>
        <Link
          to="/auth"
          className="px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-xl hover:bg-primary/90 transition-all"
        >
          {t("checkout.errors.login_btn")}
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0 && !iframeUrl) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <ShoppingBag className="w-24 h-24 text-muted-foreground mb-6 opacity-40" />
        <h2 className="text-3xl font-black text-foreground mb-4">
          {t("checkout.errors.empty_cart_title")}
        </h2>
        <p className="text-base text-muted-foreground mb-8">
          {t("checkout.errors.empty_cart_desc")}
        </p>
        <Link
          to="/products"
          className="px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-xl hover:bg-primary/90 transition-all"
        >
          {t("checkout.errors.back_menu")}
        </Link>
      </div>
    );
  }

  if (iframeUrl) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-12 animate-in fade-in duration-500">
        <div className="p-8 rounded-3xl bg-card/90 backdrop-blur-2xl border border-border/80 shadow-2xl">
          <h2 className="text-xl font-black text-foreground mb-6 text-center">
            {t("checkout.payment.complete_payment")}
          </h2>
          <iframe
            src={iframeUrl}
            title="Paymob Checkout"
            className="w-full h-[650px] rounded-2xl border border-border/60"
          />
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground flex items-center gap-3">
            <span>{t("checkout.title")}</span>
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </h1>
          <p className="text-base text-muted-foreground mt-2">
            {t("checkout.subtitle")}
          </p>
        </div>

        <Link
          to="/cart"
          className="flex items-center gap-3 text-sm font-bold text-muted-foreground hover:text-primary transition-colors bg-card/60 px-6 py-3 rounded-2xl border border-border/60 shadow-sm"
        >
          {isAr ? (
            <ArrowRight className="w-5 h-5" />
          ) : (
            <ArrowLeft className="w-5 h-5" />
          )}
          <span>{t("checkout.edit_cart")}</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 space-y-8">
          <ShippingSection userInfo={userInfo} />
          <CouponSection
            couponInput={couponInput}
            setCouponInput={setCouponInput}
            appliedCoupon={appliedCoupon}
            handleApplyCoupon={handleApplyCoupon}
            handleRemoveCoupon={handleRemoveCoupon}
          />
          <PaymentMethodSection
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>

        <div className="lg:col-span-5 sticky top-24">
          <OrderSummaryCard
            cartItems={cartItems}
            subtotal={subtotal}
            discountAmount={discountAmount}
            finalTotal={finalTotal}
            appliedCoupon={appliedCoupon}
            isSubmitting={isSubmitting || isInitiatingPayment}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </div>
    </main>
  );
}