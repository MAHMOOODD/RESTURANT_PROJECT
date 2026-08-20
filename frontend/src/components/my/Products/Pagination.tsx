import { useTranslation } from "react-i18next";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      {/* زر الصفحة السابقة */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 rounded-xl bg-card border border-border/80 text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors"
        aria-label={t("products.previousPage")}
      >
        {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* أزرار أرقام الصفحات */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
            currentPage === page
              ? "bg-primary text-primary-foreground shadow-sm scale-105"
              : "bg-card border border-border/80 text-muted-foreground hover:bg-muted"
          }`}
        >
          {page}
        </button>
      ))}

      {/* زر الصفحة التالية */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 rounded-xl bg-card border border-border/80 text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors"
        aria-label={t("products.nextPage")}
      >
        {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </div>
  );
}