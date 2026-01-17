import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { RecipeEntity } from './recipe.entity';
import { IngredientEntity } from '../../ingredients/entities/ingredient.entity';

@Entity('recipe_ingredients')
export class RecipeIngredientEntity extends BaseEntity {
    @Column({ name: 'recipe_id' })
    recipeId: number;

    @Column({ name: 'ingredient_id', nullable: true })
    ingredientId: number | null;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    quantity: number;

    @Column({ length: 50 })
    unit: string;

    @Column({ name: 'custom_ingredient_text', type: 'varchar', length: 255, nullable: true })
    customIngredientText: string | null;

    @Column({ nullable: true, type: 'text' })
    notes: string | null;

    @ManyToOne(() => RecipeEntity, (recipe) => recipe.ingredients, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'recipe_id' })
    recipe: RecipeEntity;

    @ManyToOne(() => IngredientEntity, { nullable: true })
    @JoinColumn({ name: 'ingredient_id' })
    ingredient: IngredientEntity | null;
}
