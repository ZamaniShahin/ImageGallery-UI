<template>
  <v-app>
    <v-app-bar flat color="primary" density="compact">
      <v-app-bar-title>{{ t('nav.admin') }} • {{ t('app.title') }}</v-app-bar-title>
      <v-spacer />
      <v-btn variant="text" :to="{ name: 'home' }" prepend-icon="mdi-arrow-left">
        {{ t('common.back') }}
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer permanent location="right">
      <v-list density="compact">
        <v-list-item :to="{ name: 'admin.dashboard' }" :title="t('admin.dashboard')" prepend-icon="mdi-view-dashboard" />
        <v-list-item :to="{ name: 'admin.images' }" :title="t('admin.images')" prepend-icon="mdi-image-multiple" />
        <v-list-item :to="{ name: 'admin.categories' }" :title="t('admin.categories')" prepend-icon="mdi-shape" />
        <v-list-item :to="{ name: 'admin.services' }" :title="t('admin.services')" prepend-icon="mdi-hammer-wrench" />
        <v-list-item :to="{ name: 'admin.comments' }" :title="t('admin.comments')" prepend-icon="mdi-comment" />
        <v-list-item :to="{ name: 'admin.about' }" :title="t('admin.about')" prepend-icon="mdi-information" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <div class="container">
        <AppBreadcrumbs />
        <router-view />
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppBreadcrumbs from '../components/AppBreadcrumbs.vue';
const { t } = useI18n();
</script>
