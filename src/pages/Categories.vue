<template>
  <v-container class="py-10">

    <h1 class="text-h4 mb-6">Categories</h1>

    <!-- Loading Indicator -->
    <v-row v-if="loading" justify="center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>

    <!-- Categories Grid -->
    <v-row v-else>
      <v-col
        v-for="cat in categories"
        :key="cat.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="hoverable" @click="goToCategory(cat.id)">
          <v-card-title class="text-h6">{{ cat.title }}</v-card-title>
          <v-card-text>{{ cat.description }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CategoriesApi } from '../api/modules/categories.api';
import { useRouter } from 'vue-router';

const router = useRouter();

const categories = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    // CategoriesApi.getAll() already returns the array (valueOrDefault)
    categories.value = await CategoriesApi.getAll();
  } catch (err) {
    console.error("Failed to load categories", err);
    categories.value = [];
  } finally {
    loading.value = false;
  }
});

function goToCategory(id: string) {
  router.push({ name: 'gallery', query: { categoryId: id } });
}
</script>
