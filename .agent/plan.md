want to add a base entity for entities.
We are gonna seperate business models and db entities

models should be in domain folder in the modules
entities should be in entities folder in the modules

import { 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

add this base entity in a shared place: src/common/entities/base.entity.ts
ingredient entity should be extended from this

// src/ingredients/entities/ingredient.entity.ts (Database layer)
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

  @OneToMany(() => RecipeIngredientEntity, ri => ri.ingredient)
  recipeIngredients: RecipeIngredientEntity[];
}

// src/ingredients/domain/ingredient.model.ts (Business layer)
export class Ingredient {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly displayName: string,
    public readonly photoUrl: string | null,
    public readonly category: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    private readonly usageCount?: number
  ) {}

  // Pure business logic - no DB dependencies
  isPopular(): boolean {
    return this.usageCount > 100;
  }

  canBeDeleted(): boolean {
    return this.usageCount === 0;
  }

  matches(searchTerm: string): boolean {
    const term = searchTerm.toLowerCase();
    return this.name.includes(term) || 
           this.displayName.toLowerCase().includes(term);
  }

  // Factory method
  static create(
    name: string, 
    displayName: string, 
    photoUrl?: string, 
    category?: string
  ): Partial<Ingredient> {
    return {
      name: name.toLowerCase().trim(),
      displayName: displayName.trim(),
      photoUrl: photoUrl || null,
      category: category || null
    };
  }
}

// src/ingredients/mappers/ingredient.mapper.ts
export class IngredientMapper {
  static toDomain(entity: IngredientEntity, usageCount?: number): Ingredient {
    return new Ingredient(
      entity.id,
      entity.name,
      entity.displayName,
      entity.photoUrl,
      entity.category,
      entity.createdAt,
      entity.updatedAt,
      usageCount
    );
  }

  static toEntity(domain: Partial<Ingredient>): Partial<IngredientEntity> {
    return {
      name: domain.name,
      displayName: domain.displayName,
      photoUrl: domain.photoUrl,
      category: domain.category
    };
  }

  static toDomainList(entities: IngredientEntity[]): Ingredient[] {
    return entities.map(entity => this.toDomain(entity));
  }
}

// src/ingredients/ingredients.service.ts
@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(IngredientEntity)
    private ingredientRepo: Repository<IngredientEntity>,
  ) {}

  async findOne(id: number): Promise<Ingredient> {
    const entity = await this.ingredientRepo.findOne({ 
      where: { id },
      relations: ['recipeIngredients']
    });
    
    if (!entity) {
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }

    return IngredientMapper.toDomain(
      entity, 
      entity.recipeIngredients?.length || 0
    );
  }

  async create(createDto: CreateIngredientDto): Promise<Ingredient> {
    // Use domain model for business logic
    const domainData = Ingredient.create(
      createDto.name,
      createDto.displayName,
      createDto.photoUrl,
      createDto.category
    );

    // Check for duplicates (business rule)
    const existing = await this.ingredientRepo.findOne({
      where: { name: domainData.name }
    });

    if (existing) {
      throw new ConflictException('Ingredient already exists');
    }

    // Convert to entity and save
    const entityData = IngredientMapper.toEntity(domainData);
    const entity = await this.ingredientRepo.save(entityData);

    return IngredientMapper.toDomain(entity);
  }

  async search(term: string): Promise<Ingredient[]> {
    const entities = await this.ingredientRepo.find();
    const ingredients = IngredientMapper.toDomainList(entities);
    
    // Business logic in domain model
    return ingredients.filter(ing => ing.matches(term));
  }
}

// src/ingredients/ingredients.controller.ts
@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<IngredientResponseDto> {
    const ingredient = await this.ingredientsService.findOne(id);
    
    // Return DTO, not domain model
    return {
      id: ingredient.id,
      name: ingredient.name,
      displayName: ingredient.displayName,
      photoUrl: ingredient.photoUrl,
      category: ingredient.category,
      isPopular: ingredient.isPopular(),
      canBeDeleted: ingredient.canBeDeleted()
    };
  }
}