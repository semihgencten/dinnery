import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecipesModule } from './recipes/recipes.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import cloudinaryConfig from './config/cloudinary.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [cloudinaryConfig],
    }),
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
    AuthModule,
    CloudinaryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
