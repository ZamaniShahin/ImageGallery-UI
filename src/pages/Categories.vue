<template>
  <v-container class="py-10">
    <h1 class="text-h4 mb-6">{{ t('categories.title') }}</h1>

    <v-row v-if="loading" justify="center" class="py-6">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <v-row v-else-if="categories.length === 0">
      <v-col cols="12" class="text-center">
        <p>{{ t('common.noResults') }}</p>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="cat in categories" :key="cat.id" cols="12" sm="6" md="4">
        <v-card class="hoverable" @click="goToCategory(cat.id)">
          <v-card-title class="text-h6">{{ cat.title }}</v-card-title>
          <v-card-text>{{ cat.description }}</v-card-text>
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
import { CategoriesApi } from '../api/modules/categories.api';
import { useRouter } from 'vue-router';
import AppPagination from '../components/Pagination.vue';
import type { Category } from '../types/category';

const { t } = useI18n();
const router = useRouter();

const categories = ref<Category[]>([]);
const loading = ref(true);
const page = ref(1);
const pageSize = ref(9);
const total = ref(0);

async function load() {
  loading.value = true;
  try {
    const r = await CategoriesApi.list({ pageNumber: page.value, pageSize: pageSize.value });
    categories.value = r.items;
    total.value = r.totalCount;
  } catch (err) {
    console.error('Failed to load categories', err);
    categories.value = [];
  } finally {
    loading.value = false;
  }
}

function onPageChange(p: number) {
  page.value = p;
  load();
}

function goToCategory(id: string) {
  router.push({ name: 'gallery', query: { categoryId: id } });
}

onMounted(load);
</script>
