import { useNavigate } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Heart, MessageCircle, Tag, Clock, Flame, CalendarDays, List, ChefHat } from 'lucide-react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../context/store.context';
import styles from './RecipeDetailPage.module.scss';

export const RecipeDetailPage = observer(() => {
    const { id } = useParams<{ id: string }>();
    const { recipesStore, authStore } = useStore();
    const { currentRecipe, currentRecipeComments, isLoading } = recipesStore;
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            recipesStore.fetchRecipe(id);
        }
    }, [id, recipesStore]);

    const handleSave = async () => {
        if (!authStore.isAuthenticated) {
            navigate('/login');
            return;
        }

        if (currentRecipe) {
            if (currentRecipe.isSaved) {
                await recipesStore.unsaveRecipe(currentRecipe.id);
                currentRecipe.isSaved = false;
            } else {
                await recipesStore.saveRecipe(currentRecipe.id);
                currentRecipe.isSaved = true;
            }
        }
    };

    if (isLoading) {
        return (
            <div className={styles.container} style={{ textAlign: 'center', marginTop: 'var(--space-16)' }}>
                Loading recipe...
            </div>
        );
    }

    if (!currentRecipe) {
        return <div className={styles.container}>Recipe not found</div>;
    }

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
                            <Heart size={18} /> <span>{currentRecipe.likesCount}</span>
                        </button>
                        <button className={styles.actionButton} title="Comment">
                            <MessageCircle size={18} /> <span>{currentRecipe.commentsCount}</span>
                        </button>
                        <button
                            className={`${styles.actionButton} ${currentRecipe.isSaved ? styles.saved : ''}`}
                            title={currentRecipe.isSaved ? "Unsave" : "Save"}
                            onClick={handleSave}
                        >
                            {currentRecipe.isSaved ? <BookmarkCheck size={18} fill="#E11D48" className="text-primary" /> : <Bookmark size={18} />}
                        </button>
                    </div>
                </div>

                <div className={styles.metaInfo}>
                    {currentRecipe.category && (
                        <div className={styles.metaItem}>
                            <Tag size={16} /> <span>{currentRecipe.category}</span>
                        </div>
                    )}
                    {currentRecipe.prepTime && (
                        <div className={styles.metaItem}>
                            <Clock size={16} /> <span>Prep: {currentRecipe.prepTime} min</span>
                        </div>
                    )}
                    {currentRecipe.cookTime && (
                        <div className={styles.metaItem}>
                            <Flame size={16} /> <span>Cook: {currentRecipe.cookTime} min</span>
                        </div>
                    )}
                    <div className={styles.metaItem}>
                        <CalendarDays size={16} /> <span>{new Date(currentRecipe.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div className={styles.contentGrid}>
                <aside className={styles.ingredients}>
                    <h2 className={styles.sectionTitle}>
                        <List size={24} color="var(--primary-color)" /> Ingredients
                    </h2>
                    {currentRecipe.ingredients && currentRecipe.ingredients.length > 0 ? (
                        <ul className={styles.ingredientList}>
                            {currentRecipe.ingredients.map((ing, index) => (
                                <li key={index} className={styles.ingredientItem}>
                                    <span className={styles.ingredientQuantity}>{ing.quantity} {ing.unit}</span>
                                    <span>
                                        {ing.name}
                                        {ing.notes && <em style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}> ({ing.notes})</em>}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>No ingredients listed.</p>
                    )}
                </aside>

                <div className={styles.instructions}>
                    <h2 className={styles.sectionTitle}>
                        <ChefHat size={24} color="var(--primary-color)" /> Instructions
                    </h2>
                    {instructionSteps.length > 0 ? instructionSteps.map((step, index) => (
                        <div key={index} className={styles.instructionStep}>
                            <div className={styles.stepNumber}>{index + 1}</div>
                            <div className={styles.stepContent}>{step}</div>
                        </div>
                    )) : (
                        <p>No instructions provided.</p>
                    )}
                </div>

                <div className={styles.commentsSection}>
                    <h2 className={styles.sectionTitle}>
                        <MessageCircle size={24} color="var(--primary-color)" /> Comments ({currentRecipe?.commentsCount || 0})
                    </h2>
                    {currentRecipeComments.length > 0 ? (
                        <div className={styles.commentList}>
                            {currentRecipeComments.map(comment => (
                                <div key={comment.id} className={styles.comment}>
                                    <div className={styles.commentHeader}>
                                        <span className={styles.commentUser}>User #{comment.userId}</span>
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
