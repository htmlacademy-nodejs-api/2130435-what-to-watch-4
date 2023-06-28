import {Genre} from '../../../types/film.type.js';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt, IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';
import {FilmDescriptionValid, FilmDirectorValid, FilmTitleValid} from '../../../types/validate-params.enum.js';

export default class UpdateFilmDto {
  @IsOptional()
  @MinLength(FilmTitleValid.MinLength,
    {message: `Title must be at least ${FilmTitleValid.MinLength} characters long`}
  )
  @MaxLength(FilmTitleValid.MaxLength,
    {message: `Title must be at most ${FilmTitleValid.MaxLength} characters long`}
  )
  public title?: string;

  @IsOptional()
  @MinLength(FilmDescriptionValid.MinLength,
    {message: `Description must be at least ${FilmDescriptionValid.MinLength} characters long`}
  )
  @MaxLength(FilmDescriptionValid.MaxLength,
    {message: `Description must be at most ${FilmDescriptionValid.MaxLength} characters long`}
  )
  public description?: string;

  @IsOptional()
  @IsEnum(Genre, {message: 'genre must be a valid Genre'})
  public genre?: Genre[];

  @IsOptional()
  @IsDateString({}, {message: 'realiseDate must be a valid ISO date'})
  public realiseDate?: Date;

  @IsOptional()
  @IsString({message: 'previewVideo is required'})
  public previewVideo?: string;

  @IsOptional()
  @IsString({message: 'videoLink is required'})
  public videoLink?: string;

  @IsOptional()
  @IsArray({message: 'actors must be an array'})
  public actors?: string[];

  @IsOptional()
  @MinLength(FilmDirectorValid.MinLength,
    {message: `Director must be at least ${FilmDirectorValid.MinLength} characters long`}
  )
  @MaxLength(FilmDirectorValid.MaxLength,
    {message: `Director must be at most ${FilmDirectorValid.MaxLength} characters long`}
  )
  public director?: string;

  @IsOptional()
  @IsInt({message: 'duration must be an integer'})
  public duration?: number;

  @IsOptional()
  @IsString({message: 'poster is required'})
  @Matches(/.jpg/gi,
    {message: 'backgroundImage must be a valid image'}
  )
  public poster?: string;

  @IsOptional()
  @IsString({message: 'backgroundImage is required'})
  @Matches(/.jpg/gi,
    {message: 'backgroundImage must be a valid image'}
  )
  public backgroundImage?: string;

  @IsOptional()
  @IsString({message: 'backgroundColor is required'})
  @Matches(/#[0-9a-fA-F]{6}/gi,
    {message: 'backgroundColor must be a valid color'}
  )
  public backgroundColor?: string;
}
