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
    <div className="flex items-center justify-center gap-3 pt-8">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-3 rounded-2xl bg-card border border-border text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/80 hover:text-foreground transition-colors cursor-pointer shadow-sm"
        aria-label={t("products.previousPage")}
      >
        {isRtl ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-11 h-11 rounded-2xl text-sm font-bold transition-all cursor-pointer shadow-sm ${
            currentPage === page
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105"
              : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-3 rounded-2xl bg-card border border-border text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/80 hover:text-foreground transition-colors cursor-pointer shadow-sm"
        aria-label={t("products.nextPage")}
      >
        {isRtl ? (
          <ChevronLeft className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
