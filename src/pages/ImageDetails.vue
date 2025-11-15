<template>
  <v-container class="py-10">
    <h1 class="text-h4 mb-6">Image Details</h1>

    <v-row v-if="loading" justify="center">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <v-row v-else>

      <v-col cols="12" md="6" class="d-flex justify-center">
        <v-img :src="imageSrc" max-width="600" class="rounded elevation-3" />
      </v-col>

      <v-col cols="12" md="6">
        <h2 class="text-h5">{{ image.description }}</h2>

        <h3 class="text-h6 mt-8 mb-3">Add a Comment</h3>

        <v-text-field v-model="subject" label="Subject" outlined />
        <v-textarea v-model="body" label="Comment" outlined rows="4" />

        <v-btn color="primary" @click="addComment">Submit Comment</v-btn>

        <h3 class="text-h6 mt-10 mb-3">Comments</h3>

        <v-card
          v-for="c in comments"
          :key="c.id"
          class="mb-3 pa-3"
        >
          <h4 class="text-h6">{{ c.subject }}</h4>
          <p>{{ c.body }}</p>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ImagesApi } from "../api/modules/images.api";
import { CommentsApi } from "../api/modules/comments.api";

const route = useRoute();

const image = ref<any>(null);
const imageSrc = ref<string>("");
const comments = ref<any[]>([]);
const loading = ref(true);

const subject = ref("");
const body = ref("");

function getImageId() {
  return route.params.id as string; // FIXED
}

async function loadImage() {
  const id = getImageId();
  image.value = await ImagesApi.getById(id);

  if (image.value?.content) {
    imageSrc.value = `data:image/jpeg;base64,${image.value.content}`;
  }
}

async function loadComments() {
  const id = getImageId();
  comments.value = await CommentsApi.getByImage(id);
}

async function addComment() {
  const id = getImageId();
  await CommentsApi.add(id, subject.value, body.value);

  subject.value = "";
  body.value = "";

  await loadComments();
}

onMounted(async () => {
  await loadImage();
  await loadComments();
  loading.value = false;
});
</script>
