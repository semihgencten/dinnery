import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';

@Module({
  imports: [],
  providers: [RecipesService],
  controllers: [RecipesController]
})
export class RecipesModule {}
