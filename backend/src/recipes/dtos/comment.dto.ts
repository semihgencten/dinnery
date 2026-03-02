import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class RecipeAddCommentRequestDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    text: string;
}

export class CommentBaseResponseDto {
    id: number;
    userId: number;
    recipeId: number;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}

export class RecipeAddCommentResponseDto extends CommentBaseResponseDto { }
export class RecipeGetCommentsResponseDto extends CommentBaseResponseDto { }

