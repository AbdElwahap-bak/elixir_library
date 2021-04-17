import i18n  from "i18next";
import en from "./en";
import ar from "./ar";
import store from "../redux";

const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

i18n.init({
  resources,
  lng: "ar",
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

export const getTranslation = (label, isRTL = store.getState().general.isRTL, options = {}) => {
  return i18n.t(label, { lng: isRTL ? "ar" : "en", ...options });
};

export default i18n;
