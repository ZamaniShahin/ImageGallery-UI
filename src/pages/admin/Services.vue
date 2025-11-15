<template>
  <v-container fluid>
    <h2 class="text-h5 mb-4">Manage Services</h2>

    <!-- Add/Edit Form -->
    <v-card class="pa-4 mb-6" elevation="2">
      <v-form @submit.prevent="saveService">
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="form.title"
              label="Service Title"
              prepend-inner-icon="mdi-briefcase"
              required
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="form.price"
              label="Price"
              type="number"
              prepend-inner-icon="mdi-currency-usd"
              required
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="form.description"
              label="Description"
              prepend-inner-icon="mdi-text"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-file-input
              v-model="form.file"
              label="Logo"
              prepend-inner-icon="mdi-upload"
              accept="image/*"
            />
          </v-col>
        </v-row>

        <v-btn color="primary" :loading="saving" type="submit">
          {{ form.id ? 'Update' : 'Add' }}
        </v-btn>
      </v-form>
    </v-card>

    <!-- Table -->
    <v-data-table
      :headers="headers"
      :items="services"
      :loading="loading"
      class="elevation-2"
      density="comfortable"
    >
      <template #item.logo="{ item }">
        <v-img
          :src="`data:image/jpeg;base64,${item.logo}`"
          width="60"
          height="60"
          cover
          class="rounded"
        />
      </template>

      <template #item.actions="{ item }">
        <v-btn
          icon="mdi-pencil"
          variant="text"
          color="blue"
          @click="editService(item)"
        />
        <v-btn
          icon="mdi-delete"
          variant="text"
          color="red"
          @click="deleteService(item.id)"
        />
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ServicesApi } from '../../api/modules/services.api';

interface Service {
  id?: string;
  title: string;
  description?: string;
  price: number;
  logo?: string;
  file?: File | null;
}

const services = ref<Service[]>([]);
const loading = ref(false);
const saving = ref(false);

const form = ref<Service>({
  title: '',
  description: '',
  price: 0,
  file: null,
});

const headers = [
  { title: 'ID', key: 'id', width: 80 },
  { title: 'Logo', key: 'logo', sortable: false },
  { title: 'Title', key: 'title' },
  { title: 'Price', key: 'price' },
  { title: 'Description', key: 'description' },
  { title: 'Actions', key: 'actions', sortable: false },
];

// Load services
const loadServices = async () => {
  loading.value = true;
  try {
    const res = await ServicesApi.getAll();
    services.value = Array.isArray(res) ? res : res.items || [];
  } finally {
    loading.value = false;
  }
};

// Save new or edited service
const saveService = async () => {
  if (!form.value.title.trim()) return;
  saving.value = true;
  try {
    if (form.value.id) {
      await ServicesApi.update(form.value.id, form.value);
    } else {
      await ServicesApi.add(form.value);
    }
    form.value = { title: '', description: '', price: 0, file: null };
    await loadServices();
  } catch (e) {
    console.error('Save failed:', e);
  } finally {
    saving.value = false;
  }
};

// Edit existing service
const editService = (item: Service) => {
  form.value = { ...item, file: null };
};

// Delete service
const deleteService = async (id: string) => {
  if (!confirm('Delete this service?')) return;
  try {
    await ServicesApi.remove(id);
    await loadServices();
  } catch (e) {
    console.error('Delete failed:', e);
  }
};

onMounted(loadServices);
</script>
