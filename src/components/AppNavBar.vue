<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { isAuthenticated, hasAdminRole, username, keycloak } from "../plugins/keycloak";

const { t } = useI18n();

function login() {
  keycloak.login({ redirectUri: window.location.origin });
}

function logout() {
  keycloak.logout({ redirectUri: window.location.origin });
}
</script>

<template>
  <v-app-bar color="primary" density="comfortable" flat>
    <v-app-bar-title class="text-h6 font-weight-bold">
      {{ t('app.title') }}
    </v-app-bar-title>

    <div class="d-flex align-center ga-1 px-4">
      <v-btn variant="text" :to="{ name: 'home' }">{{ t('nav.home') }}</v-btn>
      <v-btn variant="text" :to="{ name: 'categories' }">{{ t('nav.categories') }}</v-btn>
      <v-btn variant="text" :to="{ name: 'services' }">{{ t('nav.services') }}</v-btn>
      <v-btn variant="text" :to="{ name: 'about' }">{{ t('nav.about') }}</v-btn>
      <v-btn
        v-if="isAuthenticated && hasAdminRole"
        variant="text"
        :to="{ name: 'admin.dashboard' }"
      >
        {{ t('nav.admin') }}
      </v-btn>
    </div>

    <v-spacer />

    <div class="d-flex align-center ga-2 px-4">
      <span v-if="isAuthenticated" class="text-body-2">
        {{ t('nav.welcome', { name: username }) }}
      </span>

      <template v-if="!isAuthenticated">
        <v-btn variant="outlined" color="white" @click="login">{{ t('nav.login') }}</v-btn>
        <v-btn variant="flat" color="secondary" :to="{ name: 'register' }">{{ t('nav.register') }}</v-btn>
      </template>
      <v-btn v-else variant="outlined" color="white" @click="logout">{{ t('nav.logout') }}</v-btn>
    </div>
  </v-app-bar>
</template>
