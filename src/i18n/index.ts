import { createI18n } from 'vue-i18n';
import fa from './fa';
import en from './en';

export default createI18n({
  legacy: false,
  locale: import.meta.env.VITE_LOCALE_DEFAULT || 'fa',
  fallbackLocale: 'en',
  messages: { fa, en },
});