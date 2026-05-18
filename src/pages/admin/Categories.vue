<template>
  <v-container fluid>
    <h2 class="text-h5 mb-4">{{ t('admin.manageCategories') }}</h2>

    <v-card class="pa-4 mb-6" elevation="2">
      <v-form @submit.prevent="saveCategory">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.title"
              :label="t('categories.titleField')"
              prepend-inner-icon="mdi-shape"
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.description"
              :label="t('categories.descriptionField')"
              prepend-inner-icon="mdi-text"
            />
          </v-col>
          <v-col cols="12" md="2" class="d-flex align-center">
            <v-btn color="primary" :loading="saving" type="submit" block>
              {{ form.id ? t('common.update') : t('common.add') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <v-data-table
      :headers="headers"
      :items="categories"
      :loading="loading"
      :items-per-page="-1"
      class="elevation-2"
      density="comfortable"
      hide-default-footer
    >
      <template #item.actions="{ item }">
        <v-btn icon="mdi-pencil" variant="text" color="blue" @click="editCategory(item)" />
        <v-btn icon="mdi-delete" variant="text" color="red" @click="deleteCategory(item.id!)" />
      </template>
    </v-data-table>

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
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { CategoriesApi } from '../../api/modules/categories.api';
import AppPagination from '../../components/Pagination.vue';

interface CategoryForm {
  id?: string;
  title: string;
  description: string;
}

const { t } = useI18n();
const categories = ref<CategoryForm[]>([]);
const loading = ref(false);
const saving = ref(false);
const form = ref<CategoryForm>({ title: '', description: '' });

const page = ref(1);
const pageSize = ref(10);
const total = ref(0);

const headers = computed(() => [
  { title: t('image.title'), key: 'title' },
  { title: t('image.description'), key: 'description' },
  { title: t('common.actions'), key: 'actions', sortable: false },
]);

async function loadCategories() {
  loading.value = true;
  try {
    const r = await CategoriesApi.list({ pageNumber: page.value, pageSize: pageSize.value });
    categories.value = r.items;
    total.value = r.totalCount;
  } finally {
    loading.value = false;
  }
}

function onPageChange(p: number) {
  page.value = p;
  loadCategories();
}

async function saveCategory() {
  if (!form.value.title.trim()) return;
  saving.value = true;
  try {
    const payload = { title: form.value.title, description: form.value.description ?? '' };
    if (form.value.id) {
      await CategoriesApi.update(form.value.id, payload);
    } else {
      await CategoriesApi.add(payload);
    }
    form.value = { title: '', description: '' };
    await loadCategories();
  } catch (e) {
    console.error('Save failed:', e);
  } finally {
    saving.value = false;
  }
}

function editCategory(item: CategoryForm) {
  form.value = { ...item };
}

async function deleteCategory(id: string) {
  if (!confirm(t('categories.confirmDelete'))) return;
  try {
    await CategoriesApi.remove(id);
    await loadCategories();
  } catch (e) {
    console.error('Delete failed:', e);
  }
}

onMounted(loadCategories);
</script>
