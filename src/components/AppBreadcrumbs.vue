<template>
  <v-breadcrumbs
    v-if="items.length"
    :items="items"
    density="compact"
    class="px-4 py-2"
  >
    <template #prepend>
      <v-icon icon="mdi-home" class="me-2" />
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const { t, te } = useI18n();

const items = computed(() =>
  route.matched
    .filter((r) => r.meta && (r.meta as any).breadcrumb)
    .map((r) => {
      const key = (r.meta as any).breadcrumb as string;
      return {
        title: te(key) ? t(key) : key,
        to: r.path === route.path ? undefined : r.path,
        disabled: r.path === route.path,
      };
    }),
);
</script>
