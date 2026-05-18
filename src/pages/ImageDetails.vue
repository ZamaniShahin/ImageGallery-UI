<template>
  <v-container class="py-10">
    <h1 class="text-h4 mb-6">{{ t('image.details') }}</h1>

    <v-row v-if="loading" justify="center">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <v-row v-else-if="image">
      <v-col cols="12" md="6" class="d-flex justify-center">
        <v-img :src="imageSrc" max-width="600" class="rounded elevation-3" />
      </v-col>

      <v-col cols="12" md="6">
        <h2 class="text-h5">{{ image.title }}</h2>
        <p class="text-body-1 mt-2">{{ image.description }}</p>

        <v-divider class="my-6" />

        <h3 class="text-h6 mb-3">{{ t('comments.add') }}</h3>

        <template v-if="isAuthenticated">
          <v-text-field v-model="subject" :label="t('comments.subject')" />
          <v-textarea v-model="body" :label="t('comments.body')" rows="4" />
          <v-btn color="primary" :loading="posting" @click="addComment">{{ t('common.submit') }}</v-btn>
        </template>
        <v-alert v-else type="info" variant="tonal" class="mt-2">
          {{ t('comments.signInPrompt') }}
          <div class="mt-3 d-flex ga-2">
            <v-btn color="primary" size="small" @click="login">{{ t('auth.login') }}</v-btn>
            <v-btn variant="outlined" size="small" :to="{ name: 'register' }">{{ t('auth.register') }}</v-btn>
          </div>
        </v-alert>

        <h3 class="text-h6 mt-10 mb-3">{{ t('comments.title') }}</h3>
        <p v-if="comments.length === 0" class="text-medium-emphasis">{{ t('comments.none') }}</p>
        <v-card v-for="c in comments" :key="c.id" class="mb-3 pa-3">
          <h4 class="text-h6">{{ c.subject }}</h4>
          <p class="my-2">{{ c.body }}</p>
          <div class="text-caption text-medium-emphasis">{{ t('comments.by') }} @{{ c.authorUsername }}</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from 'vue-i18n';
import { ImagesApi } from "../api/modules/images.api";
import { CommentsApi } from "../api/modules/comments.api";
import { apiOrigin } from '../api/http';
import { isAuthenticated, keycloak } from '../plugins/keycloak';
import type { ImageItem } from '../types/image';
import type { Comment } from '../types/comment';

const { t } = useI18n();
const route = useRoute();

const image = ref<ImageItem | null>(null);
const comments = ref<Comment[]>([]);
const loading = ref(true);
const posting = ref(false);

const subject = ref("");
const body = ref("");

const imageSrc = computed(() => image.value ? apiOrigin + image.value.url : '');

function getImageId() {
  return route.params.id as string;
}

async function loadImage() {
  image.value = await ImagesApi.getById(getImageId());
}

async function loadComments() {
  const r = await CommentsApi.listByImage(getImageId(), { pageNumber: 1, pageSize: 50 });
  comments.value = r.items;
}

async function addComment() {
  if (!subject.value.trim() || !body.value.trim()) return;
  posting.value = true;
  try {
    await CommentsApi.add(getImageId(), { subject: subject.value, body: body.value });
    subject.value = "";
    body.value = "";
    await loadComments();
  } catch (e) {
    console.error('Failed to add comment', e);
  } finally {
    posting.value = false;
  }
}

function login() {
  keycloak.login({ redirectUri: window.location.href });
}

onMounted(async () => {
  await loadImage();
  await loadComments();
  loading.value = false;
});
</script>
