import { observer } from 'mobx-react-lite';
import { useStore } from '../../context/store.context';
import { useEffect, useState } from 'react';
import { RecipeDiscoveryCard } from '../../components/RecipeDiscoveryCard';
import { SearchBar } from '../../components/SearchBar';
import './HomePage.css';

export const HomePage = observer(() => {
    const { recipesStore } = useStore();
    const [search, setSearch] = useState('');
    const [category] = useState<string | undefined>(undefined);

    useEffect(() => {
        recipesStore.fetchRecipes();
    }, []);

    const handleSearch = () => {
        recipesStore.searchRecipes(search, category);
    };


    return (
        <div className="home-page">

            <SearchBar
                value={search}
                onChange={setSearch}
                onSearch={handleSearch}
            />


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
                        <RecipeDiscoveryCard key={recipe.id} recipe={recipe} />
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
