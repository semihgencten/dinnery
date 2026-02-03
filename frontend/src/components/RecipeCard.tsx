import { type Recipe } from '../stores/recipes.store';
import { Clock, Heart, MessageCircle, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import './RecipeCard.css';

interface RecipeCardProps {
    recipe: Recipe;
}

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
    return (
        <Link to={`/recipes/${recipe.id}`} className="recipe-card">
            <div className="card-image-container">
                {recipe.photoUrl ? (
                    <img src={recipe.photoUrl} alt={recipe.name} className="card-image" />
                ) : (
                    <div className="card-placeholder">
                        <ChefHat size={48} opacity={0.5} />
                    </div>
                )}
                <div className="category-pill">{recipe.category || 'General'}</div>
            </div>
            <div className="card-content">
                <h3 className="card-title">{recipe.name}</h3>

                <div className="card-meta">
                    <div className="meta-item">
                        <Clock size={16} />
                        <span>{(recipe.prepTime || 0) + (recipe.cookTime || 0)} min</span>
                    </div>
                </div>

                <div className="card-footer">
                    <div className="social-stats">
                        <div className="stat">
                            <Heart size={16} className="heart-icon" />
                            <span>{recipe.likesCount}</span>
                        </div>
                        <div className="stat">
                            <MessageCircle size={16} />
                            <span>{recipe.commentsCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};
