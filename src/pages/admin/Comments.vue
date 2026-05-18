<template>
  <v-container class="py-10">
    <h2 class="text-h5 mb-4">{{ t('admin.manageComments') }}</h2>

    <v-row>
      <v-col cols="12" md="4">
        <v-select
          :label="t('admin.selectCategory')"
          :items="categories"
          item-title="title"
          item-value="id"
          v-model="selectedCategory"
          @update:modelValue="onCategoryChange"
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-select
          :label="t('admin.selectImage')"
          :items="images"
          item-title="title"
          item-value="id"
          v-model="selectedImage"
          @update:modelValue="loadComments"
          :disabled="!selectedCategory"
        />
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <v-row>
      <v-col cols="12">
        <v-alert v-if="selectedImage && comments.length === 0" type="info">
          {{ t('comments.none') }}
        </v-alert>

        <v-card v-for="c in comments" :key="c.id" class="mb-4">
          <v-card-title>{{ c.subject }}</v-card-title>
          <v-card-subtitle>@{{ c.authorUsername }}</v-card-subtitle>
          <v-card-text>{{ c.body }}</v-card-text>
          <v-card-actions>
            <v-btn color="error" @click="deleteComment(c.id)">{{ t('common.delete') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from 'vue-i18n';
import { CategoriesApi } from "../../api/modules/categories.api";
import { ImagesApi } from "../../api/modules/images.api";
import { CommentsApi } from "../../api/modules/comments.api";
import type { Category } from '../../types/category';
import type { ImageItem } from '../../types/image';
import type { Comment } from '../../types/comment';

const { t } = useI18n();
const categories = ref<Category[]>([]);
const images = ref<ImageItem[]>([]);
const comments = ref<Comment[]>([]);

const selectedCategory = ref<string>("");
const selectedImage = ref<string>("");

async function loadCategories() {
  categories.value = await CategoriesApi.listAll();
}

async function onCategoryChange() {
  selectedImage.value = "";
  comments.value = [];
  if (!selectedCategory.value) {
    images.value = [];
    return;
  }
  const r = await ImagesApi.listByCategory(selectedCategory.value, { pageNumber: 1, pageSize: 100 });
  images.value = r.items;
}

async function loadComments() {
  if (!selectedImage.value) return;
  const r = await CommentsApi.listByImage(selectedImage.value, { pageNumber: 1, pageSize: 100 });
  comments.value = r.items;
}

async function deleteComment(id: string) {
  await CommentsApi.delete(id);
  await loadComments();
}

onMounted(loadCategories);
</script>
