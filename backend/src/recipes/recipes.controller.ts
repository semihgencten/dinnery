import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Recipe } from './domain/recipe.model';
import { CreateRecipeDto } from './dtos/recipe.dto';
import { UserRecipeRole } from './domain/user-recipe.model';
import { AuthGuard } from '../auth/auth.guard';

@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) { }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return this.recipesService.create(createRecipeDto);
  }

  @Get()
  async findAll(): Promise<Recipe[]> {
    return this.recipesService.findAll();
  }

  @Get('search')
  async search(
    @Query('category') category?: string,
    @Query('name') name?: string,
  ): Promise<Recipe[]> {
    return this.recipesService.search(name, category);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: number, @Query('role') role: UserRecipeRole): Promise<Recipe[]> {
    return this.recipesService.findByUserAndRole(userId, role);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Recipe> {
    return this.recipesService.findOne(id);
  }

  @Post(':id/fork')
  @UseGuards(AuthGuard)
  async fork(@Param('id') id: number, @Req() req: any): Promise<Recipe> {
    return this.recipesService.fork(id, req.user.sub);
  }
}
