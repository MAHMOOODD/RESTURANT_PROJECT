import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 p-3 rounded-2xl bg-card border border-border text-foreground hover:text-primary hover:border-primary/50 hover:bg-secondary/80 shadow-lg shadow-black/40 backdrop-blur-xl transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center outline-none group animate-in fade-in zoom-in-95"
    >
      <ArrowUp className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
    </button>
  );
}