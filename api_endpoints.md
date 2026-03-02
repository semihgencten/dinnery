# Backend API Endpoints

## Auth (`/auth`)
- `POST /auth/register` - Register a new user
  - **Req**: `UserRegisterRequestDto`
  - **Res**: `UserRegisterResponseDto`
- `POST /auth/login` - Login user
  - **Req**: `UserLoginRequestDto`
  - **Res**: `UserLoginResponseDto`
- `POST /auth/refresh` - Refresh authentication token
  - **Req**: `UserRefreshTokenRequestDto`
  - **Res**: `UserRefreshTokenResponseDto`

## Users (`/users`)
- `GET /users/me` - Get current user profile (Auth required)
  - **Res**: `UserGetProfileResponseDto`
- `PATCH /users/me` - Update current user profile (Auth required)
  - **Req**: `UserUpdateProfileRequestDto`
  - **Res**: `UserUpdateProfileResponseDto`
- `GET /users` - Get all users
  - **Res**: `UserGetAllResponseDto[]`
- `GET /users/:id` - Get user by ID
  - **Res**: `UserGetResponseDto`

## Recipes (`/recipes`)
- `POST /recipes` - Create a new recipe (Auth required)
  - **Req**: `RecipeCreateRequestDto`
  - **Res**: `RecipeCreateResponseDto`
- `GET /recipes` - Get all recipes (supports `offset`, `limit`)
  - **Res**: `RecipeGetAllResponseDto[]`
- `GET /recipes/:id` - Get recipe by ID
  - **Res**: `RecipeGetResponseDto`
- `PATCH /recipes/:id` - Update a recipe (Auth required)
  - **Req**: `RecipeUpdateRequestDto`
  - **Res**: `RecipeUpdateResponseDto`
- `DELETE /recipes/:id` - Delete a recipe (Auth required)
- `GET /recipes/search` - Search recipes by query `name` or `category`
  - **Res**: `RecipeSearchResponseDto[]`
- `POST /recipes/search/ingredients` - Search recipes by a list of ingredients
  - **Req**: `RecipeSearchByIngredientsRequestDto`
  - **Res**: `RecipeSearchByIngredientsResponseDto[]`
- `GET /recipes/user/:userId` - Get recipes by user and role via `?role=` (e.g., author, saved)
  - **Res**: `RecipeGetByUserResponseDto[]`
- `POST /recipes/:id/fork` - Fork a recipe (Auth required)
  - **Res**: `RecipeForkResponseDto`
- `POST /recipes/:id/save` - Save a recipe to a collection (Auth required, body: `{ collection }`)
  - **Req**: `RecipeSaveRequestDto`
  - **Res**: `RecipeSaveResponseDto`
- `DELETE /recipes/:id/save` - Unsave a recipe from a collection (Auth required, query: `?collection=`)
  - **Res**: `RecipeUnsaveResponseDto`
- `POST /recipes/:id/like` - Toggle like for a recipe (Auth required)
  - **Res**: `RecipeToggleLikeResponseDto`
- `POST /recipes/:id/comments` - Add a comment to a recipe (Auth required)
  - **Req**: `RecipeAddCommentRequestDto`
  - **Res**: `RecipeAddCommentResponseDto`
- `GET /recipes/:id/comments` - Get comments for a recipe
  - **Res**: `RecipeGetCommentsResponseDto[]`

## Ingredients (`/ingredients`)
- `POST /ingredients` - Create a new ingredient
  - **Req**: `IngredientCreateRequestDto`
  - **Res**: `IngredientCreateResponseDto`
- `GET /ingredients/search` - Search ingredients by query `?term=`
  - **Res**: `IngredientSearchResponseDto[]`
- `GET /ingredients/:id` - Get ingredient by ID
  - **Res**: `IngredientGetResponseDto`

## Cloudinary (`/cloudinary`)
- `POST /cloudinary/signature` - Get Cloudinary upload signature for media uploads (Auth required)
  - **Res**: `CloudinaryGetSignatureResponseDto`

---

# Missing Endpoints & Features

Based on the analysis of the current API endpoints, here are potential missing features that might be needed for a fully functional recipe mobile app:

### 1. Comments Management
- `DELETE /recipes/:id/comments/:commentId` - No way for users to delete their own comments.
- `PATCH /recipes/:id/comments/:commentId` - No way for users to edit their comments.

### 2. Pagination & Sorting
- **Search Endpoints**: `GET /recipes/search` and `POST /recipes/search/ingredients` lack pagination (`limit` and `offset` queries). This could lead to massive payloads and slow UI if the database grows.
- **Ingredients**: `GET /ingredients/search` lacks pagination.
- **Comments**: `GET /recipes/:id/comments` lacks pagination.
- **Sorting**: No explicit parameters to sort endpoints (e.g., sort recipes by `newest`, `most_liked`, or `top_rated`).

### 3. Account Management & Security
- **Forgot / Reset Password**: Missing completely. Needs `POST /auth/forgot-password` and `POST /auth/reset-password`.
- **Email Verification**: No endpoint to trigger or verify user email address after registration.

### 4. Ingredients Management
- `PATCH /ingredients/:id` - No endpoint to update existing ingredients (e.g., to fix a typo or update category).
- `DELETE /ingredients/:id` - No endpoint to remove unused or duplicate ingredients.

### 5. Collections
- `GET /users/me/collections` - Currently, saving a recipe takes a `collection` string, but there is no endpoint to list all unique collections a user has created. It makes it hard to populate a dropdown selector on the mobile UI.

### 6. Social Features (Optional depending on scope)
- **Followers/Following**: `POST /users/:id/follow` to follow other creators and a dedicated 'Feed' endpoint `GET /users/me/feed` to view recipes from followed users.

### 7. Recipe Ratings
- While there is a like toggle (`POST /recipes/:id/like`), a 1-5 star rating system is standard for recipe apps.
