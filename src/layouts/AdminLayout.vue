<template>
  <v-app>
    <v-app-bar flat color="primary" density="compact">
      <v-app-bar-title>Admin • ImageGallery</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer permanent>
      <v-list density="compact">
        <v-list-item to="/admin" title="Dashboard" prepend-icon="mdi-view-dashboard" />
        <v-list-item to="/admin/images" title="Images" prepend-icon="mdi-image-multiple" />
        <v-list-item to="/admin/categories" title="Categories" prepend-icon="mdi-shape" />
        <v-list-item to="/admin/services" title="Services" prepend-icon="mdi-hammer-wrench" />
        <v-list-item to="/admin/comments" title="Comments" prepend-icon="mdi-comment" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <div class="container">
        <router-view /> <!-- 👈 this must exist -->
      </div>
    </v-main>
  </v-app>
</template>
