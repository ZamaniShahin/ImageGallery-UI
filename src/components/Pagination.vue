<template>
  <div class="d-flex flex-column align-center my-6 ga-3">
    <v-pagination
      v-model="currentPage"
      :length="totalPages"
      :total-visible="6"
      rounded="circle"
      density="comfortable"
      :disabled="totalPages <= 1"
    />
    <div class="text-caption text-medium-emphasis">
      {{ t('pagination.total', { count: total }) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  page: number;
  pageSize: number;
  total: number;
}>();

const emit = defineEmits<{
  (e: 'update:page', page: number): void;
}>();

const { t } = useI18n();

const currentPage = computed({
  get: () => props.page,
  set: (v: number) => emit('update:page', v),
});

const totalPages = computed(() =>
  props.pageSize > 0 ? Math.max(1, Math.ceil(props.total / props.pageSize)) : 1,
);
</script>
