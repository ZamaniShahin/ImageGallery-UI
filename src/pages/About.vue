<template>
  <v-container class="py-12">

    <!-- HERO -->
    <section class="mb-12 text-center">
      <h1 class="text-h3 font-weight-bold mb-3">About ImageGallery</h1>
      <p class="text-subtitle-1">
        A simple and elegant platform for managing, sharing, and categorizing your images.
      </p>
    </section>

    <!-- MISSION -->
    <section class="mb-12">
      <v-row align="center">
        <v-col cols="12" md="6">
          <h2 class="text-h5 font-weight-bold mb-3">Our Mission</h2>
          <p class="text-body-1">
            ImageGallery was built to provide a clean, powerful, and reliable way to store, manage,
            and organize digital images. Whether you're a photographer, designer, or hobbyist, our platform
            streamlines the entire workflow — from uploading to categorizing and sharing.
          </p>
        </v-col>

        <v-col cols="12" md="6">
          <v-img
            src="https://images.unsplash.com/photo-1499084732479-de2c02d45fc4"
            height="300"
            class="rounded elevation-3"
            cover
          />
        </v-col>
      </v-row>
    </section>

    <!-- FEATURES -->
    <section class="mb-12">
      <h2 class="text-h5 font-weight-bold mb-6 text-center">Key Features</h2>

      <v-row>
        <v-col cols="12" md="4">
          <v-card class="pa-4 text-center elevation-2">
            <v-icon size="40" color="primary">mdi-image-multiple</v-icon>
            <h3 class="text-h6 mt-3">Image Categories</h3>
            <p class="text-body-2">
              Organize all your images into clean, structured categories.
            </p>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="pa-4 text-center elevation-2">
            <v-icon size="40" color="primary">mdi-comment-text-multiple</v-icon>
            <h3 class="text-h6 mt-3">Comment System</h3>
            <p class="text-body-2">
              Users can comment on any image, helping discussions and feedback.
            </p>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="pa-4 text-center elevation-2">
            <v-icon size="40" color="primary">mdi-shield-account</v-icon>
            <h3 class="text-h6 mt-3">Admin Portal</h3>
            <p class="text-body-2">
              Manage images, categories, services, and comments through a protected admin dashboard.
            </p>
          </v-card>
        </v-col>
      </v-row>
    </section>

    <!-- CONTACT -->
    <section class="mb-12">
      <h2 class="text-h5 font-weight-bold mb-6 text-center">Contact Us</h2>

      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-card class="pa-6 elevation-2">
            <p><strong>Email:</strong> support@imagegallery.com</p>
            <p><strong>Phone:</strong> +1 234 567 890</p>
            <p><strong>Location:</strong> Tehran, Iran</p>
          </v-card>
        </v-col>
      </v-row>
    </section>

    <!-- TEAM (Optional) -->
    <section>
      <h2 class="text-h5 font-weight-bold mb-6 text-center">Our Team</h2>

      <v-row justify="center">
        <v-col cols="12" md="4">
          <v-card class="pa-4 text-center elevation-2">
            <v-avatar size="80" class="mx-auto mb-3">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" />
            </v-avatar>
            <h3 class="text-h6">Shahin Zamani</h3>
            <p class="text-body-2">Founder & Backend Developer</p>
          </v-card>
        </v-col>
      </v-row>
    </section>

  </v-container>
</template>

<script setup lang="ts">
// Static page — no logic needed
</script>
