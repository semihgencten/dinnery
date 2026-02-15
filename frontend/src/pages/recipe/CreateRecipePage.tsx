import { observer } from 'mobx-react-lite';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/store.context';
import styles from './CreateRecipePage.module.css';
import type { CreateRecipePayload } from '../../stores/recipes.store';

interface IngredientRow {
    ingredientId?: number;
    name: string; // Used for display and customIngredientText
    quantity: number;
    unit: string;
    notes: string;
}

export const CreateRecipePage = observer(() => {
    const { recipesStore } = useStore();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        prepTime: 0,
        cookTime: 0,
        photoUrl: '',
        instructions: '',
    });

    const [ingredients, setIngredients] = useState<IngredientRow[]>([
        { name: '', quantity: 0, unit: '', notes: '' },
    ]);

    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'prepTime' || name === 'cookTime' ? Number(value) : value,
        }));
    };

    const handleIngredientChange = (
        index: number,
        field: keyof IngredientRow,
        value: string | number
    ) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = {
            ...newIngredients[index],
            [field]: value,
        };

        if (field === 'name') {
            newIngredients[index].ingredientId = undefined;
            setIngredients(newIngredients);

            if (value.toString().length > 1) {
                recipesStore.searchIngredients(value.toString()).then((results) => {
                    setSearchResults(results);
                    setActiveSearchIndex(index);
                });
            } else {
                setSearchResults([]);
                setActiveSearchIndex(null);
            }
        } else {
            setIngredients(newIngredients);
        }
    };

    const selectIngredient = (index: number, ingredient: any) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = {
            ...newIngredients[index],
            ingredientId: ingredient.id,
            name: ingredient.name,
        };
        setIngredients(newIngredients);
        setSearchResults([]);
        setActiveSearchIndex(null);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: 0, unit: '', notes: '' }]);
    };

    const removeIngredient = (index: number) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (recipesStore.isLoading) return;

        // Validate
        if (!formData.title || !formData.instructions || ingredients.length === 0) {
            alert('Please fill in all required fields');
            return;
        }

        const payload: CreateRecipePayload = {
            name: formData.title,
            description: formData.description,
            category: formData.category,
            instructions: formData.instructions,
            photoUrl: formData.photoUrl,
            prepTime: formData.prepTime,
            cookTime: formData.cookTime,
            ingredients: ingredients.map((ing) => ({
                ingredientId: ing.ingredientId,
                customIngredientText: !ing.ingredientId ? ing.name : undefined,
                quantity: Number(ing.quantity),
                unit: ing.unit,
                notes: ing.notes,
            })),
        };

        try {
            await recipesStore.createRecipe(payload);
            navigate('/my-recipes');
        } catch (error) {
            console.error('Failed to create recipe', error);
            alert('Failed to create recipe');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create New Recipe</h1>
            <form className={styles.form} onSubmit={handleSubmit}>

                {/* Basic Info Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Basic Info</h2>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="title">Recipe Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className={styles.input}
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g. Grandma's Apple Pie"
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={`${styles.formGroup} ${styles.col}`}>
                            <label className={styles.label} htmlFor="category">Category</label>
                            <select
                                id="category"
                                name="category"
                                className={styles.select}
                                value={formData.category}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Category</option>
                                <option value="Dinner">Dinner</option>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dessert">Dessert</option>
                                <option value="Snack">Snack</option>
                                <option value="Vegan">Vegan</option>
                            </select>
                        </div>
                        <div className={`${styles.formGroup} ${styles.col}`}>
                            <label className={styles.label} htmlFor="photoUrl">Photo URL</label>
                            <input
                                type="url"
                                id="photoUrl"
                                name="photoUrl"
                                className={styles.input}
                                value={formData.photoUrl}
                                onChange={handleInputChange}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={`${styles.formGroup} ${styles.col}`}>
                            <label className={styles.label} htmlFor="prepTime">Prep Time (mins)</label>
                            <input
                                type="number"
                                id="prepTime"
                                name="prepTime"
                                className={styles.input}
                                value={formData.prepTime}
                                onChange={handleInputChange}
                                min="0"
                            />
                        </div>
                        <div className={`${styles.formGroup} ${styles.col}`}>
                            <label className={styles.label} htmlFor="cookTime">Cook Time (mins)</label>
                            <input
                                type="number"
                                id="cookTime"
                                name="cookTime"
                                className={styles.input}
                                value={formData.cookTime}
                                onChange={handleInputChange}
                                min="0"
                            />
                        </div>
                    </div>
                </div>

                {/* Ingredients Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Ingredients</h2>
                    <div className={styles.ingredientsList}>
                        {ingredients.map((ingredient, index) => (
                            <div key={index} className={styles.ingredientRow}>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        placeholder="Ingredient Name"
                                        className={styles.input}
                                        value={ingredient.name}
                                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                        required
                                    />
                                    {/* Autocomplete Dropdown */}
                                    {activeSearchIndex === index && searchResults.length > 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            backgroundColor: 'var(--surface-card)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: 'var(--radius-md)',
                                            maxHeight: '150px',
                                            overflowY: 'auto',
                                            zIndex: 10,
                                            boxShadow: 'var(--shadow-lg)'
                                        }}>
                                            {searchResults.map((result) => (
                                                <div
                                                    key={result.id}
                                                    onClick={() => selectIngredient(index, result)}
                                                    style={{
                                                        padding: 'var(--space-2)',
                                                        cursor: 'pointer',
                                                        borderBottom: '1px solid var(--border-color)'
                                                    }}
                                                >
                                                    {result.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="number"
                                    placeholder="Qty"
                                    className={styles.input}
                                    value={ingredient.quantity}
                                    onChange={(e) => handleIngredientChange(index, 'quantity', Number(e.target.value))}
                                    required
                                    min="0"
                                    step="0.1"
                                />
                                <input
                                    type="text"
                                    placeholder="Unit"
                                    className={styles.input}
                                    value={ingredient.unit}
                                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Note (opt)"
                                    className={styles.input}
                                    value={ingredient.notes}
                                    onChange={(e) => handleIngredientChange(index, 'notes', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className={styles.removeButton}
                                    onClick={() => removeIngredient(index)}
                                    title="Remove Ingredient"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                    <button type="button" className={styles.addButton} onClick={addIngredient}>
                        + Add Ingredient
                    </button>
                </div>

                {/* Instructions Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Instructions</h2>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="instructions">Step-by-step Instructions *</label>
                        <textarea
                            id="instructions"
                            name="instructions"
                            className={styles.textarea}
                            value={formData.instructions}
                            onChange={handleInputChange}
                            required
                            placeholder="1. Preheat oven to 350°F..."
                        />
                    </div>
                </div>

                <button type="submit" className={styles.submitButton} disabled={recipesStore.isLoading}>
                    {recipesStore.isLoading ? 'Creating...' : 'Create Recipe'}
                </button>
            </form>
        </div>
    );
});
