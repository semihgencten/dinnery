import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecipesController } from './recipes/recipes.controller';
import { RecipesService } from './recipes/recipes.service';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [RecipesModule],
  controllers: [AppController, RecipesController],
  providers: [AppService, RecipesService],
})
export class AppModule {}
