import { useTranslation } from "react-i18next";
import { Utensils, HeartHandshake, ShieldCheck, Sparkles, Award, ChefHat, Flame, Trophy, Users, Clock } from "lucide-react";
import vignettes from "@/assets/vegetarian.png";

export default function AboutUs() {
  const { t } = useTranslation();

  const stats = [
    { icon: Utensils, value: "+500", label: t("about.statsMeals", "وجبة متنوعة") },
    { icon: Users, value: "+15K", label: t("about.statsClients", "عميل سعيد") },
    { icon: ChefHat, value: "+25", label: t("about.statsChefs", "شيف محترف") },
    { icon: Trophy, value: "100%", label: t("about.statsQuality", "جودة أصلية") },
  ];

  const features = [
    {
      icon: Flame,
      title: t("about.feature1Title", "طازج وساخن على اصول أصوله"),
      desc: t("about.feature1Desc", "لا نعتمد على التبريد؛ كل طبق يتم تحضيره خصيصاً فور طلبك لتستمتع بالطعم الطازج والغني."),
      badge: t("about.badgeFresh", "طازج يومياً"),
    },
    {
      icon: ShieldCheck,
      title: t("about.feature2Title", "معايير سلامة عالمية"),
      desc: t("about.feature2Desc", "نطبق أقوى شروط النظافة والتعقيم في مطابخنا لضمان غذاء صحي وآمن تماماً لك ولعائلتك."),
      badge: t("about.badgeSafe", "صحي وآمن"),
    },
    {
      icon: Clock,
      title: t("about.feature3Title", "توصيل كالبرق"),
      desc: t("about.feature3Desc", "أسطول توصيل مجهز بأحدث صناديق حفظ الحرارة ليصلك الأكل طازج كأنه لسه طالع من النار."),
      badge: t("about.badgeFast", "سرعة فائقة"),
    },
    {
      icon: Award,
      title: t("about.feature4Title", "وصفات حصرية ومبتكرة"),
      desc: t("about.feature4Desc", "خلطة سرية وأسرار طهي ورثناها طورت بروح عصرية لتناسب أصحاب الذوق الرفيع."),
      badge: t("about.badgeUnique", "طعم فريد"),
    },
  ];

  return (
    <main 
      className="max-w-6xl mx-auto px-4 sm:px-8 py-14 space-y-20 animate-in fade-in duration-700"
    >
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[3rem] border border-primary/30 bg-linear-to-br from-primary/15 via-card/80 to-card p-10 sm:p-16 shadow-2xl backdrop-blur-3xl text-center space-y-6">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-black shadow-inner">
          <Sparkles className="w-4 h-4" />
          <span>{t("about.badge", "اكتشف قصة أكلني")}</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight max-w-4xl mx-auto leading-[1.3]">
          {t("about.title", "حيث يلتقي")} <span className="text-primary underline decoration-primary/40 underline-offset-8">{t("about.titleHighlight", "الشغف")}</span> {t("about.titleEnd", "بألذ الأكلات")}
        </h1>
        
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
          {t("about.subtitle", "لم نبدأ كمجرد مطعم توصيل، بل فكرة وُلدت لتقدم مفهوماً جديداً لمتعة الطعام: سرعة، نظافة، طعم لا يُمحى من الذاكرة.")}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-border/60 max-w-4xl mx-auto">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-card/50 border border-border/60 backdrop-blur-md space-y-1">
                <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-black text-foreground">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-bold">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Story Vision Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 bg-card/70 p-8 sm:p-12 rounded-[2.5rem] border border-border/80 shadow-xl backdrop-blur-xl space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-snug">
            {t("about.storyTitle", "فلسفتنا في أكلني: الجودة أولاً")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
            {t("about.storyP1", "نؤمن تماماً أن الأكل الجيد يصنع يوماً سعيداً. من اللحظة التي تختار فيها وجبتك من المنيو، وحتى وصولها إلى باب بيتك، نضمن لك مراقبة دقيقة لكل تفصيلة.")}
          </p>
          <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
            {t("about.storyP2", "نختار موردينا بعناية فائقة، وندير مطابخنا بأيدي طهاة محترفين يعشقون فن الطهي، لنضع بين يديك وجبة تتحدث عن نفسها من أول لقمه.")}
          </p>
        </div>

        {/* Improved Image Container */}
        <div className="lg:col-span-5 relative h-80 sm:h-[420px] rounded-[2.5rem] overflow-hidden border border-primary/30 shadow-2xl bg-linear-to-tr from-primary/20 via-card to-muted flex items-center justify-center group p-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-70" />
          
          <div className="text-center space-y-4 relative z-10 w-full flex flex-col items-center">
            {/* Logo / Image Box Styled Properly */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-rose-500 to-amber-500 border border-primary/30 shadow-2xl flex items-center justify-center mx-auto overflow-hidden group-hover:scale-105 transition-transform duration-300 p-3">
              <img 
                src={vignettes} 
                alt="AKLNY Vignettes" 
                className="w-full h-full object-contain drop-shadow-md" 
              />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-foreground">{t("about.kitchenTitle", "AKLNY Kitchens")}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-xs mx-auto">
              {t("about.kitchenSub", "حيث تمتزج المكونات الطازجة بالحب لتصنع أشهى الوجبات")}
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">{t("about.whyUs", "لماذا يختارنا الآلاف يومياً؟")}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">{t("about.whyUsSub", "مزايا تجعلنا خيارك الأول دائماً عندما تحس بالجوع")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="group relative p-8 rounded-[2rem] bg-card border border-border/80 shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all duration-300 flex flex-col justify-between space-y-6">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black mb-4 border border-primary/20">
                    {item.badge}
                  </span>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 mb-4">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-foreground mb-2 leading-snug">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}