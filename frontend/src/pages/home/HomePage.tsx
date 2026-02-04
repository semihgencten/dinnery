import { observer } from 'mobx-react-lite';
import { useStore } from '../../context/store.context';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { RecipeCard } from '../../components/RecipeCard';
import { SearchBar } from '../../components/SearchBar';
import { CategoryFilter } from '../../components/CategoryFilter';
import './HomePage.css';

export const HomePage = observer(() => {
    const { recipesStore, authStore } = useStore();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<string | undefined>(undefined);

    useEffect(() => {
        recipesStore.fetchRecipes();
    }, []);

    const handleSearch = () => {
        recipesStore.searchRecipes(search, category);
    };

    const handleCategorySelect = (cat: string | undefined) => {
        setCategory(cat);
        recipesStore.searchRecipes(search, cat);
    };

    return (
        <div className="home-page">
            <div className="hero-section">
                <h1>Find your next favorite meal 🍽️</h1>
                {authStore.isAuthenticated ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '-0.5rem' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>
                            Welcome back, {authStore.user?.name}
                        </p>
                        <Button variant="secondary" onClick={() => authStore.logout()}>Logout</Button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <Button onClick={() => navigate('/login')}>Login</Button>
                        <Button variant="secondary" onClick={() => navigate('/signup')}>Sign Up</Button>
                    </div>
                )}

                <SearchBar
                    value={search}
                    onChange={setSearch}
                    onSearch={handleSearch}
                />

                <CategoryFilter
                    selected={category}
                    onSelect={handleCategorySelect}
                />
            </div>

            <div className="recipes-grid">
                {recipesStore.isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="skeleton-card">
                            <div className="skeleton-image"></div>
                            <div className="skeleton-content">
                                <div className="skeleton-text" style={{ height: '24px', width: '80%' }}></div>
                                <div className="skeleton-text" style={{ height: '16px', width: '40%' }}></div>
                            </div>
                        </div>
                    ))
                ) : recipesStore.recipes.length > 0 ? (
                    recipesStore.recipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <h3>No recipes found</h3>
                        <p>Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
});
