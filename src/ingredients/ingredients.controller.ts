import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto, IngredientResponseDto } from './dtos/ingredient.dto';

@Controller('ingredients')
export class IngredientsController {
    constructor(private readonly ingredientsService: IngredientsService) { }

    @Post()
    async create(@Body() createDto: CreateIngredientDto): Promise<IngredientResponseDto> {
        const ingredient = await this.ingredientsService.create(createDto);
        return {
            id: ingredient.id,
            name: ingredient.name,
            displayName: ingredient.displayName,
            photoUrl: ingredient.photoUrl,
            category: ingredient.category,
            canBeDeleted: ingredient.canBeDeleted()
        };
    }

    @Get('search')
    async search(@Query('term') term: string): Promise<IngredientResponseDto[]> {
        const ingredients = await this.ingredientsService.search(term);
        return ingredients.map(ingredient => ({
            id: ingredient.id,
            name: ingredient.name,
            displayName: ingredient.displayName,
            photoUrl: ingredient.photoUrl,
            category: ingredient.category,
            canBeDeleted: ingredient.canBeDeleted()
        }));
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<IngredientResponseDto> {
        const ingredient = await this.ingredientsService.findOne(id);

        return {
            id: ingredient.id,
            name: ingredient.name,
            displayName: ingredient.displayName,
            photoUrl: ingredient.photoUrl,
            category: ingredient.category,
            canBeDeleted: ingredient.canBeDeleted()
        };
    }
}
