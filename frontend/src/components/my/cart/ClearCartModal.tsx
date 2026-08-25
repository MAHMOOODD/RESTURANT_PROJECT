import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";

interface ClearCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isClearing: boolean;
}

export function ClearCartModal({
  isOpen,
  onClose,
  onConfirm,
  isClearing,
}: ClearCartModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border/80 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-black text-foreground">
            {t("cart.clear_modal.title")}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("cart.clear_modal.spec")}
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isClearing}
            className="flex-1 py-3.5 px-4 rounded-2xl border border-border bg-muted/50 hover:bg-muted text-foreground font-bold text-sm transition-all cursor-pointer active:scale-95"
          >
            {t("cart.clear_modal.cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isClearing}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-lg shadow-rose-600/25 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            {isClearing ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>{t("cart.clear_modal.confirm")}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}