// router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import { keycloak } from "../plugins/keycloak";

const PublicLayout = () => import("../layouts/PublicLayout.vue");
const AdminLayout = () => import("../layouts/AdminLayout.vue");

function requireAuth(to, from, next) {
  // not logged in → redirect to login
  if (!keycloak.authenticated) {
    return keycloak.login({
      redirectUri: window.location.origin + to.fullPath,
    });
  }

  // CHECK ADMIN ROLE
  const isAdmin = keycloak.hasResourceRole("Admin", "imagegallery-frontend");

  if (to.path.startsWith("/admin") && !isAdmin) {
    return next("/"); // send them home if not admin
  }

  next();
}

const routes = [
  {
    path: "/",
    component: PublicLayout,
    children: [
      { path: "", name: "home", component: () => import("../pages/Home.vue") },
      { path: "gallery", name: "gallery", component: () => import("../pages/Gallery.vue") },
      { path: "categories", name: "categories", component: () => import("../pages/Categories.vue") },
      { path: "services", name: "services", component: () => import("../pages/Services.vue") },
      { path: "about", name: "about", component: () => import("../pages/About.vue") },
    ],
  },

  {
    path: "/admin",
    component: AdminLayout,
    beforeEnter: requireAuth,
    children: [
      { path: "", name: "admin.dashboard", component: () => import("../pages/admin/Dashboard.vue") },
      { path: "images", name: "admin.images", component: () => import("../pages/admin/Images.vue") },
      { path: "categories", name: "admin.categories", component: () => import("../pages/admin/Categories.vue") },
      { path: "services", name: "admin.services", component: () => import("../pages/admin/Services.vue") },
      { path: "comments", name: "admin.comments", component: () => import("../pages/admin/Comments.vue") },
    ],
  },

  {
    path: "/image/:id",
    name: "image.details",
    component: () => import("../pages/ImageDetails.vue"),
  }
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
