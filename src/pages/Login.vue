<template>
  <v-container class="py-10">
    <v-card max-width="480" class="mx-auto pa-6" elevation="3">
      <h2 class="text-h5 mb-6">{{ t('auth.loginTitle') }}</h2>

      <v-form ref="formRef" @submit.prevent="submit">
        <v-text-field
          v-model="username"
          :label="t('auth.username')"
          prepend-inner-icon="mdi-account"
          autocomplete="username"
          :rules="[(v: string) => !!v || t('errors.generic')]"
        />
        <v-text-field
          v-model="password"
          :label="t('auth.password')"
          prepend-inner-icon="mdi-lock"
          type="password"
          autocomplete="current-password"
          :rules="[(v: string) => !!v || t('errors.generic')]"
        />

        <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable @click:close="error = ''">
          {{ error }}
        </v-alert>

        <v-btn color="primary" block :loading="loading" type="submit" class="mb-4">
          {{ t('auth.loginSubmit') }}
        </v-btn>

        <div class="text-center">
          {{ t('auth.noAccount') }}
          <v-btn variant="text" color="primary" :to="{ name: 'register' }">{{ t('auth.register') }}</v-btn>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import axios from 'axios';

const { t } = useI18n();
const route = useRoute();

const formRef = ref();
const username = ref((route.query.username as string) || '');
const password = ref('');
const loading = ref(false);
const error = ref('');

const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL as string;
const realm = import.meta.env.VITE_KEYCLOAK_REALM as string;
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID as string;

async function submit() {
  const ok = await formRef.value?.validate();
  if (!ok?.valid) return;

  error.value = '';
  loading.value = true;
  try {
    const { data } = await axios.post(
      `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: 'password',
        client_id: clientId,
        username: username.value,
        password: password.value,
      }),
    );

    sessionStorage.setItem('kc_token', data.access_token);
    sessionStorage.setItem('kc_refresh_token', data.refresh_token);

    const redirect = (route.query.redirect as string) || '/';
    window.location.href = redirect;
  } catch (e: any) {
    const status = e?.response?.status;
    error.value = (status === 401 || status === 400)
      ? t('auth.invalidCredentials')
      : t('errors.generic');
  } finally {
    loading.value = false;
  }
}
</script>
