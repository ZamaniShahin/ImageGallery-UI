<template>
  <v-container fluid>
    <h2 class="text-h5 mb-4">Manage Categories</h2>

    <!-- Add/Edit Form -->
    <v-card class="pa-4 mb-6" elevation="2">
      <v-form @submit.prevent="saveCategory">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.title"
              label="Category Title"
              prepend-inner-icon="mdi-shape"
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.description"
              label="Description"
              prepend-inner-icon="mdi-text"
            />
          </v-col>
          <v-col cols="12" md="2" class="d-flex align-center">
            <v-btn
              color="primary"
              :loading="saving"
              type="submit"
              block
            >
              {{ form.id ? 'Update' : 'Add' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <!-- Category Table -->
    <v-data-table
      :headers="headers"
      :items="categories"
      :loading="loading"
      class="elevation-2"
      density="comfortable"
    >
      <template #item.actions="{ item }">
        <v-btn
          icon="mdi-pencil"
          variant="text"
          color="blue"
          @click="editCategory(item)"
        />
        <v-btn
          icon="mdi-delete"
          variant="text"
          color="red"
          @click="deleteCategory(item.id)"
        />
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CategoriesApi } from '../../api/modules/categories.api';

interface Category {
  id?: number;
  title: string;
  description?: string;
}

const categories = ref<Category[]>([]);
const loading = ref(false);
const saving = ref(false);
const form = ref<Category>({ title: '', description: '' });

const headers = [
  { title: 'ID', key: 'id', width: 70 },
  { title: 'Title', key: 'title' },
  { title: 'Description', key: 'description' },
  { title: 'Actions', key: 'actions', sortable: false },
];

// Load categories
const loadCategories = async () => {
  loading.value = true;
  try {
    const res = await CategoriesApi.getAll();
    categories.value = Array.isArray(res) ? res : res.items || [];
  } finally {
    loading.value = false;
  }
};

// Save category
const saveCategory = async () => {
  if (!form.value.title.trim()) return;
  saving.value = true;
  try {
    if (form.value.id) {
      await CategoriesApi.update(form.value.id, form.value);
    } else {
      await CategoriesApi.add(form.value);
    }
    form.value = { title: '', description: '' };
    await loadCategories();
  } catch (e) {
    console.error('Save failed:', e);
  } finally {
    saving.value = false;
  }
};

// Edit existing category
const editCategory = (item: Category) => {
  form.value = { ...item };
};

// Delete
const deleteCategory = async (id: number) => {
  if (!confirm('Delete this category?')) return;
  try {
    await CategoriesApi.remove(id);
    await loadCategories();
  } catch (e) {
    console.error('Delete failed:', e);
  }
};

onMounted(loadCategories);
</script>
