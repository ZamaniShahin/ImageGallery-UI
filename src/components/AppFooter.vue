<template>
  <v-footer app color="grey-lighten-3">
    <div class="container text-center text-body-2 text-medium-emphasis">
      © {{ new Date().getFullYear() }} {{ t('app.title') }}
    </div>
  </v-footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>
