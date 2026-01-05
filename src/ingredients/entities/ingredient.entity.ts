import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('ingredients')
export class IngredientEntity extends BaseEntity {
    @Column({ unique: true, length: 100 })
    name: string;

    @Column({ name: 'display_name', length: 100 })
    displayName: string;

    @Column({ name: 'photo_url', nullable: true, length: 500 })
    photoUrl: string;

    @Column({ nullable: true, length: 50 })
    category: string;
}
