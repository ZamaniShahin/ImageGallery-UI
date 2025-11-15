<template>
  <v-container fluid>
    <h2 class="text-h5 mb-4">Manage Images</h2>

    <!-- Category selector -->
    <v-select
      v-model="selectedCategory"
      :items="categories"
      item-title="title"
      item-value="id"
      label="Select Category"
      prepend-inner-icon="mdi-shape"
      class="mb-4"
      @update:model-value="loadImages"
    />

    <!-- Upload form -->
    <v-card class="pa-4 mb-6" elevation="2" v-if="selectedCategory">
      <v-form @submit.prevent="uploadImage">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.description"
              label="Description"
              prepend-inner-icon="mdi-text"
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-file-input
              v-model="form.file"
              label="Select Image"
              prepend-inner-icon="mdi-upload"
              accept="image/*"
              required
            />
          </v-col>
        </v-row>
        <v-btn color="primary" class="mt-2" :loading="uploading" type="submit">
          Upload
        </v-btn>
      </v-form>
    </v-card>

    <!-- Images list -->
    <v-data-table
      :headers="headers"
      :items="images"
      :loading="loading"
      class="elevation-2"
      v-if="selectedCategory"
    >
      <template #item.content="{ item }">
        <v-img
          :src="`data:image/jpeg;base64,${item.content}`"
          width="80"
          height="80"
          cover
          class="rounded-lg"
        />
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ImagesApi } from '@/api/modules/images.api';
import { CategoriesApi } from '@/api/modules/categories.api';

interface Category { id: string; title: string; }
interface ImageItem { id: string; url?: string; description?: string; }

const categories = ref<Category[]>([]);
const selectedCategory = ref<string | null>(null);
const images = ref<ImageItem[]>([]);
const loading = ref(false);
const uploading = ref(false);

const form = ref<{ description: string; file: File | null }>({
  description: '',
  file: null,
});

const headers = [
  { title: 'ID', key: 'id', width: 70 },
  { title: 'Preview', key: 'content', sortable: false },
  { title: 'Description', key: 'description' },
];

// load categories on start
const loadCategories = async () => {
  const res = await CategoriesApi.getAll();
  categories.value = res;
};

// load images for selected category
const loadImages = async () => {
  if (!selectedCategory.value) return;
  loading.value = true;
  try {
    const res = await ImagesApi.list(selectedCategory.value);
    images.value = res;
  } finally {
    loading.value = false;
  }
};

// upload a new image
const uploadImage = async () => {
  if (!selectedCategory.value || !form.value.file) return;
  uploading.value = true;
  try {
    await ImagesApi.create(selectedCategory.value, form.value.file, form.value.description);
    await loadImages();
    form.value = { description: '', file: null };
  } catch (err) {
    console.error('Upload failed:', err);
  } finally {
    uploading.value = false;
  }
};

onMounted(loadCategories);
</script>
