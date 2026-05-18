import { createRouter, createWebHistory, type RouteLocationNormalized, type NavigationGuardNext } from "vue-router";
import { keycloak } from "../plugins/keycloak";

const PublicLayout = () => import("../layouts/PublicLayout.vue");
const AdminLayout = () => import("../layouts/AdminLayout.vue");

function requireAuth(to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) {
  if (!keycloak.authenticated) {
    return keycloak.login({
      redirectUri: window.location.origin + to.fullPath,
    });
  }

  const isAdmin = keycloak.hasResourceRole("Admin", "imagegallery-frontend");
  if (to.path.startsWith("/admin") && !isAdmin) {
    return next("/");
  }

  next();
}

const routes = [
  {
    path: "/",
    component: PublicLayout,
    meta: { breadcrumb: "breadcrumbs.home" },
    children: [
      { path: "", name: "home", meta: { breadcrumb: "breadcrumbs.home" }, component: () => import("../pages/Home.vue") },
      { path: "gallery", name: "gallery", meta: { breadcrumb: "breadcrumbs.gallery" }, component: () => import("../pages/Gallery.vue") },
      { path: "categories", name: "categories", meta: { breadcrumb: "breadcrumbs.categories" }, component: () => import("../pages/Categories.vue") },
      { path: "services", name: "services", meta: { breadcrumb: "breadcrumbs.services" }, component: () => import("../pages/Services.vue") },
      { path: "about", name: "about", meta: { breadcrumb: "breadcrumbs.about" }, component: () => import("../pages/About.vue") },
      { path: "register", name: "register", meta: { breadcrumb: "breadcrumbs.register" }, component: () => import("../pages/Register.vue") },
      { path: "image/:id", name: "image.details", meta: { breadcrumb: "breadcrumbs.imageDetails" }, component: () => import("../pages/ImageDetails.vue") },
    ],
  },

  {
    path: "/admin",
    component: AdminLayout,
    beforeEnter: requireAuth,
    meta: { breadcrumb: "breadcrumbs.admin" },
    children: [
      { path: "", name: "admin.dashboard", meta: { breadcrumb: "breadcrumbs.dashboard" }, component: () => import("../pages/admin/Dashboard.vue") },
      { path: "images", name: "admin.images", meta: { breadcrumb: "breadcrumbs.images" }, component: () => import("../pages/admin/Images.vue") },
      { path: "categories", name: "admin.categories", meta: { breadcrumb: "breadcrumbs.categories" }, component: () => import("../pages/admin/Categories.vue") },
      { path: "services", name: "admin.services", meta: { breadcrumb: "breadcrumbs.services" }, component: () => import("../pages/admin/Services.vue") },
      { path: "comments", name: "admin.comments", meta: { breadcrumb: "breadcrumbs.comments" }, component: () => import("../pages/admin/Comments.vue") },
      { path: "about", name: "admin.about", meta: { breadcrumb: "breadcrumbs.about" }, component: () => import("../pages/admin/About.vue") },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
