import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import {
    IngredientCreateRequestDto,
    IngredientCreateResponseDto,
    IngredientSearchResponseDto,
    IngredientGetResponseDto
} from './dtos/ingredient.dto';

@Controller('ingredients')
export class IngredientsController {
    constructor(private readonly ingredientsService: IngredientsService) { }

    @Post()
    async create(@Body() createDto: IngredientCreateRequestDto): Promise<IngredientCreateResponseDto> {
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
    async search(@Query('term') term: string): Promise<IngredientSearchResponseDto[]> {
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
    async findOne(@Param('id') id: number): Promise<IngredientGetResponseDto> {
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

