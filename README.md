# Liz - Anime & Manga Discovery Platform

Liz is a modern, responsive web application designed for anime and manga enthusiasts. It allows users to discover trending content, search with advanced filters, track their watching/reading progress, and manage custom lists. Built with performance and aesthetics in mind, Liz leverages the power of Vue 3, Supabase, and the AniList API.

## 🚀 Tech Stack

- **Framework:** [Vue 3](https://vuejs.org/) (Composition API, TypeScript)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Routing:** [Vue Router](https://router.vuejs.org/)
- **Backend / Database:** [Supabase](https://supabase.com/) (Auth & Postgres)
- **External API:** [AniList GraphQL API](https://anilist.co/)
- **Animations:** [GSAP](https://greensock.com/gsap/)
- **Icons:** [Lucide Vue Next](https://lucide.dev/)
- **HTTP Client:** [Axios](https://axios-http.com/)

## 📂 Project Structure

The project follows a modular and feature-based architecture:

```
src/
├── assets/          # Static assets (images, fonts)
├── components/      # Reusable UI components
│   ├── features/    # Feature-specific components (e.g., Filters, MediaActions)
│   ├── layout/      # Layout components (Navbar, Loader)
│   └── ui/          # Generic UI elements (Cards, Buttons, Selects)
├── composables/     # Shared logic (Vue Composables)
├── router/          # Route definitions and Auth Guards
├── services/        # API integration and "Mini-Backend" logic
│   ├── anilist.ts       # Anime data fetching
│   ├── anilist-manga.ts # Manga data fetching
│   ├── social.ts        # Social features (posts, comments, follows)
│   └── user-lists.ts    # Supabase database interactions
├── stores/          # Pinia state stores (Auth)
├── utils/           # Helper functions and configurations (Supabase client)
└── views/           # Main page views
    ├── anime/       # Anime details
    ├── auth/        # Login & Register
    ├── home/        # Anime discovery dashboard
    ├── landing/     # Landing page
    ├── manga/       # Manga discovery & details
    ├── social/      # Community feed & social features
    └── profile/     # User profile & list management
```

## 🌟 Features

### 1. Authentication & User Management

- **Supabase Auth:** Secure email/password login and registration.
- **Protected Routes:** Global navigation guards ensure only authenticated users access core features.
- **Profile Management:** Users can view their profile, avatar, and sign out.

### 2. Anime & Manga Discovery

- **Home Dashboard:** Curated lists for Popular, Trending, Recommended, and Upcoming anime.
- **Manga Section:** Dedicated view for Popular, Trending, and Top-Rated manga.
- **Advanced Search:**
  - Filter by Genre, Year, Season, Format, and Status.
  - Real-time search results.
  - "Clear Filters" functionality that intelligently resets the view.
- **Detailed Views:**
  - Comprehensive info (Synopsis, Score, Status, Episodes/Chapters).
  - Character lists with role details (Tap-to-reveal on mobile).
  - Related media (Prequels, Sequels, Adaptations).
  - Recommendations based on the current selection.

### 3. Personalization & Tracking

- **Custom Lists:** Users can create, edit, and delete custom lists (e.g., "Favorites", "To Watch with Friends").
- **Media Tracking:** Add anime/manga to standard lists (Planning, Watching, Completed, Dropped, Paused).
- **Supabase Integration:** All user data and lists are persisted in a Supabase Postgres database.

### 4. Lizbeth Chatbot 🌸

- **Interactive AI Persona:** A mobile-first chatbot named "Lizbeth" that provides personalized anime and manga recommendations.
- **Guided Conversation:** Uses a state machine flow (Greeting -> Type -> Genre -> Details) to understand user preferences.
- **Smart Recommendations:**
  - "Thinks" by searching based on user input first.
  - Falls back to broader genre searches if no specific match is found.
  - Fetches detailed media information for the final recommendation.
- **Minimalist UI:** Clean, monochrome design with subtle animations and a non-intrusive floating trigger.

### 5. Community & Social Feed 🌍

- **Social Feed:** A dynamic feed where users can share their thoughts, reviews, or just talk about anime/manga.
- **Create Posts:**
  - Users can create posts with a title and content.
  - **Image Uploads:** Support for uploading up to 4 images per post (powered by Cloudinary).
- **Interactive Posts:**
  - **Voting System:** Upvote/Downvote posts to bubble up the best content.
  - **Post Details:** Click on a post to view it in a dedicated modal with larger images and full content.
  - **Full Screen Images:** Click on any image to view it in full screen.
- **Comments & Discussions:**
  - **Comment on Posts:** Users can comment on any post to start discussions.
  - **Nested Replies:** Reply to comments with one level of nesting (like Twitter/X).
  - **Smart Loading:** Comments load 5 at a time with a "Load more" button.
  - **Real-time Counters:** See the number of comments on each post at a glance.
  - **Reply Threading:** View and collapse reply threads for better readability.
  - **Delete Comments:** Users can delete their own comments and replies.
- **User Interaction:**
  - Follow/Unfollow other users.
  - Search for other users to follow.
  - View followers and following lists in beautiful modals.
- **Profile Integration:**
  - **User Posts Tab:** View all posts from a specific user in their profile.
  - **Infinite Scroll:** Posts load automatically as you scroll (newest to oldest).
  - **Followers Display:** See who follows you and who you're following with interactive lists.
  - **Public Profiles:** View other users' profiles via `/profile/:userId` to see their posts and follow them.

### 6. Responsive Design & UX

- **Mobile-First:** Optimized layouts for mobile, tablet, and desktop.
- **Horizontal Carousels:** Swipeable lists for media items on mobile devices.
- **Adaptive Grids:** Responsive grid layouts for search results and desktop views.
- **Animations:** Smooth page transitions and scroll-triggered animations using GSAP.

## 🔧 Configuration & Setup

### Prerequisites

- Node.js (v20+)
- pnpm

### Environment Variables

Create a `.env` file in the root directory with the following credentials. You can use `.env.example` as a reference.

```env
# Supabase enviroment variables (Database)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key

# Chatbot enviroment variables (Lizbeth and her Prompt)
GEMINI_API_KEY=your_gemini_api_key
VITE_LIZBETH_SYSTEM_PROMPT="You are Lizbeth..."

# Cloudinary enviroment variables (Uploading images for posts)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret
```

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd liz
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Run Development Server:**

    ```bash
    pnpm run dev
    ```

4.  **Build for Production:**
    ```bash
    pnpm run build
    ```

## 🧠 "Mini-Backend" & Services

The `src/services` directory acts as an abstraction layer between the Vue components and external APIs/Databases.

- **`anilist.ts` & `anilist-manga.ts`**:

  - Handle GraphQL queries to AniList.
  - Transform raw API responses into typed interfaces (`Anime`, `Manga`).
  - Manage pagination and search logic.

- **`user-lists.ts`**:

  - Interacts directly with Supabase tables (`custom_lists`, `list_items`, `user_media`).
  - Provides methods for:
    - Creating/Deleting lists.
    - Adding/Removing items from lists.
    - Fetching user-specific media statuses.

- **`social.ts`**:
  - Manages all social features and community interactions.
  - **Posts Management:**
    - Create, fetch, and vote on posts.
    - Paginated post loading (10 per page).
    - User-specific post fetching for profiles.
  - **Comments System:**
    - Create, fetch, and delete comments.
    - Nested replies with one level of depth.
    - Paginated comment loading (5 per page).
    - Automatic comment counting per post.
  - **Social Interactions:**
    - Follow/Unfollow users.
    - Fetch followers and following lists.
    - Search for users by username.
    - Track follower/following counts.

## 🛡️ Routing

The application uses `vue-router` with the following structure:

- **Public:**
  - `/` (Landing Page)
  - `/login`
  - `/register`
- **Protected (Requires Auth):**
  - `/home` (Anime Dashboard)
  - `/manga` (Manga Dashboard)
  - `/anime/:id` (Anime Details)
  - `/manga/:id` (Manga Details)
  - `/profile` (User Profile & Lists)
  - `/profile/:userId` (View Other User's Profile)
  - `/social` (Community Feed & Social Interactions)

## ❗️ 404 - Not Found

If a user navigates to an undefined route, the application displays a friendly 404 page informing them that the requested page does not exist. This page is defined in `src/views/NotFound.vue` and is registered in the router as a catch‑all route:

```ts
{
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/views/NotFound.vue')
}
```

The 404 view provides a link back to the home page and maintains the app’s dark/light theme.

## 🎨 Styling System

- **Tailwind CSS 4:** Used for utility-first styling.
- **Custom Tokens:** Extended color palette and typography in `main.css`.
- **Responsive Breakpoints:**
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
- **Dark Mode:** The UI is designed with a clean, light/dark aesthetic (currently optimized for a modern light theme with dark accents).

## 🗄️ Database Schema

The application uses Supabase (PostgreSQL) with the following key tables:

### Social Features Tables

- **`posts`**
  - Stores user-created posts with title, content, and images.
  - Includes vote counts and timestamps.
- **`post_votes`**
  - Tracks upvotes/downvotes on posts.
  - One vote per user per post.
- **`post_comments`**
  - Stores comments and replies on posts.
  - **Nested Structure:** `parent_comment_id` enables one level of reply threading.
  - **Auto-counting:** `replies_count` field updated via database triggers.
- **`follows`**
  - Manages follower/following relationships.
  - Enables social graph features.

### User & List Tables

- **`profiles`**
  - Extended user information (username, avatar, follower counts).
  - Linked to Supabase Auth users.
- **`custom_lists`**
  - User-created custom lists for organizing anime/manga.
- **`list_items`**
  - Items within custom lists.
- **`user_media`**
  - Tracks user's anime/manga status (Watching, Completed, etc.).

### Database Features

- **Row Level Security (RLS):** All tables have policies ensuring users can only modify their own data.
- **Foreign Key Constraints:** Maintain data integrity across relationships.
- **Triggers & Functions:** Automatic counter updates for replies and followers.
- **Indexes:** Optimized queries for comments, votes, and follows.

---

_Built with ❤️ by Frysccou_
