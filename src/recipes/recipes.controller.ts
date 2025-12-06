import { Body, Controller, Get, Post } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Recipe } from './interfaces/recipe.interface';
import { CreateRecipeDto } from './dtos/createRecipe.dto';


@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto) {
    this.recipesService.create(createRecipeDto)
  }

  @Get()
  findAll(): Recipe[] {
    return this.recipesService.findAll()
  }
}
