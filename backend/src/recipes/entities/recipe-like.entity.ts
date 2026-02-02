import { Entity, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { RecipeEntity } from './recipe.entity';

@Entity('recipe_likes')
export class RecipeLikeEntity {
    @PrimaryColumn({ name: 'user_id' })
    userId: number;

    @PrimaryColumn({ name: 'recipe_id' })
    recipeId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => RecipeEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'recipe_id' })
    recipe: RecipeEntity;
}
