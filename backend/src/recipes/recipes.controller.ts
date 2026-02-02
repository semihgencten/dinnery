import { Body, Controller, Get, Param, Post, Query, Req, UseGuards, ParseIntPipe, Patch, Delete, HttpCode } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Recipe } from './domain/recipe.model';
import { CreateRecipeDto, UpdateRecipeDto } from './dtos/recipe.dto';
import { UserRecipeRole } from './domain/user-recipe.model';
import { AuthGuard } from '../auth/auth.guard';
import { Comment } from './domain/comment.model';
import { CreateCommentDto } from './dtos/comment.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) { }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createRecipeDto: CreateRecipeDto, @Req() req: any): Promise<Recipe> {
    return this.recipesService.create(createRecipeDto, req.user.sub);
  }

  @Get()
  async findAll(
    @Query('offset') offset?: number,
    @Query('limit') limit?: number
  ): Promise<Recipe[]> {
    return this.recipesService.findAll(offset, limit);
  }

  @Get('search')
  async search(
    @Query('category') category?: string,
    @Query('name') name?: string,
  ): Promise<Recipe[]> {
    return this.recipesService.search(name, category);
  }

  @Post('search/ingredients')
  @HttpCode(200)
  async searchByIngredients(@Body() ingredients: string[]): Promise<Recipe[]> {
    return this.recipesService.searchByIngredients(ingredients);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId', ParseIntPipe) userId: number, @Query('role') role: UserRecipeRole): Promise<Recipe[]> {
    return this.recipesService.findByUserAndRole(userId, role);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Recipe> {
    return this.recipesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateRecipeDto: UpdateRecipeDto, @Req() req: any): Promise<Recipe> {
    return this.recipesService.update(id, updateRecipeDto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any): Promise<void> {
    return this.recipesService.remove(id, req.user.sub);
  }

  @Post(':id/fork')
  @UseGuards(AuthGuard)
  async fork(@Param('id', ParseIntPipe) id: number, @Req() req: any): Promise<Recipe> {
    return this.recipesService.fork(id, req.user.sub);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard)
  async toggleLike(@Param('id', ParseIntPipe) id: number, @Req() req: any): Promise<{ liked: boolean; likesCount: number }> {
    return this.recipesService.toggleLike(id, req.user.sub);
  }

  @Post(':id/comments')
  @UseGuards(AuthGuard)
  async addComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: any
  ): Promise<Comment> {
    return this.recipesService.addComment(id, req.user.sub, createCommentDto);
  }

  @Get(':id/comments')
  async getComments(@Param('id', ParseIntPipe) id: number): Promise<Comment[]> {
    return this.recipesService.getComments(id);
  }
}

