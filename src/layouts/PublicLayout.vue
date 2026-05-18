<template>
  <v-app>
    <AppNavBar />
    <v-main>
      <div class="container">
        <AppBreadcrumbs />
        <router-view />
      </div>
    </v-main>
    <AppFooter />
  </v-app>
</template>
<script setup lang="ts">
import AppNavBar from '../components/AppNavBar.vue';
import AppFooter from '../components/AppFooter.vue';
import AppBreadcrumbs from '../components/AppBreadcrumbs.vue';
</script>
