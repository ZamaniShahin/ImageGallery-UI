<template>
  <v-container class="py-10">
    <h1 class="text-h4 mb-4">
      {{ categoryName ? t('gallery.titleWithCategory', { name: categoryName }) : t('gallery.title') }}
    </h1>

    <v-text-field
      v-model="searchInput"
      :placeholder="t('gallery.searchPlaceholder')"
      prepend-inner-icon="mdi-magnify"
      clearable
      density="comfortable"
      hide-details
      class="mb-6"
      @update:model-value="onSearchInput"
    />

    <v-row v-if="loading" justify="center" class="py-6">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <v-row v-else-if="images.length === 0">
      <v-col cols="12" class="text-center">
        <p v-if="!categoryId">{{ t('gallery.selectCategoryFirst') }}</p>
        <p v-else>{{ t('gallery.noImages') }}</p>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="img in images" :key="img.id" cols="12" sm="6" md="4">
        <v-card class="hoverable" @click="router.push({ name: 'image.details', params: { id: img.id } })">
          <v-img :src="apiOrigin + img.url" height="260" cover />
          <v-card-title class="text-subtitle-1">{{ img.title }}</v-card-title>
          <v-card-text>{{ img.description }}</v-card-text>
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
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
import { ImagesApi } from "../api/modules/images.api";
import { apiOrigin } from '../api/http';
import AppPagination from '../components/Pagination.vue';
import type { ImageItem } from '../types/image';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const images = ref<ImageItem[]>([]);
const loading = ref(true);
const categoryName = ref("");
const categoryId = ref<string>("");

const page = ref(1);
const pageSize = ref(9);
const total = ref(0);
const search = ref<string>("");
const searchInput = ref<string>("");

let debounceTimer: number | null = null;

async function load() {
  if (!categoryId.value) {
    images.value = [];
    total.value = 0;
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    const r = await ImagesApi.listByCategory(categoryId.value, {
      pageNumber: page.value,
      pageSize: pageSize.value,
      search: search.value,
    });
    images.value = r.items;
    total.value = r.totalCount;
  } catch (err) {
    console.error('Failed to load images', err);
    images.value = [];
  } finally {
    loading.value = false;
  }
}

function onSearchInput(v: string | null) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(() => {
    search.value = (v ?? '').trim();
    page.value = 1;
    load();
  }, 300);
}

function onPageChange(p: number) {
  page.value = p;
  load();
}

watch(() => route.query.categoryId, (id) => {
  categoryId.value = (id as string) ?? '';
  page.value = 1;
  load();
});

onMounted(() => {
  categoryId.value = (route.query.categoryId as string) ?? '';
  categoryName.value = Array.isArray(route.query.categoryName)
    ? (route.query.categoryName[0] ?? "")
    : (route.query.categoryName ?? "");
  load();
});
</script>
