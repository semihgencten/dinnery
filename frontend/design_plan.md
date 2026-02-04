# Dinnery Frontend Design Plan

This document outlines the structure, pages, and features for the Dinnery frontend application, based on the backed implementation plan and use cases.

## Design Philosophy
- **Aesthetic:** Modern, premium feel with vibrant colors, glassmorphism, and smooth animations.
- **Library:** React (likely via Next.js or Vite as per tech stack preferences).
- **Styling:** Vanilla CSS or scoped CSS modules for maximum control, focusing on responsive design.

---

## 1. Public / Common Pages

### 1.1. Home Page (Recipe Discovery)
- **Route:** `/`
- **Goal:** Landing page for visitors and users to discover recipes.
- **Features:**
  - **Hero Section:** fast/catchy welcome message or featured recipe.
  - **Search Bar:** Prominent input for search by name.
  - **Category Filters:** Horizontal scroll or pill selection for categories (Dinner, Vegan, Dessert, etc.).
  - **Recipe Grid/List:**
    - Cards showing: Cover Image, Title, Category pill, Prep/Cook time, Like count, Comment count, Author avatar (small).
    - Infinite scroll or pagination (matches backend `OFFSET`).
- **Use Cases:** 1, 2, 10

### 1.2. Recipe Detail Page
- **Route:** `/recipes/:id`
- **Goal:** View full details of a specific recipe.
- **Features:**
  - **Header:** Large cover image, Title, Author with link to profile, "Like" button (interactive), "Fork" button (if logged in & not owner), "Edit" button (if owner).
  - **Meta Info:** Prep time, Cook time, Servings, Category.
  - **Ingredients List:** Checkable list (for user convenience while cooking), quantities, units.
  - **Instructions:** Step-by-step numbers.
  - **Comments Section:** List of existing comments + Input form for new comment (if logged in).
- **Use Cases:** 1, 9, 5, 11

### 1.3. Search / Advanced Search Page
- **Route:** `/search`
- **Goal:** Advanced filtering, specifically by ingredients.
- **Features:**
  - **Search Input:** Keyword search (syncs with query params).
  - **Ingredient Filter:** Multi-select dropdown or tag input to select ingredients (e.g., "Tomato", "Cheese").
    - Integration with `POST /recipes/search/ingredients`.
  - **Results Grid:** Same component as Home Page.
- **Use Cases:** 3

---

## 2. Authentication Pages

### 2.1. Login Page
- **Route:** `/login`
- **Features:**
  - Email/Username & Password form.
  - "Don't have an account? Sign up" link.
  - Redirect to previous page or Home on success.
- **Use Cases:** 6

### 2.2. Signup Page
- **Route:** `/signup`
- **Features:**
  - Form: Username, Email, Password, Full Name, Country.
  - Validation feedback.
  - Auto-login or redirect to login upon success.
- **Use Cases:** 6

---

## 3. User Protected Pages (Requires Auth)

### 3.1. User Profile / Dashboard
- **Route:** `/profile` (or `/users/:id`)
- **Goal:** Manage user's personal library.
- **Features:**
  - **User Info:** Avatar, Name, Bio (optional), "Edit Profile" button.
  - **Tabs:**
    - **My Recipes:** List of recipes created by the user.
    - **Forked/Saved:** List of recipes forked from others.
  - **Actions:** Edit/Delete buttons on own recipes cards.
- **Use Cases:** 7, 8

### 3.2. Create Recipe Page
- **Route:** `/create-recipe`
- **Goal:** Author a new recipe.
- **Features:**
  - **Form:**
    - Basic Info: Title, Description, Category (dropdown), Times (Prep/Cook), Servings.
    - **Dynamic Ingredients List:** Add row button. Each row has Search Ingredient (autocomplete), Quantity, Unit, Note.
    - **Instructions:** Text area or dynamic list of steps.
    - **Image Upload:** File input or URL field for cover photo.
  - **Submit Action:** `POST /recipes`.
- **Use Cases:** 4

### 3.3. Edit Recipe Page
- **Route:** `/recipes/:id/edit`
- **Goal:** Update an existing recipe (own) or finalize a fork.
- **Features:**
  - Pre-filled form (same components as Create Recipe).
  - If it's a **Fork** flow:
    - Pre-fill with original recipe data.
    - Show "Original Recipe: [Link]" reference.
    - Save action creates NEW recipe (`POST /fork` logic or `POST` then edit). *Note: Backend flow says `POST /fork` creates it immediately, then user edits. So this page edits the NEWLY created fork.*
- **Use Cases:** 4, 5, 8

---

## 4. Components / Design System Standards

### 4.1. Core Components
- **Button:** Primary, Secondary, Ghost, Danger variants.
- **Input:** Text, Number, Textarea, Select with standardized styling.
- **Card:** Base container for recipes.
- **Badge/Pill:** For categories and tags.
- **Modal:** For confirmations (e.g., "Are you sure you want to delete?").

### 4.2. Layout
- **Navbar:** Sticky top. Logo, Search (shrunk version), Links (Home, Search), Auth Buttons (Login/Signup OR Avatar/Profile Menu).
- **Footer:** Simple links.
- **Responsive:** Mobile-first approach. Grid layouts for standard desktop views, stacked for mobile.

### 4.3. Styling Conventions (Strict)
This project adheres to a strict design system to ensure consistency and scalability.

1.  **CSS Variables (`index.css` is the Source of Truth):**
    -   NEVER hardcode hex colors, spacing values, or font sizes in component CSS.
    -   Always use the defined CSS variables (e.g., `var(--primary-color)`, `var(--space-4)`, `var(--font-lg)`).

2.  **Units (No Pixels):**
    -   **REM/EM Only:** Do strictly NOT use `px` for layouts, padding, margins, or font sizes.
    -   **Base:** The system assumes a standard root font size (16px default), where `1rem = 16px`.
    -   **Borders:** Use `0.0625rem` for 1px borders.
    -   **Media Queries:** Use `em` for media query breakpoints (e.g., `max-width: 48em` for 768px).

3.  **Spacing Scale:**
    -   Use the `--space-*` scale for all padding, margin, and gap values.
    -   The scale is based on a 4px (0.25rem) grid:
        -   `--space-1`: 0.25rem (4px)
        -   ...
        -   `--space-4`: 1rem (16px)
        -   ...
        -   `--space-8`: 2rem (32px)

4.  **Typography:**
    -   Use the `--font-*` scale for all text sizing.
    -   `--font-base` (1rem) is the body copy size.
    -   Headings should scale up from there (e.g., `--font-2xl`, `--font-4xl`).

5.  **Breakpoints:**
    -   Mobile: `30em` (480px)
    -   Tablet: `48em` (768px)
    -   Desktop: `64em` (1024px)
