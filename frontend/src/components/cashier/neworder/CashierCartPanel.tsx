// src/components/cashier/CashierCartPanel.tsx
import { useMemo, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useGetAllUsersQuery } from "@/store/features/User/Auth";
import { useAddPosOrderMutation } from "@/store/features/orderApi";
import { useValidateCouponMutation } from "@/store/features/couponApi";
import { useDebounce } from "@/hooks/useDebounce";
import {
  buildCashierOrderSchema,
  type CashierOrderFormValues,
} from "@/components/cashier/neworder/cashierOrderSchema";
import { CashierCartItemRow } from "./CashierCartItemRow";
import { CashierInvoiceModal, type InvoiceData } from "../neworder/CashierInvoiceModal";
import type { ApiError } from "@/services/baseQuery";

export interface CartLine {
  productId: number;
  name: string;
  nameAr: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface Props {
  items: CartLine[];
  onIncrement: (productId: number) => void;
  onDecrement: (productId: number) => void;
  onRemove: (productId: number) => void;
  onOrderComplete: () => void;
}

export function CashierCartPanel({
  items,
  onIncrement,
  onDecrement,
  onRemove,
  onOrderComplete,
}: Props) {
  const { t } = useTranslation();

  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomerLabel, setSelectedCustomerLabel] = useState<
    string | null
  >(null);
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(
    null,
  );
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  const debouncedCustomerSearch = useDebounce(customerSearch, 350);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );
  const total = useMemo(
    () =>
      appliedDiscount
        ? subtotal - (appliedDiscount / 100) * subtotal
        : subtotal,
    [subtotal, appliedDiscount],
  );

  const schema = useMemo(() => buildCashierOrderSchema(t, total), [t, total]);

  const {
    control,
    register,
    handleSubmit,
    
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CashierOrderFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { customerMode: "guest", amountPaid: 0, couponCode: "" },
  });

const customerMode = useWatch({ control, name: "customerMode" });
const amountPaid = Number(useWatch({ control, name: "amountPaid" })) || 0;
const couponCodeValue = useWatch({ control, name: "couponCode" });
  const change = amountPaid - total;

  const { data: usersResult, isFetching: isSearchingUsers } =
    useGetAllUsersQuery(
      {
        searchTerm: debouncedCustomerSearch,
        pagination: { pageNumber: 1, pageSize: 8 },
      },
      {
        skip:
          customerMode !== "registered" ||
          debouncedCustomerSearch.trim().length < 1,
      },
    );

  const [validateCoupon, { isLoading: isValidatingCoupon }] =
    useValidateCouponMutation();
  const [addPosOrder] = useAddPosOrderMutation();

  const handleApplyCoupon = async () => {
    const code = couponCodeValue?.trim();
    if (!code) return;
    try {
      const res = await validateCoupon({ code, amount: subtotal }).unwrap();
      setAppliedDiscount(res.discount);
      setAppliedCouponCode(code);
      toast.success(t("cashierPos.cart.toast.couponSuccess", { code }));
    } catch (err: unknown) {
      setAppliedDiscount(null);
      setAppliedCouponCode(null);
      toast.error(
        (err as ApiError)?.message || t("cashierPos.cart.toast.couponError"),
      );
    }
  };

  const handleResetForNewOrder = () => {
    reset({ customerMode: "guest", amountPaid: 0, couponCode: "" });
    setSelectedCustomerLabel(null);
    setCustomerSearch("");
    setAppliedDiscount(null);
    setAppliedCouponCode(null);
    setInvoiceData(null);
    onOrderComplete();
  };

  const onSubmit = async (values: CashierOrderFormValues) => {
    try {
      const res = await addPosOrder({
        customerId:
          values.customerMode === "registered" ? values.customerId : undefined,
        guestName:
          values.customerMode === "guest"
            ? values.guestName?.trim()
            : undefined,
        guestPhone:
          values.customerMode === "guest"
            ? values.guestPhone?.trim() || undefined
            : undefined,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        couponCode: appliedDiscount
          ? (appliedCouponCode ?? undefined)
          : undefined,
        amountPaid: values.amountPaid,
      }).unwrap();

      toast.success(t("cashierPos.cart.toast.orderSuccess"));

      setInvoiceData({
        orderNumber: res?.id,
        createdAt: new Date().toISOString(),
        customerName:
          values.customerMode === "registered"
            ? (selectedCustomerLabel ??
              t("cashierPos.cart.customerModes.registered"))
            : values.guestName?.trim() || t("cashierPos.invoice.guestCustomer"),
        items: items.map((i) => ({ ...i })),
        subtotal,
        discount: appliedDiscount ? subtotal - total : 0,
        total,
        amountPaid: values.amountPaid,
        change,
      });
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(error?.message || t("cashierPos.cart.toast.orderError"));
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-3xl border border-border bg-card shadow-sm p-4 sm:p-5 flex flex-col h-full max-h-full"
      >
        <h3 className="text-base font-black text-foreground mb-3">
          {t("cashierPos.cart.title")}
        </h3>

        <div className="flex-1 overflow-y-auto flex flex-col gap-2 min-h-0">
          {items.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8">
              {t("cashierPos.cart.emptyCart")}
            </p>
          )}
          {items.map((item) => (
            <CashierCartItemRow
              key={item.productId}
              item={item}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              onRemove={onRemove}
            />
          ))}
        </div>

        <div className="border-t border-border/60 pt-3 mt-3 flex flex-col gap-3 shrink-0">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setValue("customerMode", "guest")}
              className={cn(
                "flex-1 py-1.5 rounded-xl text-xs font-bold transition-colors",
                customerMode === "guest"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground",
              )}
            >
              {t("cashierPos.cart.customerModes.guest")}
            </button>
            <button
              type="button"
              onClick={() => setValue("customerMode", "registered")}
              className={cn(
                "flex-1 py-1.5 rounded-xl text-xs font-bold transition-colors",
                customerMode === "registered"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground",
              )}
            >
              {t("cashierPos.cart.customerModes.registered")}
            </button>
          </div>

          {customerMode === "guest" ? (
            <div className="flex flex-col gap-1">
              <input
                {...register("guestName")}
                placeholder={t("cashierPos.cart.guestNamePlaceholder")}
                className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 outline-none focus:border-primary"
              />
              {errors.guestName && (
                <p className="text-[11px] text-rose-500">
                  {errors.guestName.message}
                </p>
              )}

              <input
                {...register("guestPhone")}
                placeholder={t("cashierPos.cart.guestPhonePlaceholder")}
                className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 outline-none focus:border-primary mt-1"
              />
              {errors.guestPhone && (
                <p className="text-[11px] text-rose-500">
                  {errors.guestPhone.message}
                </p>
              )}
            </div>
          ) : (
            <Controller
              control={control}
              name="customerId"
              render={({ field }) => (
                <div className="relative">
                  <input
                    value={selectedCustomerLabel ?? customerSearch}
                    onChange={(e) => {
                      field.onChange(undefined);
                      setSelectedCustomerLabel(null);
                      setCustomerSearch(e.target.value);
                    }}
                    placeholder={t("cashierPos.cart.customerSearchPlaceholder")}
                    className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 outline-none focus:border-primary"
                  />
                  {customerSearch.trim().length >= 1 && !field.value && (
                    <div className="absolute z-10 top-full mt-1 w-full bg-card border border-border rounded-xl shadow-lg max-h-40 overflow-y-auto">
                      {isSearchingUsers && (
                        <p className="text-xs text-muted-foreground p-2">
                          {t("cashierPos.cart.searching")}
                        </p>
                      )}
                      {usersResult?.data?.length === 0 && !isSearchingUsers && (
                        <p className="text-xs text-muted-foreground p-2">
                          {t("cashierPos.cart.noCustomersFound")}
                        </p>
                      )}
                      {usersResult?.data?.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            field.onChange(u.id);
                            setSelectedCustomerLabel(u.fullName || u.userName);
                            setCustomerSearch("");
                          }}
                          className="w-full text-start text-xs px-3 py-2 hover:bg-muted/50"
                        >
                          {u.fullName || u.userName}{" "}
                          {u.phoneNumber ? `— ${u.phoneNumber}` : ""}
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.customerId && (
                    <p className="text-[11px] text-rose-500 mt-1">
                      {errors.customerId.message}
                    </p>
                  )}
                </div>
              )}
            />
          )}

          <div className="flex gap-2">
            <input
              {...register("couponCode")}
              onChange={(e) => {
                setValue("couponCode", e.target.value);
                setAppliedDiscount(null);
                setAppliedCouponCode(null);
              }}
              placeholder={t("cashierPos.cart.couponPlaceholder")}
              className="flex-1 text-xs rounded-xl border border-border bg-background px-3 py-2 outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={isValidatingCoupon || !couponCodeValue?.trim()}
              className="px-3 rounded-xl bg-muted text-xs font-bold hover:bg-muted/70 disabled:opacity-50"
            >
              {t("cashierPos.cart.applyCoupon")}
            </button>
          </div>
          {appliedDiscount != null && (
            <p className="text-[11px] text-emerald-600 font-bold">
              {t("cashierPos.cart.couponApplied", {
                discount: appliedDiscount,
              })}
            </p>
          )}

          <div className="flex flex-col gap-1 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>{t("cashierPos.cart.subtotal")}</span>
              <span>
                {subtotal.toLocaleString()} {t("cashierPos.currency")}
              </span>
            </div>
            {appliedDiscount != null && (
              <div className="flex justify-between text-emerald-600">
                <span>{t("cashierPos.cart.discount")}</span>
                <span>
                  - {(subtotal - total).toLocaleString()}{" "}
                  {t("cashierPos.currency")}
                </span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-foreground pt-1 border-t border-border/60">
              <span>{t("cashierPos.cart.finalTotal")}</span>
              <span>
                {total.toLocaleString()} {t("cashierPos.currency")}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground">
              {t("cashierPos.cart.amountPaidLabel")}
            </label>
            <input
              type="number"
              inputMode="decimal"
              {...register("amountPaid")}
              placeholder={t("cashierPos.cart.amountPaidPlaceholder")}
              className="w-full text-lg font-black rounded-xl border border-border bg-background px-3 py-2 outline-none focus:border-primary"
            />
            {errors.amountPaid && (
              <p className="text-[11px] text-rose-500">
                {errors.amountPaid.message}
              </p>
            )}
          </div>

          <div
            className={cn(
              "flex justify-between items-center rounded-xl px-3 py-2.5 font-black text-sm",
              change < 0
                ? "bg-rose-500/10 text-rose-600"
                : "bg-emerald-500/10 text-emerald-600",
            )}
          >
            <span>
              {change < 0
                ? t("cashierPos.cart.amountShort")
                : t("cashierPos.cart.changeDue")}
            </span>
            <span>
              {Math.abs(change).toLocaleString()} {t("cashierPos.currency")}
            </span>
          </div>

          <button
            type="submit"
            disabled={items.length === 0 || isSubmitting}
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-md shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? t("cashierPos.cart.submitting")
              : t("cashierPos.cart.submitBtn")}
          </button>
        </div>
      </form>

      {invoiceData && (
        <CashierInvoiceModal
          data={invoiceData}
          onClose={handleResetForNewOrder}
        />
      )}
    </>
  );
}
