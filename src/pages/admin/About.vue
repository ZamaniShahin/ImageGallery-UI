<template>
  <v-container fluid>
    <h2 class="text-h5 mb-6">Manage About Page</h2>

    <v-row v-if="loading" justify="center" class="py-10">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <v-card v-else class="pa-6" elevation="2" max-width="720">
      <v-form @submit.prevent="save">
        <v-text-field
          v-model="form.title"
          label="Page Title"
          prepend-inner-icon="mdi-format-title"
          class="mb-2"
        />
        <v-text-field
          v-model="form.h2Title"
          label="Sub-title (H2)"
          prepend-inner-icon="mdi-format-header-2"
          class="mb-2"
        />
        <v-textarea
          v-model="form.description"
          label="Description"
          prepend-inner-icon="mdi-text"
          rows="4"
          class="mb-4"
        />

        <!-- Image upload -->
        <v-file-input
          label="Hero Image"
          accept="image/*"
          prepend-icon="mdi-image"
          class="mb-2"
          @change="onImageChange"
        />
        <v-img v-if="imagePreview" :src="imagePreview" max-height="200" class="mb-4 rounded" />

        <v-alert v-if="success" type="success" class="mb-4" closable @click:close="success = false">
          Saved successfully.
        </v-alert>
        <v-alert v-if="error" type="error" class="mb-4" closable @click:close="error = false">
          Save failed. Please try again.
        </v-alert>

        <v-btn color="primary" :loading="saving" type="submit">Save</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { AboutUsApi } from '../../api/modules/aboutus.api';

const loading = ref(true);
const saving = ref(false);
const success = ref(false);
const error = ref(false);
const imagePreview = ref<string | null>(null);

const form = ref({
  title: '',
  h2Title: '',
  description: '',
  image: '' as string,
});

function toBase64(bytes: number[] | Uint8Array | string): string {
  if (typeof bytes === 'string') return bytes;
  return btoa(String.fromCharCode(...bytes));
}

onMounted(async () => {
  try {
    const res = await AboutUsApi.get();
    const data = res ?? {};
    form.value.title = data.title ?? '';
    form.value.h2Title = data.h2Title ?? '';
    form.value.description = data.description ?? '';
    if (data.image) {
      const b64 = toBase64(data.image);
      imagePreview.value = `data:image/jpeg;base64,${b64}`;
      form.value.image = b64;
    }
  } catch {
    // start with empty form
  } finally {
    loading.value = false;
  }
});

function onImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const result = e.target?.result as string;
    imagePreview.value = result;
    form.value.image = result.split(',')[1];
  };
  reader.readAsDataURL(file);
}

async function save() {
  saving.value = true;
  success.value = false;
  error.value = false;
  try {
    await AboutUsApi.update(form.value);
    success.value = true;
  } catch {
    error.value = true;
  } finally {
    saving.value = false;
  }
}
</script>
