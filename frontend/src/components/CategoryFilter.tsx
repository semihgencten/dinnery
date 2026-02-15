import './CategoryFilter.scss';

interface CategoryFilterProps {
    selected: string | undefined;
    onSelect: (category: string | undefined) => void;
}

const CATEGORIES = ['All', 'Dinner', 'Vegan', 'Dessert', 'Breakfast', 'Lunch', 'Snack', 'Appetizer'];

export const CategoryFilter = ({ selected, onSelect }: CategoryFilterProps) => {
    return (
        <div className="category-scroll-container">
            <div className="category-filter">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        className={`category-pill-btn ${selected === cat || (cat === 'All' && !selected) ? 'active' : ''}`}
                        onClick={() => onSelect(cat === 'All' ? undefined : cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    )
}
