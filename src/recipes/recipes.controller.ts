import { Body, Controller, Get, Post } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Recipe } from './domain/recipe.model';
import { CreateRecipeDto } from './dtos/recipe.dto';


@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) { }

  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return this.recipesService.create(createRecipeDto);
  }

  @Get()
  async findAll(): Promise<Recipe[]> {
    return this.recipesService.findAll();
  }
}
