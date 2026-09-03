// src/pages/cashier/CashierOrdersPage.tsx
import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetAllOrdersQuery } from "@/store/features/orderApi";
import { useDebounce } from "@/hooks/useDebounce";
import { OrderTable } from "@/components/admin/orders/Ordertable";
import { CashierOrderStatusModal } from "@/components/cashier/orders/CashierOrderStatusModal";
import { OrderStatus, PaymentStatus, type GetOrderDto } from "@/types/types";

const STATUS_OPTIONS = [
  { value: "", key: "adminOrders.statusFilterAll" },
  { value: String(OrderStatus.pending), key: "adminOrders.statusTypes.pending" },
  { value: String(OrderStatus.processing), key: "adminOrders.statusTypes.processing" },
  { value: String(OrderStatus.shipped), key: "adminOrders.statusTypes.shipped" },
  { value: String(OrderStatus.delivered), key: "adminOrders.statusTypes.delivered" },
  { value: String(OrderStatus.cancelled), key: "adminOrders.statusTypes.cancelled" },
] as const;

const PAYMENT_OPTIONS = [
  { value: "", key: "adminOrders.statusFilterPayment" },
  { value: String(PaymentStatus.pending), key: "adminOrders.paymentTypes.pending" },
  { value: String(PaymentStatus.completed), key: "adminOrders.paymentTypes.completed" },
  { value: String(PaymentStatus.failed), key: "adminOrders.paymentTypes.failed" },
  { value: String(PaymentStatus.refunded), key: "adminOrders.paymentTypes.refunded" },
] as const;

export default function CashierOrdersPage() {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<GetOrderDto | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 350);

  const { data, isFetching } = useGetAllOrdersQuery({
    searchTerm: debouncedSearch || undefined,
    status: statusFilter === "" ? undefined : Number(statusFilter),
    paymentStatus: paymentFilter === "" ? undefined : Number(paymentFilter),
    pagination: { pageNumber, pageSize: 10 },
    ascending: false,
    sortByDate: true,
  });

  const orders = data?.data ?? [];

  const handleViewDetails = (order: GetOrderDto) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const selectedStatusOption = STATUS_OPTIONS.find((s) => s.value === statusFilter);
  const selectedPaymentOption = PAYMENT_OPTIONS.find((p) => p.value === paymentFilter);

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">{t("cashierOrders.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("cashierOrders.subtitle")}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-muted-foreground" />
          <input
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPageNumber(1);
            }}
            placeholder={t("adminOrders.searchPlaceholder")}
            className="w-full rounded-2xl border border-border bg-card ps-10 pe-4 py-2.5 text-sm outline-none focus:border-primary shadow-sm"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="relative w-full sm:w-48">
          <button
            type="button"
            onClick={() => {
              setIsStatusOpen((prev) => !prev);
              setIsPaymentOpen(false);
            }}
            className="w-full h-11 px-4 bg-card hover:bg-secondary/80 backdrop-blur-md border border-border rounded-2xl text-foreground font-medium flex items-center justify-between shadow-sm transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/50 text-sm"
          >
            <span className="truncate">
              {selectedStatusOption ? t(selectedStatusOption.key) : t("adminOrders.statusFilterAll")}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                isStatusOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isStatusOpen && (
            <div className="fixed inset-0 z-40" onClick={() => setIsStatusOpen(false)} />
          )}

          {isStatusOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden p-1.5 animate-in fade-in-50 zoom-in-95 backdrop-blur-xl">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setStatusFilter(opt.value);
                    setPageNumber(1);
                    setIsStatusOpen(false);
                  }}
                  className={`w-full text-start px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer my-0.5 ${
                    statusFilter === opt.value
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {t(opt.key)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Payment Status Filter Dropdown */}
        <div className="relative w-full sm:w-48">
          <button
            type="button"
            onClick={() => {
              setIsPaymentOpen((prev) => !prev);
              setIsStatusOpen(false);
            }}
            className="w-full h-11 px-4 bg-card hover:bg-secondary/80 backdrop-blur-md border border-border rounded-2xl text-foreground font-medium flex items-center justify-between shadow-sm transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/50 text-sm"
          >
            <span className="truncate">
              {selectedPaymentOption ? t(selectedPaymentOption.key) : t("adminOrders.statusFilterPayment")}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                isPaymentOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isPaymentOpen && (
            <div className="fixed inset-0 z-40" onClick={() => setIsPaymentOpen(false)} />
          )}

          {isPaymentOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden p-1.5 animate-in fade-in-50 zoom-in-95 backdrop-blur-xl">
              {PAYMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setPaymentFilter(opt.value);
                    setPageNumber(1);
                    setIsPaymentOpen(false);
                  }}
                  className={`w-full text-start px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer my-0.5 ${
                    paymentFilter === opt.value
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {t(opt.key)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-border overflow-hidden bg-card">
        {isFetching ? (
          <p className="text-sm text-muted-foreground text-center py-10">{t("adminOrders.loading")}</p>
        ) : (
          <OrderTable orders={orders} onViewDetails={handleViewDetails} />
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{t("adminOrders.pageInfo", { current: data.pageNumber, total: data.totalPages, count: data.totalRecords })}</span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-xl bg-muted disabled:opacity-40"
            >
              {t("adminOrders.prevPage")}
            </button>
            <button
              type="button"
              disabled={pageNumber >= data.totalPages}
              onClick={() => setPageNumber((p) => p + 1)}
              className="px-3 py-1.5 rounded-xl bg-muted disabled:opacity-40"
            >
              {t("adminOrders.nextPage")}
            </button>
          </div>
        </div>
      )}

      <CashierOrderStatusModal order={selectedOrder} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}