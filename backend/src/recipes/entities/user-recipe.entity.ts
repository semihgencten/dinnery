import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { RecipeEntity } from './recipe.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { UserRecipeRole } from '../domain/user-recipe.model';

@Entity('user_recipes')
export class UserRecipeEntity extends BaseEntity {
    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'recipe_id' })
    recipeId: number;

    @Column({
        type: 'simple-enum',
        enum: UserRecipeRole,
        default: UserRecipeRole.CREATOR
    })
    role: UserRecipeRole;

    @Column({ name: 'collection', nullable: true, type: 'varchar' })
    collection: string;

    @ManyToOne(() => RecipeEntity, (recipe) => recipe.userRecipes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'recipe_id' })
    recipe: RecipeEntity;

    @ManyToOne(() => UserEntity, (user) => user.userRecipes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
}
