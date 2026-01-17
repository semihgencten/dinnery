import { Entity, Column, OneToMany } from 'typeorm';
import { RecipeIngredientEntity } from './recipe-ingredient.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('recipes')
export class RecipeEntity extends BaseEntity {
    @Column({ length: 150 })
    name: string;

    @Column({ nullable: true, type: 'text' })
    description: string;

    @Column({ type: 'text' })
    instructions: string;

    @Column({ name: 'photo_url', nullable: true, length: 500 })
    photoUrl: string;

    @OneToMany(() => RecipeIngredientEntity, (recipeIngredient) => recipeIngredient.recipe, {
        cascade: true
    })
    ingredients: RecipeIngredientEntity[];
}
