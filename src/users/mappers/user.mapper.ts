import { UserEntity } from '../entities/user.entity';
import { User } from '../domain/user.model';

export class UserMapper {
    static toDomain(entity: UserEntity): User {
        return new User({
            id: entity.id,
            name: entity.name,
            username: entity.username,
            email: entity.email,
            country: entity.country,
            avatar: entity.avatar,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }

    static toEntity(domain: Partial<User>): Partial<UserEntity> {
        const entity: Partial<UserEntity> = {
            name: domain.name,
            username: domain.username,
            email: domain.email,
            country: domain.country,
            avatar: domain.avatar ?? undefined,
        };
        return entity;
    }

    static toDomainList(entities: UserEntity[]): User[] {
        return entities.map(entity => this.toDomain(entity));
    }
}
