<template>
  <v-container class="py-10">

    <h1 class="text-h4 mb-6">Gallery – {{ categoryName }}</h1>

    <v-row v-if="loading" justify="center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>

    <v-row v-else>
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="img in images"
        :key="img.id"
      >
        <v-card class="hoverable" @click="router.push({ name: 'image.details', params: { id: img.id } })">
          <v-img
            :src="img.preview"
            height="260"
            cover
          ></v-img>

          <v-card-text class="text-center">
            {{ img.description }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ImagesApi } from "../api/modules/images.api";

const route = useRoute();
const router = useRouter();

const images = ref<any[]>([]);
const loading = ref(true);
const categoryName = ref("");

onMounted(async () => {
  const categoryId = route.query.categoryId as string;

  if (!categoryId) {
    loading.value = false;
    return;
  }

  const res = await ImagesApi.getByCategory(categoryId);

  images.value = res.map((x: { id: string; description?: string; content: string }) => ({
    id: x.id,
    description: x.description,
    preview: "data:image/jpeg;base64," + x.content,
  }));

  categoryName.value = Array.isArray(route.query.categoryName)
    ? (route.query.categoryName[0] ?? "")
    : (route.query.categoryName ?? "");
  loading.value = false;
});
</script>
