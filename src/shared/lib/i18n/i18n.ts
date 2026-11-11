import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import enLanguage from "./locales/en.json"
import esLanguage from "./locales/es.json"
import ptLanguage from "./locales/pt.json"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "es", "pt"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    resources: {
      en: { translation: enLanguage },
      es: { translation: esLanguage },
      pt: { translation: ptLanguage },
    },
  })

export default i18n
