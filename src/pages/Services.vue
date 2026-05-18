<template>
  <v-container class="py-10">
    <h1 class="text-h4 mb-6">{{ t('services.title') }}</h1>

    <v-row v-if="loading" justify="center" class="py-6">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <v-row v-else-if="services.length === 0">
      <v-col cols="12" class="text-center">
        <p>{{ t('services.none') }}</p>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="svc in services" :key="svc.id" cols="12" sm="6" md="4">
        <v-card class="hoverable">
          <v-img v-if="svc.logoUrl" :src="apiOrigin + svc.logoUrl" height="200" cover />
          <v-card-title class="text-h6">{{ svc.title }}</v-card-title>
          <v-card-text>
            <div class="mb-2">{{ svc.description }}</div>
            <strong>{{ t('services.price') }}:</strong> {{ formatPrice(svc.price) }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <AppPagination
      v-if="!loading && total > pageSize"
      :page="page"
      :page-size="pageSize"
      :total="total"
      @update:page="onPageChange"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ServicesApi } from '../api/modules/services.api';
import { apiOrigin } from '../api/http';
import AppPagination from '../components/Pagination.vue';
import type { Service } from '../types/service';

const { t } = useI18n();

const services = ref<Service[]>([]);
const loading = ref(true);
const page = ref(1);
const pageSize = ref(9);
const total = ref(0);

function formatPrice(price: number) {
  return new Intl.NumberFormat('fa-IR').format(price);
}

async function load() {
  loading.value = true;
  try {
    const r = await ServicesApi.list({ pageNumber: page.value, pageSize: pageSize.value });
    services.value = r.items;
    total.value = r.totalCount;
  } catch (err) {
    console.error('Failed to load services', err);
    services.value = [];
  } finally {
    loading.value = false;
  }
}

function onPageChange(p: number) {
  page.value = p;
  load();
}

onMounted(load);
</script>
