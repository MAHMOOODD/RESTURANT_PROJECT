// المسار المقترح: src/pages/admin/AdminCouponsPage.tsx
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Plus, TicketPercent } from "lucide-react";
import { useGetAllCouponsQuery } from "@/store/features/couponApi";
import type { GetCouponDto } from "@/types/types";
import { CouponTable } from "@/components/admin/coupons/CouponTable";
import { CouponFormDialog } from "@/components/admin/coupons/CouponFormDialog";
import { DeleteCouponDialog } from "@/components/admin/coupons/DeleteCouponDialog";

export default function AdminCouponsPage() {
  const { t } = useTranslation();

  const { data: coupons, isLoading, isError } = useGetAllCouponsQuery();

  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<GetCouponDto | null>(
    null,
  );

  // فلترة بالكود على الداتا الموجودة بالفعل عند الكلاينت،
  // لأن endpoint الـ GetAllCoupons بيرجع الليستة كاملة من غير Pagination من الباك.
  const filteredCoupons = useMemo(() => {
    if (!coupons) return [];

    const term = searchTerm.trim().toLowerCase();
    if (!term) return coupons;

    return coupons.filter((coupon) =>
      coupon.code.toLowerCase().includes(term),
    );
  }, [coupons, searchTerm]);

  const handleAdd = () => {
    setSelectedCoupon(null);
    setIsFormOpen(true);
  };

  const handleEdit = (coupon: GetCouponDto) => {
    setSelectedCoupon(coupon);
    setIsFormOpen(true);
  };

  const handleDelete = (coupon: GetCouponDto) => {
    setSelectedCoupon(coupon);
    setIsDeleteOpen(true);
  };

  const emptyMessage =
    coupons && coupons.length > 0
      ? t("adminCoupons.noSearchResults")
      : t("adminCoupons.emptyState");

  return (
    <div className="w-full flex flex-col space-y-5 p-4 md:p-6 lg:p-8 animate-in fade-in duration-300 pb-16">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border shrink-0">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {t("adminCoupons.title")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            {t("adminCoupons.subtitle")}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 active:scale-95 cursor-pointer outline-none shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>{t("adminCoupons.addNewCoupon")}</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("adminCoupons.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 rtl:pr-10 rtl:pl-3 bg-card backdrop-blur-md border border-border rounded-2xl h-11 focus:outline-none focus:ring-2 focus:ring-ring/50 shadow-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-2 h-11 px-5 rounded-2xl bg-muted/60 border border-border/60 shrink-0 w-full sm:w-auto justify-center sm:justify-start">
          <TicketPercent className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">
            {t("adminCoupons.totalCoupons")}: {coupons?.length ?? 0}
          </span>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="w-full flex flex-col border border-border rounded-3xl shadow-sm overflow-hidden bg-card backdrop-blur-md">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-base sm:text-lg font-medium">
            {t("adminCoupons.loading")}
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-20 text-rose-500 text-base sm:text-lg font-medium">
            {t("adminCoupons.fetchError")}
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <CouponTable
              coupons={filteredCoupons}
              onEdit={handleEdit}
              onDelete={handleDelete}
              emptyMessage={emptyMessage}
            />
          </div>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <CouponFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        coupon={selectedCoupon}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteCouponDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        coupon={selectedCoupon}
      />
    </div>
  );
}
