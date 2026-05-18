<template>
  <v-container class="py-10">
    <v-card max-width="480" class="mx-auto pa-6" elevation="3">
      <h2 class="text-h5 mb-4">{{ t('auth.register') }}</h2>

      <v-form ref="formRef" @submit.prevent="submit">
        <v-text-field
          v-model="form.username"
          :label="t('auth.username')"
          :hint="t('auth.usernameHint')"
          prepend-inner-icon="mdi-account"
          required
          :rules="usernameRules"
        />
        <v-text-field
          v-model="form.email"
          :label="t('auth.email')"
          prepend-inner-icon="mdi-email"
          type="email"
          required
          :rules="emailRules"
        />
        <v-text-field
          v-model="form.password"
          :label="t('auth.password')"
          :hint="t('auth.passwordHint')"
          prepend-inner-icon="mdi-lock"
          type="password"
          required
          :rules="passwordRules"
        />
        <v-text-field
          v-model="form.confirmPassword"
          :label="t('auth.confirmPassword')"
          prepend-inner-icon="mdi-lock-check"
          type="password"
          required
          :rules="confirmRules"
        />

        <v-alert v-if="error" type="error" variant="tonal" class="mb-3" closable @click:close="error = ''">
          {{ error }}
        </v-alert>
        <v-alert v-if="success" type="success" variant="tonal" class="mb-3">
          {{ t('auth.registerSuccess') }}
        </v-alert>

        <v-btn
          color="primary"
          block
          :loading="loading"
          type="submit"
          class="mb-3"
        >
          {{ t('auth.registerSubmit') }}
        </v-btn>

        <div class="text-center">
          {{ t('auth.haveAccount') }}
          <v-btn variant="text" color="primary" @click="login">{{ t('auth.login') }}</v-btn>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { AuthApi } from '../api/modules/auth.api';
import { keycloak } from '../plugins/keycloak';

const { t } = useI18n();
const formRef = ref();
const loading = ref(false);
const error = ref('');
const success = ref(false);

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const usernameRules = computed(() => [
  (v: string) => !!v || t('errors.generic'),
  (v: string) => (v && v.length >= 3) || t('auth.usernameHint'),
  (v: string) => /^[a-zA-Z0-9._-]+$/.test(v) || t('auth.usernameHint'),
]);

const emailRules = computed(() => [
  (v: string) => !!v || t('errors.generic'),
  (v: string) => /\S+@\S+\.\S+/.test(v) || t('auth.email'),
]);

const passwordRules = computed(() => [
  (v: string) => !!v || t('errors.generic'),
  (v: string) => (v && v.length >= 8) || t('auth.passwordHint'),
  (v: string) => /[A-Za-z]/.test(v) || t('auth.passwordHint'),
  (v: string) => /[0-9]/.test(v) || t('auth.passwordHint'),
]);

const confirmRules = computed(() => [
  (v: string) => !!v || t('errors.generic'),
  (v: string) => v === form.password || t('auth.passwordMismatch'),
]);

async function submit() {
  const ok = await formRef.value?.validate();
  if (!ok?.valid) return;
  error.value = '';
  success.value = false;
  loading.value = true;
  try {
    await AuthApi.register({
      username: form.username,
      email: form.email,
      password: form.password,
    });
    success.value = true;
    setTimeout(() => {
      keycloak.login({ loginHint: form.email, redirectUri: window.location.origin });
    }, 1500);
  } catch (e: any) {
    const apiMsg = e?.response?.data?.errors?.[0] || e?.response?.data || e?.message;
    error.value = typeof apiMsg === 'string' ? apiMsg : t('errors.generic');
  } finally {
    loading.value = false;
  }
}

function login() {
  keycloak.login({ redirectUri: window.location.origin });
}
</script>
