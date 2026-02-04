import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../context/store.context';
import styles from './RecipeDetailPage.module.css';

export const RecipeDetailPage = observer(() => {
    const { id } = useParams<{ id: string }>();
    const { recipesStore } = useStore();
    const { currentRecipe, currentRecipeComments, isLoading } = recipesStore;

    useEffect(() => {
        if (id) {
            recipesStore.fetchRecipe(id);
        }
    }, [id, recipesStore]);

    if (isLoading) {
        return (
            <div className={styles.container} style={{ textAlign: 'center', marginTop: 'var(--space-16)' }}>
                Loading recipe...
            </div>
        );
    }

    if (!currentRecipe) {
        // Optionally could show a "Not Found" UI or redirect
        // For now, if loading finished and no recipe, imply not found or error
        return <div className={styles.container}>Recipe not found</div>;
    }

    // Split instructions by newlines for step-by-step display
    const instructionSteps = currentRecipe.instructions
        ? currentRecipe.instructions.split('\n').filter(step => step.trim().length > 0)
        : [];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {currentRecipe.photoUrl && (
                    <img
                        src={currentRecipe.photoUrl}
                        alt={currentRecipe.name}
                        className={styles.coverImage}
                    />
                )}

                <div className={styles.titleSection}>
                    <h1 className={styles.title}>{currentRecipe.name}</h1>
                    <div className={styles.actions}>
                        <button className={styles.actionButton} title="Like">
                            ❤️ {currentRecipe.likesCount}
                        </button>
                        <button className={styles.actionButton} title="Comment">
                            💬 {currentRecipe.commentsCount}
                        </button>
                    </div>
                </div>

                <div className={styles.metaInfo}>
                    {currentRecipe.category && (
                        <div className={styles.metaItem}>
                            🏷️ {currentRecipe.category}
                        </div>
                    )}
                    {currentRecipe.prepTime && (
                        <div className={styles.metaItem}>
                            ⏱️ Prep: {currentRecipe.prepTime} min
                        </div>
                    )}
                    {currentRecipe.cookTime && (
                        <div className={styles.metaItem}>
                            🍳 Cook: {currentRecipe.cookTime} min
                        </div>
                    )}
                    <div className={styles.metaItem}>
                        📅 {new Date(currentRecipe.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>

            <div className={styles.contentGrid}>
                <aside className={styles.ingredients}>
                    <h2 className={styles.sectionTitle}>Ingredients</h2>
                    {currentRecipe.ingredients && currentRecipe.ingredients.length > 0 ? (
                        <ul className={styles.ingredientList}>
                            {currentRecipe.ingredients.map((ing, index) => (
                                <li key={index} className={styles.ingredientItem}>
                                    <strong>{ing.quantity} {ing.unit}</strong> {ing.name}
                                    {ing.notes && <em style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}> ({ing.notes})</em>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>No ingredients listed.</p>
                    )}
                </aside>

                <div className={styles.instructions}>
                    <h2 className={styles.sectionTitle}>Instructions</h2>
                    {instructionSteps.length > 0 ? instructionSteps.map((step, index) => (
                        <div key={index} className={styles.instructionStep}>
                            <div className={styles.stepNumber}>{index + 1}</div>
                            <div style={{ paddingTop: '0.25rem' }}>{step}</div>
                        </div>
                    )) : (
                        <p>No instructions provided.</p>
                    )}
                </div>

                <div className={styles.commentsSection}>
                    <h2 className={styles.sectionTitle}>Comments ({currentRecipe?.commentsCount || 0})</h2>
                    {currentRecipeComments.length > 0 ? (
                        <div className={styles.commentList}>
                            {currentRecipeComments.map(comment => (
                                <div key={comment.id} className={styles.comment}>
                                    <div className={styles.commentHeader}>
                                        <span>User #{comment.userId}</span>
                                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className={styles.commentText}>{comment.text}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>No comments yet. Be the first to share your thoughts!</p>
                    )}
                </div>
            </div>
        </div>
    );
});
