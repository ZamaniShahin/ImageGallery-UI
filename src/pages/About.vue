<template>
  <v-container class="py-12">
    <v-row v-if="loading" justify="center" class="py-16">
      <v-progress-circular indeterminate color="primary" size="48" />
    </v-row>

    <template v-else-if="about">
      <section class="mb-12 text-center">
        <v-img
          v-if="about.imageUrl"
          :src="apiOrigin + about.imageUrl"
          max-height="320"
          cover
          class="rounded-lg mb-6"
        />
        <h1 class="text-h3 font-weight-bold mb-3">{{ about.title }}</h1>
        <h2 class="text-h5 text-medium-emphasis mb-4">{{ about.h2Title }}</h2>
        <p class="text-subtitle-1 mx-auto" style="max-width: 720px">{{ about.description }}</p>
      </section>

      <section v-if="about.employees?.length" class="mb-12">
        <h2 class="text-h5 font-weight-bold mb-6 text-center">{{ t('about.team') }}</h2>
        <v-row justify="center">
          <v-col v-for="emp in about.employees" :key="emp.id" cols="12" sm="6" md="4">
            <v-card class="pa-4 text-center elevation-2">
              <v-avatar size="96" class="mb-3">
                <v-img v-if="emp.profilePhotoUrl" :src="apiOrigin + emp.profilePhotoUrl" />
                <v-icon v-else size="64">mdi-account-circle</v-icon>
              </v-avatar>
              <h3 class="text-h6">{{ emp.title }}</h3>
              <p class="text-body-2 mt-2">{{ emp.description }}</p>
            </v-card>
          </v-col>
        </v-row>
      </section>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { AboutUsApi } from '../api/modules/aboutus.api';
import { apiOrigin } from '../api/http';

const { t } = useI18n();
const loading = ref(true);
const about = ref<any>(null);

onMounted(async () => {
  try {
    about.value = await AboutUsApi.get();
  } catch {
    /* keep null */
  } finally {
    loading.value = false;
  }
});
</script>
