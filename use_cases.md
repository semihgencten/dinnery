A. Base flows and cases

user -> user with an account and signed in currently
visitor -> user with no account signed in currently

1.  🟢 **Completed** - visitor or user (w) enters the main page, see some popular recipes in a list. see their picture, name, category, cook time, like and comment counts of each of them
    user clicks one recipe, goes to the recipe landing page (or recipe detail page, name can change).
    
2.  🟢 **Completed** - visitor or user clicks to search bar in the main page (or landing page consider the name). enters a word or words to search by recipe name
    user hits enter button or clicks search sign. 
    see the list of recipes that matches name
    
3.  🔴 **Not Implemented** - search with ingredients.
    visitor or user clicks "search by ingredients" filter.
    user selects one or multiple ingredients from a dropdown or search input.
    user hits search.
    user sees a list of recipes that contain the selected ingredients.

4.  🟢 **Completed** - user creates a recipe
    user navigates to "Create Recipe" page.
    user enters recipe details: title, description, category, prep time, cook time, servings.
    user adds ingredients:
        - searches and selects existing ingredients from the database.
        - enters quantity and unit for each.
        - optionally adds custom text or notes for the ingredient.
    user enters cooking instructions/steps.
    user uploads a cover photo (URL or file).
    user saves the recipe.
    user is redirected to the newly created recipe's detail page.

5.  🟢 **Completed** - user forks a recipe
    user views a recipe detail page (not their own).
    user clicks "Fork" button.
    a copy of the recipe is created for the user with `original_recipe_id` pointing to the source.
    user is redirected to the edit page of the new forked recipe.
    user modifies the recipe (tweaks ingredients, changes steps).
    user saves their version.

6.  🟢 **Completed** - user registration and login
    visitor navigates to sign up page.
    visitor enters email, username, password, name, and country.
    visitor submits and confirms email (if applicable) -> becomes a user.
    
    visitor navigates to login page.
    visitor enters credentials.
    system authenticates and redirects to home/dashboard.

7.  🟡 **Partially Implemented** - user views their profile / my recipes
    user goes to their profile page.
    user sees their personal details (avatar, name).
    user sees a list of "My Recipes" (recipes they created).
    user sees a list of "Forked Recipes" or "Saved Recipes".
    user can click to edit or delete their own recipes.

8.  🟢 **Completed** - Edit/Delete Own Recipe
    user enters the "My Recipes" view.
    user selects a recipe they created.
    user clicks "Edit" to modify details or "Delete" to remove it.
    system verifies ownership.
    system performs update or deletion.

9.  🟢 **Completed** - recipe detailed view
    user views a specific recipe.
    sees full details: ingredients list (with quantities), step-by-step instructions, nutrition info (if available), author information.
    sees "Fork" button (if logged in and not author).
    sees "Edit" button (if author).

10. 🟢 **Completed** - filter recipes by category
    visitor or user views the recipe list.
    user selects a category filter (e.g., "Dinner", "Vegan", "Dessert").
    the list updates to show only recipes belonging to that category.

11. 🟢 **Completed**  - social interactions (likes and comments)
    user views a recipe.
    user clicks "Like" button -> like count increases, user marks recipe as liked.
    user types a comment in the comment section and submits -> comment appears on the recipe page.

B. Access Control / Feature Permissions

1.  Visitor (Unauthenticated)
    *   **Access:** Read-only access to public content.
    *   **Allowed Actions:**
        *   View Recipe List (Home).
        *   View Recipe Details.
        *   Search (by Name, Ingredients).
        *   Filter by Category.
    *   **Restricted Actions (Redirect to Login):**
        *   Create Recipe.
        *   Fork Recipe.
        *   Like / Comment.
        *   View "My Recipes".

2.  User (Authenticated)
    *   **Access:** Full access to all features.
    *   **Exclusive Actions:**
        *   Create Recipe.
        *   Fork Recipe.
        *   Edit / Delete Own Recipe.
        *   Like Recipe.
        *   Comment on Recipe.
        *   Manage Profile.
