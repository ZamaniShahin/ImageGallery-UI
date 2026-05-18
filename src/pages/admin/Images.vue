<template>
  <v-container fluid>
    <h2 class="text-h5 mb-4">{{ t('admin.manageImages') }}</h2>

    <v-select
      v-model="selectedCategory"
      :items="categories"
      item-title="title"
      item-value="id"
      :label="t('admin.selectCategory')"
      prepend-inner-icon="mdi-shape"
      class="mb-4"
      @update:model-value="onCategoryChange"
    />

    <v-card v-if="selectedCategory" class="pa-4 mb-6" elevation="2">
      <v-form @submit.prevent="uploadImage">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.title"
              :label="t('image.title')"
              prepend-inner-icon="mdi-format-title"
              required
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.description"
              :label="t('image.description')"
              prepend-inner-icon="mdi-text"
              required
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-file-input
              v-model="form.file"
              :label="t('image.selectFile')"
              prepend-inner-icon="mdi-upload"
              accept="image/*"
              required
            />
          </v-col>
        </v-row>
        <v-btn color="primary" class="mt-2" :loading="uploading" type="submit">
          {{ t('common.upload') }}
        </v-btn>
      </v-form>
    </v-card>

    <v-data-table
      v-if="selectedCategory"
      :headers="headers"
      :items="images"
      :loading="loading"
      :items-per-page="-1"
      class="elevation-2"
      hide-default-footer
    >
      <template #item.preview="{ item }">
        <v-img :src="apiOrigin + item.url" width="80" height="80" cover class="rounded-lg" />
      </template>

      <template #item.actions="{ item }">
        <v-btn icon="mdi-pencil" variant="text" color="blue" @click="openEdit(item)" />
        <v-btn icon="mdi-delete" variant="text" color="red" @click="deleteImage(item.id)" />
      </template>
    </v-data-table>

    <AppPagination
      v-if="selectedCategory && !loading && total > pageSize"
      :page="page"
      :page-size="pageSize"
      :total="total"
      @update:page="onPageChange"
    />

    <v-dialog v-model="editDialog" max-width="520">
      <v-card>
        <v-card-title class="text-h6 pa-4">{{ t('common.edit') }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="editForm.title" :label="t('image.title')" autofocus />
          <v-text-field v-model="editForm.description" :label="t('image.description')" />
          <v-file-input v-model="editForm.file" :label="t('image.selectFile')" accept="image/*" clearable />
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="editDialog = false">{{ t('common.cancel') }}</v-btn>
          <v-btn color="primary" :loading="saving" @click="saveEdit">{{ t('common.save') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ImagesApi } from '../../api/modules/images.api';
import { CategoriesApi } from '../../api/modules/categories.api';
import { apiOrigin } from '../../api/http';
import AppPagination from '../../components/Pagination.vue';
import type { ImageItem } from '../../types/image';
import type { Category } from '../../types/category';

const { t } = useI18n();
const categories = ref<Category[]>([]);
const selectedCategory = ref<string | null>(null);
const images = ref<ImageItem[]>([]);
const loading = ref(false);
const uploading = ref(false);
const saving = ref(false);

const page = ref(1);
const pageSize = ref(10);
const total = ref(0);

const form = ref<{ title: string; description: string; file: File | null }>({
  title: '',
  description: '',
  file: null,
});

const editDialog = ref(false);
const editForm = ref<{ id: string; title: string; description: string; file: File | null }>({
  id: '',
  title: '',
  description: '',
  file: null,
});

const headers = computed(() => [
  { title: t('image.preview'), key: 'preview', sortable: false },
  { title: t('image.title'), key: 'title' },
  { title: t('image.description'), key: 'description' },
  { title: t('common.actions'), key: 'actions', sortable: false },
]);

async function loadCategories() {
  categories.value = await CategoriesApi.listAll();
}

async function loadImages() {
  if (!selectedCategory.value) return;
  loading.value = true;
  try {
    const r = await ImagesApi.listByCategory(selectedCategory.value, {
      pageNumber: page.value,
      pageSize: pageSize.value,
    });
    images.value = r.items;
    total.value = r.totalCount;
  } finally {
    loading.value = false;
  }
}

function onCategoryChange() {
  page.value = 1;
  loadImages();
}

function onPageChange(p: number) {
  page.value = p;
  loadImages();
}

async function uploadImage() {
  if (!selectedCategory.value || !form.value.file) return;
  uploading.value = true;
  try {
    await ImagesApi.create(selectedCategory.value, form.value.file, form.value.title, form.value.description);
    await loadImages();
    form.value = { title: '', description: '', file: null };
  } catch (err) {
    console.error('Upload failed:', err);
  } finally {
    uploading.value = false;
  }
}

function openEdit(item: ImageItem) {
  editForm.value = {
    id: item.id,
    title: item.title ?? '',
    description: item.description ?? '',
    file: null,
  };
  editDialog.value = true;
}

async function saveEdit() {
  saving.value = true;
  try {
    await ImagesApi.update(editForm.value.id, editForm.value.title, editForm.value.description, editForm.value.file);
    editDialog.value = false;
    await loadImages();
  } catch (err) {
    console.error('Update failed:', err);
  } finally {
    saving.value = false;
  }
}

async function deleteImage(id: string) {
  if (!confirm(t('common.confirmDelete'))) return;
  try {
    await ImagesApi.delete(id);
    await loadImages();
  } catch (err) {
    console.error('Delete failed:', err);
  }
}

onMounted(loadCategories);
</script>
