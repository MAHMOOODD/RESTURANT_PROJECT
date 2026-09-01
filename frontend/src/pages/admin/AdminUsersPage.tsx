// src/pages/AdminUsersPage.tsx
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, ListFilter } from "lucide-react";
import { useGetAllUsersQuery } from "@/store/features/User/Auth";
import { UserTable } from "@/components/admin/users/UserTable";
import { UserDetailsDialog } from "@/components/admin/users/UserDetailsDialog";

const ITEMS_PER_PAGE = 8;
const SEARCH_DEBOUNCE_MS = 400;

export default function AdminUsersPage() {
  const { t } = useTranslation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // اللي بيتكتب فعليًا في الـ input
  const [searchInput, setSearchInput] = useState("");
  // اللي بيتبعت فعليًا للـ API بعد الـ debounce
  const [searchQuery, setSearchQuery] = useState("");

  const [sortByUsername, setSortByUsername] = useState(false);
  const [ascending, setAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: usersData, isLoading } = useGetAllUsersQuery({
    pagination: { pageNumber: currentPage, pageSize: ITEMS_PER_PAGE },
    searchTerm: searchQuery || undefined,
    sortByUsername,
    ascending,
  });

  const users = useMemo(() => usersData?.data || [], [usersData]);
  const totalRecords = usersData?.totalRecords || 0;
  const totalPages = usersData?.totalPages || 1;
  const totalRecordInPage = usersData?.data?.length || 0;

  const handleViewDetails = (userId: string) => {
    setSelectedUserId(userId);
    setIsDialogOpen(true);
  };

  // زرار الترتيب: off -> تصاعدي -> تنازلي -> off
  const handleToggleSort = () => {
    if (!sortByUsername) {
      setSortByUsername(true);
      setAscending(true);
    } else if (ascending) {
      setAscending(false);
    } else {
      setSortByUsername(false);
      setAscending(true);
    }
    setCurrentPage(1);
  };

  const sortLabel = !sortByUsername
    ? t("adminUsers.sortDefault")
    : ascending
      ? t("adminUsers.sortAsc")
      : t("adminUsers.sortDesc");

  return (
    <div className="w-full flex flex-col space-y-5 p-4 md:p-6 lg:p-8 animate-in fade-in duration-300 pb-16">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border shrink-0">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {t("adminUsers.title")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            {t("adminUsers.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2 h-11 sm:h-12 px-5 rounded-2xl bg-muted/60 border border-border/60 shrink-0">
          <ListFilter className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">
            {t("adminUsers.totalUsers")}: {totalRecords}
          </span>
        </div>
      </div>

      {/* Search & Sort Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("adminUsers.searchPlaceholder")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 rtl:pr-10 rtl:pl-3 bg-card backdrop-blur-md border border-border rounded-2xl h-11 focus:outline-none focus:ring-2 focus:ring-ring/50 shadow-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <button
          type="button"
          onClick={handleToggleSort}
          className={`h-11 px-4 rounded-2xl border font-medium flex items-center gap-2 shadow-sm transition-all duration-200 cursor-pointer shrink-0 ${
            sortByUsername
              ? "bg-primary/10 border-primary/40 text-primary"
              : "bg-card border-border text-foreground hover:bg-secondary/80"
          }`}
        >
          <ArrowUpDown className="h-4 w-4" />
          <span className="text-sm">{sortLabel}</span>
        </button>
      </div>

      {/* Main Content Container */}
      <div className="w-full flex flex-col border border-border rounded-3xl shadow-sm overflow-hidden bg-card backdrop-blur-md">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-base sm:text-lg font-medium">
            {t("adminUsers.loading")}
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <UserTable users={users} onViewDetails={handleViewDetails} />
          </div>
        )}

        {/* Footer / Pagination */}
        <div className="px-6 py-4 border-t border-border bg-secondary/50 shrink-0 flex items-center justify-between gap-4">
          <span className="text-xs sm:text-sm text-muted-foreground font-semibold">
            {t("adminUsers.pageInfo", {
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
      <UserDetailsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        userId={selectedUserId}
      />
    </div>
  );
}
