import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { RecipeEntity } from './entities/recipe.entity';

import { RecipeIngredientEntity } from './entities/recipe-ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity, RecipeIngredientEntity])],
  providers: [RecipesService],
  controllers: [RecipesController],
  exports: [RecipesService]
})
export class RecipesModule { }
