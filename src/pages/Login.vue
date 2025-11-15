<script setup lang="ts">
import { reactive } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRoute, useRouter } from 'vue-router';


const auth = useAuthStore();
const router = useRouter();
const route = useRoute();


const form = reactive({ email: '', password: '' });
const loading = reactive({ v: false });


const submit = async () => {
try {
loading.v = true;
await auth.login(form);
const redirect = (route.query.redirect as string) || '/admin';
router.push(redirect);
} finally { loading.v = false; }
};
</script>


<template>
<v-card max-width="420" class="mx-auto my-12 pa-6">
<h2 class="mb-4">Login</h2>
<v-text-field v-model="form.email" label="Email" prepend-inner-icon="mdi-email" />
<v-text-field v-model="form.password" label="Password" type="password" prepend-inner-icon="mdi-lock" />
<v-btn :loading="loading.v" color="primary" block class="mt-2" @click="submit">Login</v-btn>
</v-card>
</template>