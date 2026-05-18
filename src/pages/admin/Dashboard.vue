<template>
  <v-container fluid>
    <h2 class="text-h5 mb-6">{{ t('admin.dashboard') }}</h2>

    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4 text-center" elevation="2">
          <v-icon size="40" color="primary" class="mb-2">mdi-shape</v-icon>
          <div class="text-h4 font-weight-bold">{{ stats.categories }}</div>
          <div class="text-body-2 mt-1">{{ t('admin.statCategories') }}</div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4 text-center" elevation="2">
          <v-icon size="40" color="primary" class="mb-2">mdi-hammer-wrench</v-icon>
          <div class="text-h4 font-weight-bold">{{ stats.services }}</div>
          <div class="text-body-2 mt-1">{{ t('admin.statServices') }}</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { CategoriesApi } from '../../api/modules/categories.api';
import { ServicesApi } from '../../api/modules/services.api';

const { t } = useI18n();
const stats = ref({ categories: 0, services: 0 });

onMounted(async () => {
  const [cats, svcs] = await Promise.allSettled([
    CategoriesApi.list({ pageNumber: 1, pageSize: 1 }),
    ServicesApi.list({ pageNumber: 1, pageSize: 1 }),
  ]);
  if (cats.status === 'fulfilled') stats.value.categories = cats.value.totalCount;
  if (svcs.status === 'fulfilled') stats.value.services = svcs.value.totalCount;
});
</script>
