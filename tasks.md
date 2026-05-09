# Tasks

## API Gaps

- [x] **Images API bug** — Fixed `getById` endpoint (`/images/${id}`); added `update(id, description)` and `delete(id)` with placeholder endpoints (confirm real endpoints with backend)
- [x] **Comments API** — `add()` was fine; fixed the call site in `ImageDetails.vue`
- [x] **About API** — Wired `AboutUsApi.get()` into `About.vue` and new Admin About page
- [ ] **Images API endpoints** — Confirm real endpoints for `GET /images/:id`, `PUT /images/:id`, `DELETE /images/:id` with backend team

## Admin Pages

- [x] **Admin Images** — Added edit dialog (description) and delete button; wired to `ImagesApi.update/delete`
- [x] **Admin Dashboard** — Now shows live counts for categories and services
- [x] **Admin About** — New page at `/admin/about` with edit form for title, description, email, phone, location

## Public Pages

- [x] **About.vue** — Now fetches from `AboutUsApi.get()`; graceful fallback on error
- [x] **ImageDetails.vue bug** — Fixed `CommentsApi.add` argument mismatch
- [ ] **Home.vue** — Currently just a welcome string with no real content

## Type Definitions

- [x] **category.ts** — `Category { id, title, description? }`
- [x] **comment.ts** — `Comment { id, imageId, subject, body, createdAt? }`
- [x] **service.ts** — `Service { id, title, description?, price, logo? }`
- [x] **user.ts** — `User { id, username, email? }`
- [x] **image.ts** — Fixed: `id: string`, `content: string` (base64), removed stale fields

## Build Fixes (pre-existing errors now resolved)

- [x] `services.api.ts` — Fixed `split(',')[1]` returning `string | undefined`
- [x] `Gallery.vue` — Fixed nested double quotes in template, typed map callback, removed unused `openImage`
- [x] `PublicLayout.vue` — Fixed `@/` imports → relative imports
- [x] `AppNavBar.vue` — Removed unused `router` import
- [x] `router/index.ts` — Added proper types to `requireAuth` guard parameters
- [x] `admin/Categories.vue` — Guarded `id` before passing to `update/remove`
- [x] `admin/Services.vue` — Fixed `description` optional → required with `?? ''`
- [x] `src/types/modules.d.ts` — Added `declare module 'vuetify/styles'`

## Components

- [ ] **ImageCard.vue** — Empty file (0 bytes), could be a reusable card for gallery
- [ ] **Pagination.vue** — Empty file (0 bytes), needed when paginated endpoints are used

## i18n

- [ ] **Translation coverage** — Only nav labels are translated; all form labels, button text, errors, page titles are hardcoded in English

## Cleanup

- [ ] **Auth store** (`src/stores/auth.ts`) — Redundant since Keycloak handles auth. Remove or repurpose
- [ ] **Login.vue** — Uses old auth store instead of Keycloak redirect. Remove or rewire
- [ ] **HelloWorld.vue** — Unused example component. Remove
