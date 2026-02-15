import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import './IngredientFilter.scss';

interface IngredientFilterProps {
    selected: string[];
    onAdd: (ingredient: string) => void;
    onRemove: (ingredient: string) => void;
}

export const IngredientFilter = ({ selected, onAdd, onRemove }: IngredientFilterProps) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            handleAdd();
        }
    };

    const handleAdd = () => {
        const trimmed = input.trim();
        if (trimmed && !selected.includes(trimmed)) {
            onAdd(trimmed);
            setInput('');
        }
    };

    return (
        <div className="ingredient-filter">
            <div className="ingredient-input-wrapper">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add ingredient (e.g. Tomato)..."
                    className="ingredient-input"
                />
                <button
                    onClick={handleAdd}
                    className="add-ingredient-btn"
                    disabled={!input.trim()}
                    aria-label="Add ingredient"
                >
                    <Plus size={18} />
                </button>
            </div>

            {selected.length > 0 && (
                <div className="selected-ingredients">
                    {selected.map((ing) => (
                        <div key={ing} className="ingredient-pill">
                            <span>{ing}</span>
                            <button onClick={() => onRemove(ing)} className="remove-ingredient-btn" aria-label={`Remove ${ing}`}>
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
