import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { User } from './domain/user.model';
import { UserMapper } from './mappers/user.mapper';
import { CreateUserDto } from './dtos/user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
    ) { }

    async findOne(id: number): Promise<User> {
        const entity = await this.userRepo.findOne({
            where: { id }
        });

        if (!entity) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return UserMapper.toDomain(entity);
    }

    async findByEmail(email: string): Promise<User | null> {
        const entity = await this.userRepo.findOne({
            where: { email }
        });

        if (!entity) return null;

        return UserMapper.toDomain(entity);
    }

    async create(createDto: CreateUserDto): Promise<User> {
        // Check for existing username or email
        const existing = await this.userRepo.findOne({
            where: [
                { username: createDto.username },
                { email: createDto.email }
            ]
        });

        if (existing) {
            throw new ConflictException('User with this username or email already exists');
        }

        const domainData = new User({
            name: createDto.name,
            username: createDto.username,
            email: createDto.email,
            password: createDto.password,
            country: createDto.country,
            avatar: createDto.avatar
        });

        const entityData = UserMapper.toEntity(domainData);
        // We need to handle the fact that toEntity returns object with undefined for missing props,
        // but TypeORM save creates a new entity.
        // Actually toEntity returns Partial<UserEntity> which is fine for save().

        const entity = await this.userRepo.save(entityData);

        return UserMapper.toDomain(entity);
    }

    async findAll(): Promise<User[]> {
        const entities = await this.userRepo.find();
        return UserMapper.toDomainList(entities);
    }
}
