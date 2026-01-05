import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';
import { IngredientEntity } from './entities/ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IngredientEntity])],
  providers: [IngredientsService],
  controllers: [IngredientsController],
  exports: [IngredientsService]
})
export class IngredientsModule { }
