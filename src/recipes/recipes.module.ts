import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { RecipeEntity } from './entities/recipe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity])],
  providers: [RecipesService],
  controllers: [RecipesController],
  exports: [RecipesService]
})
export class RecipesModule { }
