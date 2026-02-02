# TDD Implementation Plan for Dinnery Backend

This plan outlines the approach to implementing backend features using Test Driven Development (TDD). 
For each feature found in `use_cases.md`, we will follow a strict "Red-Green-Refactor" cycle using End-to-End (E2E) tests.

**Workflow for each feature:**
1.  **Red:** Write a failing E2E test in `test/` (e.g., `recipes.e2e-spec.ts`) that defines the expected API behavior (inputs, outputs, status codes).
2.  **Green:** Implement the necessary code in the backend (Controller, Service, Entity) to make the test pass.
3.  **Refactor:** Clean up code, optimize, and ensure no regressions.

---

## 1. Recipe Discovery & Search

### 1.1. Main Page List (Use Case 1)
-   **Goal:** Retrieve paginated/popular recipes with metadata (time, likes, comments).
-   **Test:** `OFFSET /recipes` or plain `GET /recipes` checks for specific fields in response.
-   **Current Status:** 🟢 Completed.

### 1.2. Search by Name (Use Case 2)
-   **Goal:** Search recipes by fuzzy name matching.
-   **Test:** `GET /recipes/search?name=pasta` returns only matching items.
-   **Current Status:** 🟢 Completed.

### 1.3. Search by Ingredients (Use Case 3)
-   **Goal:** Find recipes containing specific ingredient IDs/names.
-   **Test:** `POST /recipes/search/ingredients` (or GET with complex query) sending `['tomato', 'cheese']`.
-   **API:** `POST /recipes/search/ingredients`.
-   Contains selection; 1. selected ingredients are included in the recipe. 2. no other ingredients are included in the recipe.
- sorting: fetched recipes are sorted by the number of matching ingredients in descending order. when the number of matching ingredients is the same, the recipes are sorted by the number of likes + comments + forks in descending order.
-   **Current Status:** 🔴 Not Implemented.

### 1.4. Filter by Category (Use Case 9)
-   **Goal:** Filter recipes by strict category match.
-   **Test:** `GET /recipes/search?category=Dinner` returns only 'Dinner' category items.
-   **Current Status:** 🟢 Completed.

---

## 2. Recipe Management

### 2.1. Create Recipe (Use Case 4)
-   **Goal:** Authenticated user creates a full recipe with ingredients and instructions.
-   **Test:** `POST /recipes` with bearer token. Verify DB persistence and foreign keys.
-   **Current Status:** 🟢 Completed. Needs validation review.

### 2.2. Fork Recipe (Use Case 5)
-   **Goal:** Copy an existing recipe to the current user's library, linking to the original.
-   **Test:** `POST /recipes/:id/fork` with bearer token.
    -   Assert response has new ID.
    -   Assert response `original_recipe_id` matches user input.
    -   Assert `owner` is the current user.
-   **Current Status:** 🟢 Completed.

### 2.3. Edit/Delete Own Recipe (Use Case 4, 11)
-   **Goal:** Modify or remove a recipe. Ensure users cannot edit others' recipes.
-   **Test:** 
    -   `PATCH /recipes/:id` (Success for owner).
    -   `PATCH /recipes/:id` (403 Forbidden for non-owner).
    -   `DELETE /recipes/:id` (Success for owner).
-   **Current Status:** 🟢 Completed.

---

## 3. User & Social

### 3.1. User Registration & Login (Use Case 6)
-   **Goal:** Sign up and obtain JWT token.
-   **Test:** 
    -   `POST /auth/signup` -> 201 Created.
    -   `POST /auth/login` -> 200 OK & returns `{ accessToken: ... }`.
-   **Current Status:** 🟢 **Completed** 

### 3.2. User Profile / My Recipes (Use Case 7)
-   **Goal:** Get current user's created and forked recipes.
-   **Test:** `GET /users/me/recipes` or `GET /recipes/user/:userId`.
-   **Current Status:** 🟢 Completed.

### 3.3. Social Interactions (Use Case 10)
-   **Goal:** Like and key-value comment on recipes.
-   **Test:**
    -   `POST /recipes/:id/like` -> Increment count.
    -   `POST /recipes/:id/comments` -> Add comment.
    -   `GET /recipes/:id` -> Include 'likes' count and 'comments' list.
-   **Current Status:** 🟢 **Completed** 

---

## 4. Permissions (Use Case 11)

### 4.1. Role Guard Tests
-   **Goal:** Ensure guests cannot access protected routes.
-   **Test:** Attempt `POST /recipes`, `POST /fork`, `POST /like` without token -> Expect 401 Unauthorized.
-   **Current Status:** 🟢 Completed.



🟢 Completed:
Search by Name
Filter by Category
Create Recipe
Fork Recipe
Recipe Detailed View
Permissions / Role Guards
Edit / Delete Own Recipe
User Registration & Login
Social Interactions (Likes/Comments)
User Profile / My Recipes (Missing me endpoint, full profile view)
🟡 Partially Implemented:
Main Page List (Basic list exists, missing metadata/sorting)
🔴 Not Implemented:
Search by Ingredients