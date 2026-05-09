<template>
  <v-container class="py-12">

    <v-row v-if="loading" justify="center" class="py-16">
      <v-progress-circular indeterminate color="primary" size="48" />
    </v-row>

    <template v-else>

      <!-- HERO -->
      <section class="mb-12 text-center">
        <v-img
          v-if="heroImage"
          :src="heroImage"
          max-height="320"
          cover
          class="rounded-lg mb-6"
        />
        <h1 class="text-h3 font-weight-bold mb-3">{{ about.title }}</h1>
        <h2 class="text-h5 text-medium-emphasis mb-4">{{ about.h2Title }}</h2>
        <p class="text-subtitle-1 mx-auto" style="max-width: 720px">{{ about.description }}</p>
      </section>

      <!-- TEAM -->
      <section v-if="about.employees?.length" class="mb-12">
        <h2 class="text-h5 font-weight-bold mb-6 text-center">Our Team</h2>
        <v-row justify="center">
          <v-col
            v-for="emp in about.employees"
            :key="emp.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card class="pa-4 text-center elevation-2">
              <v-avatar size="96" class="mb-3">
                <v-img v-if="emp.profilePhoto" :src="toDataUrl(emp.profilePhoto)" />
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
import { AboutUsApi } from '../api/modules/aboutus.api';

const loading = ref(true);
const about = ref<any>({});
const heroImage = ref<string | null>(null);

function toDataUrl(image: string | number[]): string {
  if (typeof image === 'string') return `data:image/jpeg;base64,${image}`;
  return `data:image/jpeg;base64,${btoa(String.fromCharCode(...image))}`;
}

onMounted(async () => {
  try {
    const res = await AboutUsApi.get();
    const data = res ?? {};
    about.value = data;
    if (data.image) heroImage.value = toDataUrl(data.image);
  } catch {
    // keep defaults
  } finally {
    loading.value = false;
  }
});
</script>
