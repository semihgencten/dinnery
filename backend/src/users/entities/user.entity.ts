import { Entity, Column, OneToMany } from 'typeorm';
import { UserRecipeEntity } from '../../recipes/entities/user-recipe.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
    @Column({ unique: true, length: 150 })
    email: string;

    @Column({ length: 255 })
    password: string;

    @Column({ length: 10, default: 'en' })
    language: string;

    @OneToMany(() => UserRecipeEntity, (userRecipe) => userRecipe.user, {
        cascade: true
    })
    userRecipes: UserRecipeEntity[];
}
