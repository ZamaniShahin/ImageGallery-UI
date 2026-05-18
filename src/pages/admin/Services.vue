<template>
  <v-container fluid>
    <h2 class="text-h5 mb-4">{{ t('admin.manageServices') }}</h2>

    <v-card class="pa-4 mb-6" elevation="2">
      <v-form @submit.prevent="saveService">
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="form.title"
              :label="t('services.titleField')"
              prepend-inner-icon="mdi-briefcase"
              required
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model.number="form.price"
              :label="t('services.price')"
              type="number"
              prepend-inner-icon="mdi-currency-usd"
              required
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="form.description"
              :label="t('image.description')"
              prepend-inner-icon="mdi-text"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-file-input
              v-model="form.file"
              :label="t('services.logo')"
              prepend-inner-icon="mdi-upload"
              accept="image/*"
            />
          </v-col>
        </v-row>

        <v-btn color="primary" :loading="saving" type="submit">
          {{ form.id ? t('common.update') : t('common.add') }}
        </v-btn>
      </v-form>
    </v-card>

    <v-data-table
      :headers="headers"
      :items="services"
      :loading="loading"
      :items-per-page="-1"
      class="elevation-2"
      density="comfortable"
      hide-default-footer
    >
      <template #item.logo="{ item }">
        <v-img :src="apiOrigin + item.logoUrl" width="60" height="60" cover class="rounded" />
      </template>

      <template #item.actions="{ item }">
        <v-btn icon="mdi-pencil" variant="text" color="blue" @click="editService(item)" />
        <v-btn icon="mdi-delete" variant="text" color="red" @click="deleteService(item.id!)" />
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
import { ServicesApi } from '../../api/modules/services.api';
import { apiOrigin } from '../../api/http';
import AppPagination from '../../components/Pagination.vue';

interface ServiceForm {
  id?: string;
  title: string;
  description: string;
  price: number;
  logoUrl?: string;
  file?: File | null;
}

const { t } = useI18n();
const services = ref<ServiceForm[]>([]);
const loading = ref(false);
const saving = ref(false);

const page = ref(1);
const pageSize = ref(10);
const total = ref(0);

const form = ref<ServiceForm>({
  title: '',
  description: '',
  price: 0,
  file: null,
});

const headers = computed(() => [
  { title: t('services.logo'), key: 'logo', sortable: false },
  { title: t('image.title'), key: 'title' },
  { title: t('services.price'), key: 'price' },
  { title: t('image.description'), key: 'description' },
  { title: t('common.actions'), key: 'actions', sortable: false },
]);

async function loadServices() {
  loading.value = true;
  try {
    const r = await ServicesApi.list({ pageNumber: page.value, pageSize: pageSize.value });
    services.value = r.items;
    total.value = r.totalCount;
  } finally {
    loading.value = false;
  }
}

function onPageChange(p: number) {
  page.value = p;
  loadServices();
}

async function saveService() {
  if (!form.value.title.trim()) return;
  saving.value = true;
  try {
    if (form.value.id) {
      await ServicesApi.update(form.value.id, {
        title: form.value.title,
        description: form.value.description ?? '',
        price: form.value.price,
        file: form.value.file ?? null,
      });
    } else {
      if (!form.value.file) {
        alert(t('errors.generic'));
        return;
      }
      await ServicesApi.add({
        title: form.value.title,
        description: form.value.description ?? '',
        price: form.value.price,
        file: form.value.file,
      });
    }
    form.value = { title: '', description: '', price: 0, file: null };
    await loadServices();
  } catch (e) {
    console.error('Save failed:', e);
  } finally {
    saving.value = false;
  }
}

function editService(item: ServiceForm) {
  form.value = { ...item, file: null };
}

async function deleteService(id: string) {
  if (!confirm(t('services.confirmDelete'))) return;
  try {
    await ServicesApi.remove(id);
    await loadServices();
  } catch (e) {
    console.error('Delete failed:', e);
  }
}

onMounted(loadServices);
</script>
