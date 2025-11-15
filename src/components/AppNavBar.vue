<script setup lang="ts">
import { keycloak, isAuthenticated, username, hasAdminRole } from "../plugins/keycloak";
import { useRouter } from "vue-router";

const router = useRouter();

function login() {
  keycloak.login({ redirectUri: window.location.origin });
}

function logout() {
  keycloak.logout({ redirectUri: window.location.origin });
}
</script>

<template>
  <header class="navbar">

    <div class="left">
      <span class="logo">ImageGallery</span>
    </div>

    <div class="center">
      <router-link class="nav-item" to="/">Home</router-link>
      <router-link class="nav-item" to="/gallery">Gallery</router-link>
      <router-link class="nav-item" to="/categories">Categories</router-link>
      <router-link class="nav-item" to="/services">Services</router-link>
      <router-link class="nav-item" to="/about">About</router-link>

      <!-- Only show Admin if user has Admin role -->
      <router-link
        v-if="isAuthenticated && hasAdminRole"
        class="nav-item"
        to="/admin"
      >
        Admin Panel
      </router-link>
    </div>

    <div class="right">
      <!-- If logged in show welcome -->
      <span v-if="isAuthenticated" class="welcome">
        Welcome, {{ username }}
      </span>

      <!-- Login / Logout -->
      <v-btn v-if="!isAuthenticated" @click="login" color="primary" variant="outlined">
        Login
      </v-btn>

      <v-btn v-else @click="logout" color="error" variant="outlined">
        Logout
      </v-btn>
    </div>

  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 15px 25px;
  align-items: center;
}

.nav-item {
  margin: 0 10px;
  text-decoration: none;
  font-weight: 600;
}

.welcome {
  font-weight: 600;
  margin-right: 15px;
}
</style>
