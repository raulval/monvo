import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import pt from "./pt.json";
import en from "./en.json";
import es from "./es.json";

const deviceLanguage = Localization.getLocales()[0].languageCode ?? "en";

i18n.use(initReactI18next).init({
  resources: {
    pt: { translation: pt },
    en: { translation: en },
    es: { translation: es },
  },
  lng: ["pt", "en", "es"].includes(deviceLanguage) ? deviceLanguage : "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
