import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { RecipeEntity } from './recipe.entity';

@Entity('comments')
export class CommentEntity extends BaseEntity {
    @Column({ type: 'text' })
    text: string;

    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'recipe_id' })
    recipeId: number;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => RecipeEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'recipe_id' })
    recipe: RecipeEntity;
}
