import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, Loader2, Clock3, Headphones } from "lucide-react";

export default function ContactUs() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error(t("contact.errorEmpty", "يرجى ملء الحقول المطلوبة بنجاح"));
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(t("contact.successMsg", "تم استلام رسالتك بنجاح! فريق الدعم سيتواصل معك خلال دقائق."));
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 1200);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-8 py-14 space-y-12 animate-in fade-in duration-700">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[3rem] border border-primary/30 bg-linear-to-r from-primary/15 via-card to-card p-10 sm:p-14 shadow-2xl backdrop-blur-3xl text-center space-y-4">
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-black shadow-inner">
          <Headphones className="w-4 h-4" />
          <span>{t("contact.badge", "خدمة العملاء في خدمتك 24/7")}</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
          {t("contact.title", "يسعدنا دائماً سماع صوتك")}
        </h1>
        
        <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-xl mx-auto">
          {t("contact.subtitle", "لديك اقتراح، مشكلة في طلب، أو ترغب في الاستفسار عن المنيو؟ تواصل معنا فوراً.")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Info Cards (Left Side) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="p-6 sm:p-8 rounded-[2rem] bg-card border border-border/80 shadow-xl space-y-4 hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground">{t("contact.phoneTitle", "الخط الساخن")}</h3>
              <p className="text-lg text-muted-foreground font-medium mt-1" dir="ltr">19999</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-[2rem] bg-card border border-border/80 shadow-xl space-y-4 hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground">{t("contact.emailTitle", "البريد الإلكتروني")}</h3>
              <p className="text-lg text-muted-foreground font-medium mt-1">support@aklny.com</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-[2rem] bg-card border border-border/80 shadow-xl space-y-4 hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground">{t("contact.addressTitle", "المقر الرئيسي")}</h3>
              <p className="text-lg text-muted-foreground font-medium mt-1">{t("contact.addressVal", "القاهرة، جمهورية مصر العربية")}</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-[2rem] bg-primary/5 border border-primary/20 shadow-lg space-y-2">
            <div className="flex items-center gap-2 text-primary font-black text-sm">
              <Clock3 className="w-4 h-4" />
              <span className="text-lg">{t("contact.workHoursTitle", "ساعات العمل")}</span>
            </div>
            <p className="text-lg text-muted-foreground font-medium">
              {t("contact.workHoursVal", "طوال أيام الأسبوع: من 10:00 صباحاً حتى 3:00 فجراً")}
            </p>
          </div>

        </div>

        {/* Contact Form (Right Side - Wider) */}
        <div className="lg:col-span-8 bg-card/70 p-8 sm:p-12 rounded-[2.5rem] border border-border/80 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold  text-foreground">{t("contact.nameLabel", "الاسم بالكامل")}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t("contact.namePlaceholder", "أدخل اسمك الكريم...")}
                  className="w-full mt-1 px-5 py-4 rounded-2xl bg-muted/40 border border-border/60 text-foreground text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">{t("contact.phoneLabel", "رقم الهاتف")}</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t("contact.phonePlaceholder", "010xxxxxxxx")}
                  className="w-full mt-1 px-5 py-4 rounded-2xl bg-muted/40 border border-border/60 text-foreground text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">{t("contact.emailLabel", "البريد الإلكتروني")}</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t("contact.emailPlaceholder", "name@example.com")}
                className="w-full mt-1 px-5 py-4 rounded-2xl bg-muted/40 border border-border/60 text-foreground text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">{t("contact.messageLabel", "نص الرسالة أو الاستفسار")}</label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={t("contact.messagePlaceholder", "اكتب تفاصيل رسالتك هنا وسنقوم بالرد في أسرع وقت...")}
                className="w-full mt-1 px-5 py-4 rounded-2xl bg-muted/40 border border-border/60 text-foreground text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-primary/25 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span>{loading ? t("contact.sending", "جاري إرسال رسالتك...") : t("contact.sendBtn", "إرسال الرسالة الآن")}</span>
            </button>

          </form>
        </div>

      </div>
    </main>
  );
}