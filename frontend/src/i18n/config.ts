import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './/en.json';
import translationAR from './/ar.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      ar: { translation: translationAR }
    },
    lng: 'ar', // اللغة الافتراضية
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });
  i18n.on("languageChanged", (lng) => {
  const dir = i18n.dir(lng);
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
});

export default i18n;