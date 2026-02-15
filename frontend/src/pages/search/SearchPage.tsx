import { observer } from 'mobx-react-lite';
import { useStore } from '../../context/store.context';
import { useEffect, useState } from 'react';
import { RecipeDiscoveryCard } from '../../components/RecipeDiscoveryCard';
import { SearchBar } from '../../components/SearchBar';
import { CategoryFilter } from '../../components/CategoryFilter';
import { IngredientFilter } from '../../components/IngredientFilter';
import { useSearchParams } from 'react-router-dom';
import './SearchPage.css';

export const SearchPage = observer(() => {
    const { recipesStore } = useStore();
    const [searchParams, setSearchParams] = useSearchParams();

    // Init state from URL
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [category, setCategory] = useState<string | undefined>(searchParams.get('category') || undefined);

    // Ingredients state - could sync to URL but array format requires handling
    const [ingredients, setIngredients] = useState<string[]>([]);

    useEffect(() => {
        // Sync URL with state (one way for now or debounced)
        const params: any = {};
        if (query) params.q = query;
        if (category) params.category = category;
        setSearchParams(params);

        handleSearch();
    }, [category, ingredients]); // Auto-search on filter change

    // Manual search for query to avoid too many requests? 
    // Or auto-search with debounce?
    // Following HomePage pattern: simple manual search or effect.
    // Let's add query to dependency if we want auto-search, but normally text search is manual or debounced.
    // For now, let's keep text search manual (Enter/Icon) to match SearchBar prop `onSearch`.
    // But Category/Ingredients trigger immediately.

    const handleSearch = async () => {
        if (ingredients.length > 0) {
            await recipesStore.searchRecipesByIngredients(ingredients);
        } else {
            await recipesStore.searchRecipes(query, category);
        }
    };

    // Client-side filtering to combine Ingredient search (which returns list) with Name/Category
    const filteredRecipes = recipesStore.recipes.filter(recipe => {
        // If we used ingredients endpoint, we need to manually filter by name and category
        if (ingredients.length > 0) {
            let match = true;
            if (query && !recipe.name.toLowerCase().includes(query.toLowerCase())) match = false;
            // Note: Category check. recipesStore.searchRecipes handles category in backend.
            // searchByIngredients does NOT. So we must check here.
            if (category && recipe.category !== category) match = false;
            return match;
        }
        return true; // Already filtered by backend
    });

    const handleIngredientAdd = (ing: string) => {
        if (!ingredients.includes(ing)) {
            setIngredients([...ingredients, ing]);
        }
    }

    const handleIngredientRemove = (ing: string) => {
        setIngredients(ingredients.filter(i => i !== ing));
    }

    const handleQuerySearch = () => {
        handleSearch();
    }

    return (
        <div className="search-page">
            <header className="search-header">
                <h1>Find Recipes</h1>

                <SearchBar
                    value={query}
                    onChange={setQuery}
                    onSearch={handleQuerySearch}
                />

                <div className="filters-section">
                    <div className="filter-group">
                        <label className="filter-label">Category</label>
                        <CategoryFilter selected={category} onSelect={setCategory} />
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Ingredients (Include)</label>
                        <IngredientFilter
                            selected={ingredients}
                            onAdd={handleIngredientAdd}
                            onRemove={handleIngredientRemove}
                        />
                    </div>
                </div>
            </header>

            <div className="recipes-grid">
                {recipesStore.isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="skeleton-card" style={{ height: '280px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
                            {/* Simple inline skeleton style or reuse class if globally available */}
                        </div>
                    ))
                ) : filteredRecipes.length > 0 ? (
                    filteredRecipes.map(recipe => (
                        <RecipeDiscoveryCard key={recipe.id} recipe={recipe} />
                    ))
                ) : (
                    <div className="no-results">
                        <h3>No recipes found</h3>
                        <p>Try adjusting your search terms or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
});
