# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Type-check (vue-tsc) then production build
npm run preview    # Preview production build locally
```

No test runner is configured. No lint script is defined in package.json, but ESLint + Prettier are installed as dev dependencies.

## Architecture Overview

**Stack:** Vue 3 (Composition API) + TypeScript (strict) + Vite + Vuetify 3 + Pinia

### Project Layout

- `src/api/` — Axios HTTP client (`http.ts`) and endpoint modules (`modules/*.api.ts`). The Axios instance auto-injects Keycloak Bearer tokens via request interceptor.
- `src/plugins/` — Keycloak authentication (`keycloak.ts`) and Vuetify setup (`vuetify.ts`).
- `src/router/` — Vue Router with two layout groups: public routes use `PublicLayout`, admin routes use `AdminLayout` with `requireAuth` guard.
- `src/stores/` — Pinia stores. `auth.ts` exists but Keycloak handles actual authentication.
- `src/pages/` — Route-level page components, with admin pages under `pages/Admin/`.
- `src/components/` — Shared UI components (`AppNavBar`, `AppFooter`, etc.).
- `src/i18n/` — Vue-i18n with Persian (`fa`) as default locale and English (`en`) fallback.
- `src/types/` — TypeScript interfaces. `common.ts` has `Paged<T>` generic; most type files are stubs.
- `src/layouts/` — `PublicLayout.vue` (navbar + footer) and `AdminLayout.vue` (app bar + nav drawer).

### Path Alias

`@/` resolves to `./src` (configured in both Vite and tsconfig).

### Authentication

Keycloak (OpenID Connect) via `keycloak-js`. Key exports from `src/plugins/keycloak.ts`:
- `keycloak` — Keycloak instance
- `isAuthenticated` — reactive ref
- `hasAdminRole` — checks for "Admin" resource role on client `imagegallery-frontend`
- `initializeKeycloak()` — called at app startup with `check-sso`

Route guard in `router/index.ts` enforces auth + Admin role for `/admin/*` routes.

### API Layer

All API modules return data wrapped in `{ valueOrDefault: T }` from the backend. Images are uploaded and stored as base64 strings. API modules: `images`, `categories`, `comments`, `services`, `aboutus`, `auth`.

### Environment Variables

Defined in `.env` with `VITE_` prefix:
- `VITE_API_BASE_URL` — Backend API base URL
- `VITE_KEYCLOAK_URL`, `VITE_KEYCLOAK_REALM`, `VITE_KEYCLOAK_CLIENT_ID` — Keycloak config
- `VITE_LOCALE_DEFAULT` — Default locale (`fa`)
- `VITE_RTL` — RTL layout toggle (`true`)

### Styling

Vuetify 3 (Material Design) is the primary UI framework. Global styles in `src/styles/main.css`. RTL is enabled by default for Persian language support. Icons use `@mdi/js` and `@mdi/font`.
