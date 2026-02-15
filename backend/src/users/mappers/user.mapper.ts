import { UserEntity } from '../entities/user.entity';
import { User } from '../domain/user.model';

export class UserMapper {
    static toDomain(entity: UserEntity): User {
        return new User({
            id: entity.id,
            email: entity.email,
            password: entity.password, // Be careful mapping this back if we don't want to expose it
            language: entity.language,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }

    static toEntity(domain: Partial<User>): Partial<UserEntity> {
        const entity: Partial<UserEntity> = {
            email: domain.email,
            password: domain.password,
            language: domain.language,
        };
        return entity;
    }

    static toDomainList(entities: UserEntity[]): User[] {
        return entities.map(entity => this.toDomain(entity));
    }
}
