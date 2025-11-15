<template>
  <v-container class="py-10">

    <h1 class="text-h4 mb-6">Manage Comments</h1>

    <!-- Select Category -->
    <v-row>
      <v-col cols="12" md="4">
        <v-select
          label="Select Category"
          :items="categories"
          item-title="title"
          item-value="id"
          v-model="selectedCategory"
          @update:modelValue="loadImages"
        />
      </v-col>

      <!-- Select Image -->
      <v-col cols="12" md="4">
        <v-select
          label="Select Image"
          :items="images"
          item-title="description"
          item-value="id"
          v-model="selectedImage"
          @update:modelValue="loadComments"
          :disabled="!selectedCategory"
        />
      </v-col>
    </v-row>

    <v-divider class="my-4"></v-divider>

    <!-- Comments List -->
    <v-row>
      <v-col cols="12">

        <v-alert
          v-if="selectedImage && comments.length === 0"
          type="info"
        >
          No comments found for this image.
        </v-alert>

        <v-card
          v-for="c in comments"
          :key="c.id"
          class="mb-4"
        >
          <v-card-title>
            {{ c.subject }}
          </v-card-title>

          <v-card-text>
            {{ c.body }}
          </v-card-text>

          <v-card-actions>
            <v-btn color="error" @click="deleteComment(c.id)">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>

      </v-col>
    </v-row>

  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { CategoriesApi } from "../../api/modules/categories.api";
import { ImagesApi } from "../../api/modules/images.api";
import { CommentsApi } from "../../api/modules/comments.api";

const categories = ref<any[]>([]);
const images = ref<any[]>([]);
const comments = ref<any[]>([]);

const selectedCategory = ref("");
const selectedImage = ref("");

async function loadCategories() {
  categories.value = await CategoriesApi.getAll();
}

async function loadImages() {
  images.value = await ImagesApi.getByCategory(selectedCategory.value);
}

async function loadComments() {
  comments.value = await CommentsApi.getByImage(selectedImage.value);
}

async function deleteComment(id: string) {
  await CommentsApi.delete(id);
  loadComments();
}

onMounted(loadCategories);
</script>
