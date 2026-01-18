import { Entity, Column, OneToMany } from 'typeorm';
import { UserRecipeEntity } from '../../recipes/entities/user-recipe.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
    @Column({ length: 100 })
    name: string;

    @Column({ unique: true, length: 50 })
    username: string;

    @Column({ unique: true, length: 150 })
    email: string;

    @Column({ length: 255 })
    password: string;

    @Column({ length: 100 })
    country: string;

    @Column({ nullable: true, length: 500 })
    avatar: string;

    @OneToMany(() => UserRecipeEntity, (userRecipe) => userRecipe.user, {
        cascade: true
    })
    userRecipes: UserRecipeEntity[];
}
