import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { fa as faVuetify, en as enVuetify } from 'vuetify/locale';

export const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: { defaultTheme: 'light' },
  locale: {
    locale: 'fa',
    fallback: 'en',
    rtl: { fa: true, en: false },
    messages: { fa: faVuetify, en: enVuetify },
  },
});
