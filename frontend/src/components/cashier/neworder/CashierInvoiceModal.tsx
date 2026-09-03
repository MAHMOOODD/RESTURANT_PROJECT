// src/components/cashier/CashierInvoiceModal.tsx
import { X, Printer } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CartLine } from "./CashierCartPanel";

export interface InvoiceData {
  orderNumber?: string | number;
  createdAt: string;
  customerName: string;
  items: CartLine[];
  subtotal: number;
  discount: number;
  total: number;
  amountPaid: number;
  change: number;
}

interface Props {
  data: InvoiceData;
  onClose: () => void;
}

export function CashierInvoiceModal({ data, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");
  const currency = t("cashierPos.currency");
  const formattedDate = new Date(data.createdAt).toLocaleString(isArabic ? "ar-EG" : "en-US");

  const handlePrintAndClose = () => {
    window.print();
    onClose();
  };

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-print-area, #invoice-print-area * { visibility: visible; }
          #invoice-print-area {
            position: fixed;
            inset: 0;
            width: 80mm;
            margin: 0 auto;
            font-family: monospace;
          }
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
            <h2 className="font-black text-base">{t("cashierPos.invoice.title")}</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-secondary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-4 pt-3 text-xs text-muted-foreground flex flex-col gap-0.5 shrink-0">
            {data.orderNumber != null && (
              <div className="flex justify-between">
                <span>{t("cashierPos.invoice.orderNumber")}</span>
                <span className="font-bold text-foreground">#{data.orderNumber}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>{t("cashierPos.invoice.date")}</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("cashierPos.invoice.customer")}</span>
              <span className="font-bold text-foreground">{data.customerName}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
            <div className="flex text-[11px] font-bold text-muted-foreground border-b border-border/60 pb-1.5 mb-1.5">
              <span className="flex-1">{t("cashierPos.invoice.itemCol")}</span>
              <span className="w-10 text-center">{t("cashierPos.invoice.qtyCol")}</span>
              <span className="w-16 text-end">{t("cashierPos.invoice.totalCol")}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {data.items.map((item) => (
                <div key={item.productId} className="flex items-center text-xs">
                  <span className="flex-1 truncate pe-2">{item.name}</span>
                  <span className="w-10 text-center text-muted-foreground">{item.quantity}</span>
                  <span className="w-16 text-end font-bold">
                    {(item.price * item.quantity).toLocaleString()} {currency}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-border shrink-0 flex flex-col gap-1 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>{t("cashierPos.cart.subtotal")}</span>
              <span>{data.subtotal.toLocaleString()} {currency}</span>
            </div>
            {data.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>{t("cashierPos.cart.discount")}</span>
                <span>- {data.discount.toLocaleString()} {currency}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-foreground pt-1 border-t border-border/60">
              <span>{t("cashierPos.cart.finalTotal")}</span>
              <span>{data.total.toLocaleString()} {currency}</span>
            </div>
            <div className="flex justify-between text-muted-foreground pt-1">
              <span>{t("cashierPos.cart.amountPaidLabel")}</span>
              <span>{data.amountPaid.toLocaleString()} {currency}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>{t("cashierPos.cart.changeDue")}</span>
              <span>{data.change.toLocaleString()} {currency}</span>
            </div>

            <button
              type="button"
              onClick={handlePrintAndClose}
              className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-md shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <Printer className="w-4 h-4" />
              {t("cashierPos.invoice.printBtn")}
            </button>
          </div>
        </div>
      </div>

      <div id="invoice-print-area" className="hidden print:block text-black text-xs p-2">
        <div className="text-center font-bold mb-2">{t("cashierPos.invoice.title")}</div>
        {data.orderNumber   != null && (
          <div className="flex justify-between">
            <span>{t("cashierPos.invoice.orderNumber")}</span>
            <span>#{data.orderNumber}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>{t("cashierPos.invoice.date")}</span>
          <span>{formattedDate}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>{t("cashierPos.invoice.customer")}</span>
          <span>{data.customerName}</span>
        </div>
        <div className="border-t border-dashed border-black my-1" />
        {data.items.map((item) => (
          <div key={item.productId} className="flex justify-between">
            <span>{isArabic ? item.nameAr : item.name} x{item.quantity}</span>
            <span>{(item.price * item.quantity).toLocaleString()} {currency}</span>
          </div>
        ))}
        <div className="border-t border-dashed border-black my-1" />
        <div className="flex justify-between">
          <span>{t("cashierPos.cart.subtotal")}</span>
          <span>{data.subtotal.toLocaleString()} {currency}</span>
        </div>
        {data.discount > 0 && (
          <div className="flex justify-between">
            <span>{t("cashierPos.cart.discount")}</span>
            <span>- {data.discount.toLocaleString()} {currency}</span>
          </div>
        )}
        <div className="flex justify-between font-bold">
          <span>{t("cashierPos.cart.finalTotal")}</span>
          <span>{data.total.toLocaleString()} {currency}</span>
        </div>
        <div className="flex justify-between">
          <span>{t("cashierPos.cart.amountPaidLabel")}</span>
          <span>{data.amountPaid.toLocaleString()} {currency}</span>
        </div>
        <div className="flex justify-between">
          <span>{t("cashierPos.cart.changeDue")}</span>
          <span>{data.change.toLocaleString()} {currency}</span>
        </div>
      </div>
    </>
  );
}