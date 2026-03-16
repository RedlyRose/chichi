# 🗺️ ChichiPage: Comprehensive Cloudflare-Native Roadmap

This roadmap details the end-to-end development of the **ChichiPage** dashboard builder. It is designed specifically to run inside the **Cloudflare Ecosystem (Pages, D1 SQL Database, and R2 Object Storage)** for maximum edge-rendering performance, infinite scalability, and low latency.

---

## 🏗️ Tech Stack & Infrastructure
*   **Framework**: **Astro** (using `@astrojs/cloudflare` for SSR and D1/R2 mappings).
*   **Editor Layer**: **React** or **Vue** inside an Astro Island window setup.
*   **Database**: **Cloudflare D1** (Serverless SQL for saving user accounts & layout JSON).
*   **Storage**: **Cloudflare R2** (For background art, custom SVGs, avatars).
*   **Framework Styles**: Tailwind CSS + `lucide-react` + Glassmorphism triggers (`backdrop-filter`).

---

## 📍 Phase 1: Environment & Full-Stack Cloudflare Setup
- [ ] **1.1. Project Initialization**
  - Setup an **Astro** workspace configured with `@astrojs/cloudflare` adapters and SSR support.
- [ ] **1.2. Cloudflare Bindings Setup (`wrangler.toml`)**
  - Initialize a local **D1 Database** binding (`DB`).
  - Initialize a local **R2 Bucket** binding (`IMAGES_BUCKET`) for assets.
- [ ] **1.3. Backend schema design (D1 Migration)**
  - Create table structures:
    - `users`: `id`, `email`, `role`, `created_at`.
    - `pages`: `id`, `user_id`, `slug` (unique), `title`, `nav_style`, `bg_url`, `created_at`.
    - `widgets`: `id`, `page_id`, `type`, `grid_x`, `grid_y`, `grid_w`, `grid_h`, `config_json` (JSON layout metadata).=

---

## 🎨 Phase 2: The Drag-and-Drop Editor (Frontend)
- [ ] **2.1. Canvas Workspace Skeleton**
  - Integrate **`react-grid-layout`** or similar.
  - Render a locked multi-column grid that acts as the canvas.
  - Enable handles for dragging (`item[isDraggable]`) and resizing (`item[isResizable]`).
- [ ] **2.2. Global Customizer Sidebar**
  - Controls to adjust **overall canvas settings**:
    - Background Image, Background Blur, Background Tint Color (`rgba overlay`).
    - Standard card settings (Global Corner Radius, Glow strength).
- [ ] **2.3. Dashboard View vs Preview View**
  - Build a toggle module that disables dragging/sizing grips to let the user review the live output directly on the canvas space.

---

## 🧩 Phase 3: The Dashboard API & Database Sync (D1 + R2)
- [ ] **3.1. D1 Saving Endpoint (`/api/save`)**
  - Endpoint to update a page's configuration bundle. 
  - Validates `slug` claims so users can secure routes like `chichipage.com/mizu-portfolio`.
- [ ] **3.2. Presigned R2 Upload Route (`/api/upload`)**
  - Implement AWS S3 SDK for Cloudflare R2 compatibility.
  - Users drop down images $\rightarrow$ app fetches presigned URL $\rightarrow$ Uploads directly to R2 bucket.
  - Returns access URL (`bucket-public.chichipage.com/image.png`).

---

## 📡 Phase 4: Full Integrated Widget Development
- [ ] **4.1. Core Static Cards**
  - **ProfileCard**: Avatar layout, custom titles with animation support.
  - **Link/Social Grid**: Simple icon buckets with smart hover styles.
  - **Analog Clock**: Uses CSS variables rotation mappings calculated client-side.
- [ ] **4.2. Cloudflare Workers Proxy (Dynamic Cards support)**
  - Since standard fetch directly crashes CORS on third parties, create wrapper edge functions:
    - `/api/presence/discord/:id`: Wrapper linking Lanyard API triggers.
    - `/api/stats/github/:username`: Scrapes/fetches commit graphs safely.
    - `/api/stats/anilist/:id`: Wrapper hitting AniList GraphQL endpoints.

---

## 🚀 Phase 5: Routing & Edge Side Rendering (The Live Viewer)
- [ ] **5.1. Dynamic Route matching**
  - Setup route `/[slug]` (e.g., `/mizu`).
  - Uses Cloudflare edge handler to read D1: `SELECT * FROM pages WHERE slug = 'mizu'`.
- [ ] **5.2. Server-Side Edge Rendering (SSR)**
  - On access, D1 pulls JSON of card arrays.
  - Server translates grid coords to absolute layout styles standard layout flow and drops hydration scripts.
  - Results in **Sub-50ms** loading times globally directly over Cloudflare Edge node caches.

---

## 🔑 Phase 6: Auth, SaaS Security, & Limits
- [ ] **6.1. Turnstile (Bot protection)**
  - Integrate Cloudflare Turnstile to verify genuine creators on signups.
- [ ] **6.2. Authentication framework**
  - Connect **NextAuth** (running edge-compatible adapters to D1) or **Supabase Auth** / **Clerk**.
- [ ] **6.3. Resource Limits**
  - Limit free tiers (D1 rows) to 1 page, 10 images limit uploads trigger warnings.

---

## 💰 Phase 7: Landing, Stripe, & Launch
- [ ] **7.1. Aesthetic Landing page layout**
  - Display standard gorgeous preview templates.
- [ ] **7.2. Payment processor**
  - Setup Stripe Webhooks triggers update D1 role column to `tier: 'pro'`.
- [ ] **7.3. Custom Domains bundle (Optional future setup)**
  - Setup Cloudflare for SaaS custom domain DNS triggers.

---

We need to initialize the project bundle setup for Cloudflare. 
**Initialize using Astro with Wrangler config bindings to test locally first (Miniflare adapter runtimes).**
