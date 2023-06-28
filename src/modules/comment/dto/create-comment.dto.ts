import {IsInt, IsMongoId, IsString, Max, MaxLength, Min, MinLength} from 'class-validator';
import {CommentRatingValid, CommentTextValid} from '../../../types/validate-params.enum.js';

export default class CreateCommentDto {
  @IsString({message: 'text is required'})
  @MinLength(CommentTextValid.MinLength,
    {message: `Text must be at least ${CommentTextValid.MinLength} characters long`}
  )
  @MaxLength(CommentTextValid.MaxLength,
    {message: `Text must be at most ${CommentTextValid.MaxLength} characters long`}
  )
  public text!: string;

  @IsInt({message: 'rating must be an integer'})
  @Min(CommentRatingValid.MinValue,
    {message: `Rating must be at least ${CommentRatingValid.MinValue}`}
  )
  @Max(CommentRatingValid.MaxValue,
    {message: `Rating must be at most ${CommentRatingValid.MaxValue}`}
  )
  public rating!: number;

  @IsMongoId({message: 'filmId is must be a valid id'})
  public filmId!: string;

  public user!: string;
}
