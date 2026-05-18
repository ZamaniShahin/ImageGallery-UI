<template>
  <v-container class="py-12 text-center">
    <h1 class="text-h3 font-weight-bold mb-4">{{ t('home.title') }}</h1>
    <p class="text-h6 text-medium-emphasis mx-auto" style="max-width: 720px">
      {{ t('home.subtitle') }}
    </p>

    <div class="d-flex justify-center ga-3 mt-8 flex-wrap">
      <v-btn color="primary" size="large" :to="{ name: 'categories' }" prepend-icon="mdi-shape">
        {{ t('nav.categories') }}
      </v-btn>
      <v-btn variant="outlined" size="large" :to="{ name: 'services' }" prepend-icon="mdi-hammer-wrench">
        {{ t('nav.services') }}
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>
