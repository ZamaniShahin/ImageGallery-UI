import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { vuetify } from "./plugins/vuetify";
import i18n from "./i18n";
import "@/styles/main.css";
import { initializeKeycloak } from './plugins/keycloak';

async function bootstrap() {
  await initializeKeycloak();

  const app = createApp(App);

  app.use(createPinia());
  app.use(router);
  app.use(vuetify);
  app.use(i18n);

  app.mount("#app");
}

bootstrap();
