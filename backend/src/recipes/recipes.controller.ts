import { Body, Controller, Get, Param, Post, Query, Req, UseGuards, ParseIntPipe, Patch, Delete, HttpCode } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import {
  RecipeCreateRequestDto,
  RecipeUpdateRequestDto,
  RecipeCreateResponseDto,
  RecipeGetAllResponseDto,
  RecipeSearchResponseDto,
  RecipeSearchByIngredientsRequestDto,
  RecipeSearchByIngredientsResponseDto,
  RecipeGetByUserResponseDto,
  RecipeGetResponseDto,
  RecipeUpdateResponseDto,
  RecipeForkResponseDto,
  RecipeSaveRequestDto,
  RecipeSaveResponseDto,
  RecipeUnsaveResponseDto,
  RecipeToggleLikeResponseDto
} from './dtos/recipe.dto';
import { UserRecipeRole } from './domain/user-recipe.model';
import { AuthGuard } from '../auth/auth.guard';
import {
  RecipeAddCommentRequestDto,
  RecipeAddCommentResponseDto,
  RecipeGetCommentsResponseDto
} from './dtos/comment.dto';

import { OptionalAuthGuard } from '../auth/optional-auth.guard';

@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) { }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createRecipeDto: RecipeCreateRequestDto, @Req() req: any): Promise<RecipeCreateResponseDto> {
    const recipe = await this.recipesService.create(createRecipeDto, req.user.sub);
    return recipe; // The service logic needs to return correctly mapped response if we want strict separation, but returning the mapped domain model that satisfies the interface is accepted in TS. For best practice, we can let TS duck typing handle it or we'd map explicitly. NestJS controllers typically return domain and class-serializer handles it.
  }

  @Get()
  @UseGuards(OptionalAuthGuard)
  async findAll(
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
    @Req() req?: any
  ): Promise<RecipeGetAllResponseDto[]> {
    return this.recipesService.findAll(offset, limit, req?.user?.sub);
  }

  @Get('search')
  @UseGuards(OptionalAuthGuard)
  async search(
    @Query('category') category?: string,
    @Query('name') name?: string,
    @Req() req?: any
  ): Promise<RecipeSearchResponseDto[]> {
    return this.recipesService.search(name, category, req?.user?.sub);
  }

  @Post('search/ingredients')
  @HttpCode(200)
  @UseGuards(OptionalAuthGuard)
  async searchByIngredients(@Body() body: RecipeSearchByIngredientsRequestDto, @Req() req?: any): Promise<RecipeSearchByIngredientsResponseDto[]> {
    return this.recipesService.searchByIngredients(body.ingredients);
  }

  @Get('user/:userId')
  @UseGuards(OptionalAuthGuard)
  async findByUser(@Param('userId', ParseIntPipe) userId: number, @Query('role') role: UserRecipeRole, @Req() req?: any): Promise<RecipeGetByUserResponseDto[]> {
    return this.recipesService.findByUserAndRole(userId, role, req?.user?.sub);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<RecipeGetResponseDto> {
    return this.recipesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateRecipeDto: RecipeUpdateRequestDto, @Req() req: any): Promise<RecipeUpdateResponseDto> {
    return this.recipesService.update(id, updateRecipeDto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any): Promise<void> {
    return this.recipesService.remove(id, req.user.sub);
  }

  @Post(':id/fork')
  @UseGuards(AuthGuard)
  async fork(@Param('id', ParseIntPipe) id: number, @Req() req: any): Promise<RecipeForkResponseDto> {
    return this.recipesService.fork(id, req.user.sub);
  }

  @Post(':id/save')
  @UseGuards(AuthGuard)
  async saveRecipe(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: RecipeSaveRequestDto,
    @Req() req: any
  ): Promise<RecipeSaveResponseDto> {
    return this.recipesService.saveRecipe(id, req.user.sub, body.collection);
  }

  @Delete(':id/save')
  @UseGuards(AuthGuard)
  async unsaveRecipe(
    @Param('id', ParseIntPipe) id: number,
    @Query('collection') collection: string,
    @Req() req: any
  ): Promise<RecipeUnsaveResponseDto> {
    return this.recipesService.unsaveRecipe(id, req.user.sub, collection);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard)
  async toggleLike(@Param('id', ParseIntPipe) id: number, @Req() req: any): Promise<RecipeToggleLikeResponseDto> {
    return this.recipesService.toggleLike(id, req.user.sub);
  }

  @Post(':id/comments')
  @UseGuards(AuthGuard)
  async addComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() createCommentDto: RecipeAddCommentRequestDto,
    @Req() req: any
  ): Promise<RecipeAddCommentResponseDto> {
    return this.recipesService.addComment(id, req.user.sub, createCommentDto);
  }

  @Get(':id/comments')
  async getComments(@Param('id', ParseIntPipe) id: number): Promise<RecipeGetCommentsResponseDto[]> {
    return this.recipesService.getComments(id);
  }
}

