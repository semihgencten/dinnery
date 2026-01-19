import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecipesModule } from './recipes/recipes.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.NODE_ENV === 'test' ? ':memory:' : 'dinnery.sqlite',
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: process.env.NODE_ENV === 'test',
    }),
    RecipesModule,
    IngredientsModule,
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
