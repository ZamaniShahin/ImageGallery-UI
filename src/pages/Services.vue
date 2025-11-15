<template>
  <v-container class="py-10">

    <h1 class="text-h4 mb-6">Our Services</h1>

    <!-- Loading -->
    <v-row v-if="loading" justify="center">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <!-- No services -->
    <v-row v-if="!loading && services.length === 0">
      <v-col cols="12" class="text-center">
        <p>No services available at the moment.</p>
      </v-col>
    </v-row>

    <!-- Services Grid -->
    <v-row v-else>
      <v-col
        v-for="svc in services"
        :key="svc.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="hoverable">

          <!-- Service Logo -->
          <v-img
            v-if="svc.logo"
            :src="toImage(svc.logo)"
            height="200"
            cover
          ></v-img>

          <v-card-title class="text-h6">
            {{ svc.title }}
          </v-card-title>

          <v-card-text>
            <div class="mb-2">{{ svc.description }}</div>
            <strong>Price:</strong> {{ formatPrice(svc.price) }}
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ServicesApi } from '../api/modules/services.api';

// Data
const services = ref<any[]>([]);
const loading = ref(true);

// Convert base64 logo to image
function toImage(base64: string) {
  return `data:image/png;base64,${base64}`;
}

// Simple currency formatter
function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'  // Or IRR if needed
  }).format(price);
}

onMounted(async () => {
  try {
    services.value = await ServicesApi.getAll();
  } catch (err) {
    console.error("Failed to load services", err);
    services.value = [];
  } finally {
    loading.value = false;
  }
});
</script>
