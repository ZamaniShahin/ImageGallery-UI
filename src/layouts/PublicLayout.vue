<template>
<v-app>
<AppNavBar />
<v-main>
<div class="container">
<router-view />
</div>
</v-main>
<AppFooter />
</v-app>
</template>
<script setup lang="ts">
import AppNavBar from '@/components/AppNavBar.vue';
import AppFooter from '@/components/AppFooter.vue';
</script>