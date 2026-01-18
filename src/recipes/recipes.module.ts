import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { RecipeEntity } from './entities/recipe.entity';

import { RecipeIngredientEntity } from './entities/recipe-ingredient.entity';

import { UserRecipeEntity } from './entities/user-recipe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity, RecipeIngredientEntity, UserRecipeEntity])],
  providers: [RecipesService],
  controllers: [RecipesController],
  exports: [RecipesService]
})
export class RecipesModule { }
