import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { RecipeEntity } from './entities/recipe.entity';

import { RecipeIngredientEntity } from './entities/recipe-ingredient.entity';

import { UserRecipeEntity } from './entities/user-recipe.entity';
import { AuthModule } from '../auth/auth.module';

import { RecipeLikeEntity } from './entities/recipe-like.entity';
import { CommentEntity } from './entities/comment.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([RecipeEntity, RecipeIngredientEntity, UserRecipeEntity, RecipeLikeEntity, CommentEntity])],
  providers: [RecipesService],
  controllers: [RecipesController],
  exports: [RecipesService]
})
export class RecipesModule { }
