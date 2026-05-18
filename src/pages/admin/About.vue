<template>
  <v-container fluid>
    <h2 class="text-h5 mb-6">{{ t('admin.manageAbout') }}</h2>

    <v-row v-if="loading" justify="center" class="py-10">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <v-card v-else class="pa-6" elevation="2" max-width="720">
      <v-form @submit.prevent="save">
        <v-text-field v-model="form.title" :label="t('about.pageTitle')" prepend-inner-icon="mdi-format-title" class="mb-2" />
        <v-text-field v-model="form.h2Title" :label="t('about.h2')" prepend-inner-icon="mdi-format-header-2" class="mb-2" />
        <v-textarea v-model="form.description" :label="t('about.description')" prepend-inner-icon="mdi-text" rows="4" class="mb-4" />

        <v-file-input
          v-model="form.file"
          :label="t('about.heroImage')"
          accept="image/*"
          prepend-icon="mdi-image"
          class="mb-2"
          clearable
        />
        <v-img v-if="previewSrc" :src="previewSrc" max-height="200" class="mb-4 rounded" />

        <v-alert v-if="success" type="success" class="mb-4" closable @click:close="success = false">
          {{ t('common.successSaved') }}
        </v-alert>
        <v-alert v-if="error" type="error" class="mb-4" closable @click:close="error = false">
          {{ t('common.errorGeneric') }}
        </v-alert>

        <v-btn color="primary" :loading="saving" type="submit">{{ t('common.save') }}</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { AboutUsApi } from '../../api/modules/aboutus.api';
import { apiOrigin } from '../../api/http';

const { t } = useI18n();
const loading = ref(true);
const saving = ref(false);
const success = ref(false);
const error = ref(false);

const form = ref<{ title: string; h2Title: string; description: string; file: File | null; imageUrl?: string }>({
  title: '',
  h2Title: '',
  description: '',
  file: null,
});

const previewSrc = computed(() => {
  if (form.value.file) return URL.createObjectURL(form.value.file);
  if (form.value.imageUrl) return apiOrigin + form.value.imageUrl;
  return null;
});

onMounted(async () => {
  try {
    const res = await AboutUsApi.get();
    const data = res ?? {};
    form.value.title = data.title ?? '';
    form.value.h2Title = data.h2Title ?? '';
    form.value.description = data.description ?? '';
    form.value.imageUrl = data.imageUrl;
  } catch {
    /* start with empty form */
  } finally {
    loading.value = false;
  }
});

async function save() {
  saving.value = true;
  success.value = false;
  error.value = false;
  try {
    await AboutUsApi.update({
      title: form.value.title,
      h2Title: form.value.h2Title,
      description: form.value.description,
      file: form.value.file,
    });
    success.value = true;
    form.value.file = null;
  } catch {
    error.value = true;
  } finally {
    saving.value = false;
  }
}
</script>
