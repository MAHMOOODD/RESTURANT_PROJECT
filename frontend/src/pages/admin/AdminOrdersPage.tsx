import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, ChevronLeft, ChevronRight, ChevronDown, ListFilter } from "lucide-react";
import { useGetAllOrdersQuery } from "@/store/features/orderApi";
import type { GetOrderDto } from "@/types/types";
import { OrderTable } from "@/components/admin/orders/Ordertable";
import { OrderDetailsDialog } from "@/components/admin/orders/Orderdetailsdialog";
import { STATUS_OPTIONS, PAYMENT_OPTIONS } from "@/components/admin/orders/Orderstatusschema";

const ITEMS_PER_PAGE = 8;
const SEARCH_DEBOUNCE_MS = 400;

export default function AdminOrdersPage() {
  const { t } = useTranslation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<GetOrderDto | null>(null);

  // اللي بيتكتب فعليًا في الـ input (بيتحدث فورًا مع كل حرف)
  const [searchInput, setSearchInput] = useState("");
  // اللي بيتبعت فعليًا للـ API بعد الـ debounce
  const [searchQuery, setSearchQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState<number | "all">("all");
  const [paymentFilter, setPaymentFilter] = useState<number | "all">("all");
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce: استنى شوية بعد آخر حرف يكتبه اليوزر قبل ما تبعت الـ request فعليًا
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // السيرش + الفلترة (status / paymentStatus) كلهم Server-Side دلوقتي
  const { data: ordersData, isLoading } = useGetAllOrdersQuery({
    pagination: { pageNumber: currentPage, pageSize: ITEMS_PER_PAGE },
    searchTerm: searchQuery || undefined,
    sortByDate: true,
    ascending: false,
    status: statusFilter === "all" ? undefined : statusFilter,
    paymentStatus: paymentFilter === "all" ? undefined : paymentFilter,
  });

  const orders = useMemo(() => ordersData?.data || [], [ordersData]);
  const totalRecords = ordersData?.totalRecords || 0;
  const totalPages = ordersData?.totalPages || 1;
  const totalRecordInPage = ordersData?.data?.length || 0;

  const handleViewDetails = (order: GetOrderDto) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const selectedStatusOption = STATUS_OPTIONS.find((s) => s.value === statusFilter);
  const selectedPaymentOption = PAYMENT_OPTIONS.find((p) => p.value === paymentFilter);

  return (
    <div className="w-full flex flex-col space-y-5 p-4 md:p-6 lg:p-8 animate-in fade-in duration-300 pb-16">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border shrink-0">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {t("adminOrders.title")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            {t("adminOrders.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2 h-11 sm:h-12 px-5 rounded-2xl bg-muted/60 border border-border/60 shrink-0">
          <ListFilter className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">
            {t("adminOrders.totalOrders")}: {totalRecords}
          </span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("adminOrders.searchPlaceholder")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 rtl:pr-10 rtl:pl-3 bg-card backdrop-blur-md border border-border rounded-2xl h-11 focus:outline-none focus:ring-2 focus:ring-ring/50 shadow-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status Filter Dropdown */}
          <div className="relative w-full sm:w-48">
            <button
              type="button"
              onClick={() => {
                setIsStatusOpen((prev) => !prev);
                setIsPaymentOpen(false);
              }}
              className="w-full h-11 px-4 bg-card hover:bg-secondary/80 backdrop-blur-md border border-border rounded-2xl text-foreground font-medium flex items-center justify-between shadow-sm transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/50"
            >
              <span className="truncate">
                {statusFilter === "all"
                  ? t("adminOrders.statusFilterAll")
                  : selectedStatusOption
                  ? t(selectedStatusOption.labelKey)
                  : t("adminOrders.statusFilterAll")}
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
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("all");
                    setCurrentPage(1);
                    setIsStatusOpen(false);
                  }}
                  className={`w-full text-start px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    statusFilter === "all"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {t("adminOrders.statusFilterAll")}
                </button>

                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => {
                      setStatusFilter(s.value);
                      setCurrentPage(1);
                      setIsStatusOpen(false);
                    }}
                    className={`w-full text-start px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer my-0.5 ${
                      statusFilter === s.value
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {t(s.labelKey)}
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
              className="w-full h-11 px-4 bg-card hover:bg-secondary/80 backdrop-blur-md border border-border rounded-2xl text-foreground font-medium flex items-center justify-between shadow-sm transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/50"
            >
              <span className="truncate">
                {paymentFilter === "all"
                  ? t("adminOrders.statusFilterPayment")
                  : selectedPaymentOption
                  ? t(selectedPaymentOption.labelKey)
                  : t("adminOrders.statusFilterPayment")}
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
                <button
                  type="button"
                  onClick={() => {
                    setPaymentFilter("all");
                    setCurrentPage(1);
                    setIsPaymentOpen(false);
                  }}
                  className={`w-full text-start px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    paymentFilter === "all"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {t("adminOrders.statusFilterPayment")}
                </button>

                {PAYMENT_OPTIONS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => {
                      setPaymentFilter(p.value);
                      setCurrentPage(1);
                      setIsPaymentOpen(false);
                    }}
                    className={`w-full text-start px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer my-0.5 ${
                      paymentFilter === p.value
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {t(p.labelKey)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="w-full flex flex-col border border-border rounded-3xl shadow-sm overflow-hidden bg-card backdrop-blur-md">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-base sm:text-lg font-medium">
            {t("adminOrders.loading")}
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <OrderTable orders={orders} onViewDetails={handleViewDetails} />
          </div>
        )}

        {/* Footer / Pagination */}
        <div className="px-6 py-4 border-t border-border bg-secondary/50 shrink-0 flex items-center justify-between gap-4">
          <span className="text-xs sm:text-sm text-muted-foreground font-semibold">
            {t("adminOrders.pageInfo", {
              current: currentPage,
              total: totalPages,
              count: totalRecordInPage,
            })}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="h-9 px-3 rounded-xl border border-border bg-card hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-foreground flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-9 px-3 rounded-xl border border-border bg-card hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-foreground flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* Details Dialog */}
      <OrderDetailsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        order={selectedOrder}
      />
    </div>
  );
}